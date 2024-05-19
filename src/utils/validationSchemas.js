export const creaetUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 2,
        max: 32,
      },
      errorMessage: "username must not be empty",
    },
    notEmpty: {
      errorMessage: "username should not be empty",
    },
    isString: {
      errorMessage: "username should be string!",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "displayName should not be empty!",
    },
  },
};

export const getUsersValidationSchema = {
  filter: {
    in: ["query"],
    isString: true,
    isLength: {
      options: {
        min: 1,
      },
      errorMessage: "Query filter must be at least 1 char",
    },
  },
  value: {
    in: ["query"],
    notEmpty: {
      errorMessage: "value must not be empty",
    },
  },
};
