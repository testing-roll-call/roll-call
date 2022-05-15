const handleStudentStats = require('../routes/users').handleStudentStats;
const calculateClassAttendanceBetweenDates = require('../routes/users').calculateClassAttendanceBetweenDates;

describe('handleStudentStats method', () => {
  // all test cases have 3 parameters: length of the array; an array made of the testing objects; result object
  it.each([
    // test case 1
    [
      // description
      '2 out of 4',
      // testing data
      [ 
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-05-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 1},
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-06-03 08:30:00', teacher_name: 'Camden', teacher_surname: 'Goff', className: 'SD22w', courseName: 'Testing', isAttending: 1},
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-13-03 08:30:00', teacher_name: 'Camden', teacher_surname: 'Goff', className: 'SD22w', courseName: 'Testing', isAttending: 0},
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-08-03 08:30:00', teacher_name: 'McKenzie', teacher_surname: 'Contreras', className: 'SD22w', courseName: 'Databases for Developers', isAttending: 0},
      ], 
      // expected results
      { firstName: 'Cristi', lastName: 'Ou', 'Development of Large Systems': '100.00', 'Testing': '50.00', 'Databases for Developers': '0.00' }
    ],
    // test case 2
    [
      // description
      '3 out of 3',
      // testing data
      [ 
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-05-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 1},
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-12-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 1},
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-19-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 1},
      ],
      // expected results
      {firstName: 'Cristi', lastName: 'Ou', 'Development of Large Systems': '100.00'}
    ],
    // test case 3
    [
      // description
      '0 out of 3',
      // testing data
      [ 
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-05-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 0},
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-12-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 0},
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-19-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 0},
      ],
      // expected results
      {firstName: 'Cristi', lastName: 'Ou', 'Development of Large Systems': '0.00'}
    ],
    // test case 4
    [
      // description
      '2 out of 3',
      // testing data
      [ 
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-05-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Testing', isAttending: 1},
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-12-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Testing', isAttending: 0},
        {firstName: 'Cristi', lastName: 'Ou', classStartDate: '2022-19-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Testing', isAttending: 1}
      ],
      // expected results
      {firstName: 'Cristi', lastName: 'Ou', 'Testing': '66.67'}
    ]
  ])('%s attendance(s)', (attendance, data, result) => {
    expect(handleStudentStats(data)).toEqual(result);
  });
});

describe('calculateClassAttendanceBetweenDates method', () => {
  const student1Attendance  = {firstName: 'Iona', lastName: 'Shepherd', email: 'i-shepherd2902@hotmail.org'};
  const student2Attendance = {};
  it.each([
    // RULE: oldDate <= classStartDate <= date
    // oldDate can be: 1. newDate(0) which is smaller date value possible, 2. one month before the current date set at midnight, 3. one week before the current date set at midnight
    // We are assured that oldDate < date

    //test case 1
    [
      // description
      '0 in this week',
      // testing data: classStartDate < oldDate
      [{...student1Attendance, classStartDate: new Date('2022-03-20T08:41:24'), isAttending: 1}],
      new Date('2022-03-30T08:41:24'),
      new Date('2022-03-21T00:00:00'),
      // expected results
      '0.00'
    ],
    [
      // description
      '1 in this week',
      // testing data: classStartDate > oldDate
      [{...student1Attendance, classStartDate: new Date('2022-03-21T08:41:24'), isAttending: 1}],
      new Date('2022-03-30T08:41:24'),
      new Date('2022-03-21T00:00:00'),
      // expected results
      '100.00'
    ],
    [
      // description
      '1 in this week',
      // testing data: classStartDate = currentDate
      [{...student1Attendance, classStartDate: new Date('2022-03-30T08:41:24'), isAttending: 1}],
      new Date('2022-03-30T08:41:24'),
      new Date('2022-03-21T00:00:00'),
      // expected results
      '100.00'
    ],
    [
      // description
      '0 in this week',
      // testing data: not attended
      [{...student1Attendance, classStartDate: new Date('2022-03-25T08:41:24'), isAttending: 0}],
      new Date('2022-03-30T16:41:24'),
      new Date('2022-03-21T00:00:00'),
      // expected results
      '0.00'
    ]

    

  ])('%s attendance(s)', (description, attendance, date, oldDate, result) => {
    expect(calculateClassAttendanceBetweenDates(attendance, date, oldDate)).toEqual(result);
  });
});
