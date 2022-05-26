const { Utils } = require('../models/Utils');

const Utilities = new Utils();

describe('generateCode test', () => {
    //Arrange
    const allowedCharactersRegex = new RegExp(/[a-zA-Z0-9]*/);

    const testsDefinedValues = [
        { args: 1, expected: 1 },
        { args: 2, expected: 2 },
        { args: 50, expected: 50 },
        { args: 99, expected: 99 },
        { args: 100, expected: 100 },
        //"invalid" tests
        { args: -10, expected: 0 },
        { args: 0, expected: 0 },
        { args: -101, expected: 0 },
        { args: 25.8, expected: 26 },
        { args: 25.3, expected: 26 },
        { args: 101, expected: 0 },
        { args: 500, expected: 0 },
      ];
    //Act + Assert
      testsDefinedValues.forEach(({ args, expected }) => {
        test(`generateCode with length ${args} and valid characters`, () => {
            expect(Utilities.generateCode(args).length).toEqual(expected);
            expect(Utilities.generateCode(args)).toMatch(allowedCharactersRegex);
        });
      });
    //Arrange
    const testsNonNumericValues = [
      { args: ''},
      { args: 'string'},
      { args: null},
    ];
    //Act + Assert
    testsNonNumericValues.forEach(({ args }) => {
      test(`generateCode throws exception because non numeric value ${args}`, () => {
          expect(() => { Utilities.generateCode(args); }).toThrow('Passed parameter is not a number.');
      });
    });

});

describe('generateRandomNumber test', () => {
  Number.MAX_VALUE
    const testsDefinedValues = [
      { args: [0, 1], expected: 0 },
      { args: [1, 2], expected: 1 },
      { args: [50, 51], expected: 50 },
      { args: [5, 5], expected: 5 },
      //input than 0 - return 0
      { args: [-5, 5], expected: 0 },
      { args: [Number.MAX_VALUE - 1, Number.MAX_VALUE], expected: Number.MAX_VALUE },
    ];
  
    testsDefinedValues.forEach(({ args, expected }) => {
      // run each test 100 times to try to catch an error
      for (let i = 0; i < 100; i++) {
        test(`get random number from ${args[0]} to ${args[1]} exclusive, try number: ${i}`, () => {
          expect(Utilities.generateRandomNumber(args[0], args[1])).toEqual(expected);
        });
      }
    });

    //reverse order
    testsDefinedValues.forEach(({ args, expected }) => {
      // run each test 100 times to try to catch an error
      for (let i = 0; i < 100; i++) {
        test(`get random number from ${args[1]} to ${args[0]} exclusive, try number: ${i}`, () => {
          expect(Utilities.generateRandomNumber(args[1], args[0])).toEqual(expected);
        });
      }
    });
  
    const testsUndefinedMax = [
      { args: 0, expected: [0, 1] },
      { args: 5, expected: [1, 5] },
    ];
  
    testsUndefinedMax.forEach(({ args, expected }) => {
      // run each test 100 times to try to catch an error
      for (let i = 0; i < 100; i++) {
        test(`get random number from ${args} to default exclusive, try number: ${i}`, () => {
          expect(Utilities.generateRandomNumber(args)).toBeGreaterThanOrEqual(expected[0]);
          expect(Utilities.generateRandomNumber(args)).toBeLessThan(expected[1]);
        });
      }
    });

    // run each test 100 times to try to catch an error
    for (let i = 0; i < 100; i++) {
      test(`get random number from default to default exclusive, try number: ${i}`, () => {
        expect(Utilities.generateRandomNumber()).toEqual(0);
      });
    }
  
    const testsNotNumber = [
      { args: 'text' },
      { args: '' },
      { args: null },
    ];
  
    testsNotNumber.forEach(({ args }) => {
      test('throw an exception because passed parameter is not a number', () => {
        expect(() => { Utilities.generateRandomNumber(args); }).toThrow('Passed parameter is not a number.');
        expect(() => { Utilities.generateRandomNumber(0, args); }).toThrow('Passed parameter is not a number.');
      });
    });
  
    const testsOutOfBoundsNegative = [
      { args: [-Number.MAX_VALUE * 5, -Number.MAX_VALUE * 10], expected: 0 },
    ];
  
    testsOutOfBoundsNegative.forEach(({ args, expected }) => {
      // run each test 100 times to try to catch an error
      for (let i = 0; i < 100; i++) {
        test(`get random number from ${args[0]} to ${args[1]} exclusive, try number: ${i}`, () => {
          expect(Utilities.generateRandomNumber(args[0], args[1])).toEqual(expected);
        });
      }
    });

    const testsOutOfBoundsPositive = [
      { args: [Number.MAX_VALUE * 5, Number.MAX_VALUE * 10]},
    ];

    testsOutOfBoundsPositive.forEach(({ args }) => {
      // run each test 100 times to try to catch an error
      for (let i = 0; i < 100; i++) {
        test(`get random number from ${args[0]} to ${args[1]} exclusive, try number: ${i}`, () => {
          expect(Utilities.generateRandomNumber(args[0], args[1])).toBeNaN();
        });
      }
    });
});
