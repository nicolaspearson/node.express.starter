// Configure environment variables
process.env.API_PORT = '3000';
process.env.ENVIRONMENT = 'unit';
process.env.NODE_ENV = 'test';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const typeorm = require('typeorm');
typeorm.getConnection = jest.fn();
typeorm.getCustomRepository = jest.fn();
(typeorm.getManager = jest.fn()), (typeorm.QueryFailedError = jest.fn());
