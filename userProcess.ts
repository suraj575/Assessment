import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new DynamoDB.DocumentClient({
    endpoint: "http://localhost:8000",
    region: "ap-southeast-1",
});
const TABLE_NAME = "Users";

interface User {
  id: string; 
  name: string;
  email: string;
  age: number;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  gender: string;
  agreedToTerms: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const handler = async (event: { body: string }) => {
  const users: User[] = JSON.parse(event.body);
  // console.log("User--->", users)
  if (!Array.isArray(users)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid input: users must be an array." }),
    };
  }

  const invalidEntries: { user: User; errors: string[] }[] = [];
  const validEntries: User[] = [];

  for (const user of users) {
    const { isValid, errors } = validateUser(user);
    if (isValid) {
      validEntries.push(user);
    } else {
      invalidEntries.push({ user, errors });
    }
  }

  // console.log("Valid Users",validEntries)
  if (validEntries.length > 0) {
    await saveUserstoDB(validEntries);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${validEntries.length} user saved successfully.`,
      invalidEntries,
    }),
  };
};

const validateUser = (user: User): ValidationResult => {
  const errors: string[] = [];


  if (!user.name || user.name.trim() === "") {
    errors.push("Name is required and cannot be empty.");
    console.log(errors)
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    errors.push("Invalid email.");
  }


  if (user.age < 18 || user.age > 100) {
    errors.push("Age must be between 18 and 100.");
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(user.phoneNumber)) {
    errors.push("Phone number must be a 10 digit number.");
  }


  if (!user.address || !user.address.street || !user.address.city || !user.address.zipCode) {
    errors.push("Address must include street, city, and zip code.");
  } else {
    const zipCodeRegex = /^\d{5}$/;
    if (!zipCodeRegex.test(user.address.zipCode)) {
      errors.push("Zip code must be a valid 5-digit number.");
    }
  }


  const gender = ["Male", "Female", "Other"]
  if (!gender.includes(user.gender)) {
    errors.push("Gender must be 'Male', 'Female', or 'Other'.");
  }

  
  if (!user.agreedToTerms) {
    errors.push("User must agree to the terms and conditions.");
  }

  return { isValid: errors.length === 0, errors };
};

const saveUserstoDB = async (users: User[]) => {
  const putRequests = users.map((user) => ({
    PutRequest: {
      Item:{ 
        ...user,
        id: uuidv4(), 

      },
    },
  }));

  const params = {
    RequestItems: {
      [TABLE_NAME]: putRequests,
    },
  };

  try {
    await dynamoDb.batchWrite(params).promise();
    console.log("Users saved to DynamoDB successfully.");
  } catch (error) {
    console.error("Error saving users to DynamoDB:", error);
    throw new Error("Failed to save users.");
  }
};
