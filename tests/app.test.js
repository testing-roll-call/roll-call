const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

// DOES IT MAKE SENSE TO TEST THIS AS IT IS EXTERNAL MODULE WHICH JUST SHOULD WORK?
// as I also need to install socket.io-client for tests to work, else it would be just in frontend
describe('socket test', () => {
  let io; let serverSocket; let
    clientSocket;

  // setup client and server socket connection
  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const { port } = httpServer.address();
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  // close sockets
  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  jest.setTimeout(10000);
  test('test generateCode from server to client', (done) => {
    /* clientSocket.on(ev, (arg) => {
            expect(arg).toEqual(expected);
            done();
        }); */
    clientSocket.emit('generateCode', { classTeacherId: 1 });
    clientSocket.on('codeGenerated', (data) => {
      data.code.expect.stringMatching(/^[a-zA-Z0-9]{10}$/);
      data.classTeacherId.expect.toEqual(1);
      done();
    });
  });

  // server -> client
  // event, args = expected
  /* const testsClient = [
        {event: 'generateCode', expected: 1}, //classTeacherId
        {event: 'deleteCode', expected: {code: 'ASGXsfYE58', classTeacherId: 5}},
        {event: 'attendLecture', expected: {
            code: 'ASGXsfYE58',
            student: {
                studentId: 10,
                firstName: 'Ondrej',
                lastName: 'Surname',
                age: 15,
                email: 'name.surname@gmail.com'
            }}
        },
    ];

    testsClient.forEach(({ event, expected }) => {
        test(`test ${event} from server to client`, (done) => {
            clientSocket.on(event, (arg) => {
                expect(arg).toEqual(expected);
                done();
            });
            serverSocket.emit(event, expected);
        });
    });

    //client -> server
    //event, args = expected
    const testsServer = [
        {event: 'joinFailed', expected: null},
        {event: 'joinSuccessfull', expected: null},
        {event: 'codeGenerated', expected: {code: 'ASGXsfYE58', classTeacherId: 5}},
        {event: 'studentJoined', expected: {
            student: {
                studentId: 10,
                firstName: 'Ondrej',
                lastName: 'Surname',
                age: 15,
                email: 'name.surname@gmail.com'
            }}
        },
    ];

    testsServer.forEach(({ event, expected }) => {
        test(`test ${event} from client to server`, (done) => {
            serverSocket.on(event, (cb) => {
                cb(expected);
              });
            clientSocket.emit(event, (arg) => {
                expect(arg).toEqual(expected);
                done();
            });
        });
    });

    //specific functions that are called from sockets
    // */
});
