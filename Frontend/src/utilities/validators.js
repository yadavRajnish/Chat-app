import { isValidUsername } from "6pp";

export const userNameValidator = (username) => {
  if (!isValidUsername(username))
    return {
      isvalid: false,
      errorMessage: "username is involid",
    };
};
