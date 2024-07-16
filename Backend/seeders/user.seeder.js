import { userModel } from "../models/user.model.js";
import { faker } from "@faker-js/faker";

const createUser = async (numUsers) => {
  try {
    const userPromise = [];

    for (let index = 0; index < numUsers; index++) {
      const tempUser = userModel.create({
        name: faker.person.fullName(),
        username: faker.person.fullName(),
        bio: faker.lorem.sentence(10),
        password: "123",
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });
      userPromise.push(tempUser);
    }
    await Promise.all(userPromise);
    console.log("User created", numUsers);
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { createUser }