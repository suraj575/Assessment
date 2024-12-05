module.exports = {
  preset: "ts-jest", // Use ts-jest for TypeScript
  testEnvironment: "node", // Specify test environment
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Use ts-jest for TypeScript files
  },
  moduleFileExtensions: ["ts", "tsx", "js"], // Support TypeScript and JavaScript files
};
