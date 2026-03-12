const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'EZTrack API',
        description: 'API documentation for EZTrack project management system',
        version: '1.0.0',
    },
    host: 'localhost:3001',
    basePath: '/api',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Bearer token for authentication',
        },
    },
};

const outputFile = './swagger-output.json';
const routes = [
    './src/index.ts',
    './src/routes/projects.ts',
    './src/routes/materials.ts',
    './src/routes/tools.ts',
    './src/routes/auth.ts',
];

swaggerAutogen(outputFile, routes, doc);
