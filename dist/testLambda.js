"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helloworld_1 = require("./helloworld");
// Mock event
const event = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "GET",
    isBase64Encoded: false,
    path: "/",
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {}, // Provide additional fields if needed
    resource: "/"
};
// Call the handler
(async () => {
    const result = await (0, helloworld_1.handler)(event);
    console.log("Lambda response:", result);
})();
