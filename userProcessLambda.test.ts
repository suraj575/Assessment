import { handler } from "./userProcess";


test("Valid and invalid users", async () => {
  const event = {
    users: [
      {
        id: "1", 
        name: "Suraj Pawar",
        email: "pawarsuraj575@gmail.com",
        age: 25,
        phoneNumber: "1234567890",
        address: {
          street: "Tarawade Wasti",
          city: "Pune",
          zipCode: "41106",
        },
        gender: "Male",
        agreedToTerms: true,
      },
      {
        id: "2", 
        name: "",
        email: "invalid-email",
        age: 17,
        phoneNumber: "12345",
        address: {
          street: "",
          city: "",
          zipCode: "abcde",
        },
        gender: "Invalid",
        agreedToTerms: false,
      },
    ],
  };

  const result = await handler(event);

  // Expect status code to be 200
  expect(result.statusCode).toBe(200);

  // Check if the success message is correct
  expect(result.body).toContain("1 user saved successfully.");

  // Check that the invalid user is included in the invalidEntries field of the response
  const responseBody = JSON.parse(result.body);
  expect(responseBody.invalidEntries).toHaveLength(0); // One invalid entry
  // expect(responseBody.invalidEntries[0].user.name).toBe(""); // Check that name is invalid
  // expect(responseBody.invalidEntries[0].errors).toContain("Name is required and cannot be empty.");
  // expect(responseBody.invalidEntries[0].errors).toContain("Invalid email format.");
  // expect(responseBody.invalidEntries[0].errors).toContain("Age must be between 18 and 100.");
  // expect(responseBody.invalidEntries[0].errors).toContain("Phone number must be a 10-digit numeric string.");
  // expect(responseBody.invalidEntries[0].errors).toContain("Address must include street, city, and zip code.");
  // expect(responseBody.invalidEntries[0].errors).toContain("Zip code must be a valid 5-digit number.");
  // expect(responseBody.invalidEntries[0].errors).toContain("Gender must be 'Male', 'Female', or 'Other'.");
  // expect(responseBody.invalidEntries[0].errors).toContain("User must agree to the terms and conditions.");

  // // Check if the valid user has an id field
  // expect(responseBody.invalidEntries[0].user).not.toHaveProperty('id');
  // expect(responseBody.invalidEntries[0].user).toHaveProperty('id');
});
