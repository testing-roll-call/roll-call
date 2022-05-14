const { Utils } = require('../models/Utils');
const Utilities = new Utils();

describe('generateCode test', () => {
    //does it make sense to test this as we just use it once and with hardcoded length value?

    //there's no way it's gonna have other characters as these are hardcoded...
    const allowedCharactersRegex = new RegExp(/[a-zA-Z0-9]*/);

    const testsDefinedValues = [
        { args: 10, expected: 10 },
        { args: 5, expected: 5 },
        { args: 0, expected: 0 },
        { args: -1, expected: 0 },
      ];
    
      testsDefinedValues.forEach(({ args, expected }) => {
        test(`generateCode with length ${args} and valid characters`, () => {
            expect(Utilities.generateCode(args).length).toEqual(expected);
            expect(Utilities.generateCode(args)).toMatch(allowedCharactersRegex);
        });
      });

      /*testsNotNumber.forEach(({ args }) => {
        test('throw an exception because passed parameter is not a number', () => {
          expect(() => { getRandomNumber(args); }).toThrow('Passed parameter is not a number.');
          expect(() => { getRandomNumber(0, args); }).toThrow('Passed parameter is not a number.');
        });
      });*/


});