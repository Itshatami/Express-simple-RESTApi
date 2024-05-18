import express from "express";
import {
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  creaetUserValidationSchema,
  getUsersValidationSchema,
} from "./utils/validationSchemas.js";

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "john", displayName: "John" },
  { id: 2, username: "mej", displayName: "Mej" },
  { id: 3, username: "due", displayName: "Due" },
  { id: 4, username: "sina", displayName: "Sina" },
  { id: 5, username: "sepehr", displayName: "Sepehr" },
  { id: 6, username: "zivar", displayName: "Zivar" },
];

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

app.use(express.json());
app.use(loggerMiddleware, (req, res, next) => {
  console.log("logger 2");
  next();
});

app.get("/", loggerMiddleware, (req, res) => {
  res.status(201).send({ message: "hello" });
});

// We Can Write Middlewares like this
// app.get("/", (req, res, next) => {
//     console.log(`${req.method} - ${req.url}`);
//   },
//   (req, res) => {
//     res.status(201).send({ message: "hello" });
//   }
// );

// GET all users
app.get("/api/users", checkSchema(getUsersValidationSchema), (req, res) => {
  const result = validationResult(req);
  console.log(result);
  const {
    query: { filter, value },
  } = req;
  // if filter exist
  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  return res.send(mockUsers);
});

// GET single user
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))
    return res.status(400).send({ msg: "Bad Request , invalid params" });
  const user = mockUsers.find((u) => u.id === id);
  if (!user) return res.status(404).send({ msg: "Not found user!" });
  return res.send(user);
});

// Post create user
// app.post(
//   "/api/users",
//   [
//     body("username")
//       .notEmpty()
//       .withMessage("username must not be empty")
//       .isLength({ min: 2, max: 32 })
//       .withMessage("username must be min 2 char & max 32 char length")
//       .isString()
//       .withMessage("username must be string"),
//     body("displayName")
//       .notEmpty()
//       .withMessage("displayName Is Empty!")
//       .isString()
//       .withMessage("Must Be String!"),
//   ],
//   (req, res) => {
//     // Apply Express-validator
//     const result = validationResult(req);
//     // Check If Error
//     if (!result.isEmpty())
//       return res.status(400).send({ errors: result.array() });

//     const data = matchedData(req);
//     const newUser = {
//       id: mockUsers[mockUsers.length - 1].id + 1,
//       ...data,
//     };
//     if (!newUser) return res.status(400).send({ msg: "didnt created" });
//     mockUsers.push(newUser);
//     return res.status(201).send(newUser);
//   }
// );

app.post("/api/users", checkSchema(creaetUserValidationSchema), (req, res) => {
  // Apply Express-validator
  const result = validationResult(req);
  // Check If Error
  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });

  const data = matchedData(req);
  const newUser = {
    id: mockUsers[mockUsers.length - 1].id + 1,
    ...data,
  };
  if (!newUser) return res.status(400).send({ msg: "didnt created" });
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

// PUT update a user
app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad Request! Invalid Id" });
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1)
    return res.status(404).send({ msg: "Not Found User!" });

  try {
    mockUsers[findUserIndex] = {
      id: parsedId,
      ...body,
    };
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
  return res.sendStatus(202);
});

app.patch("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad Request! Invalid Id" });
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1)
    return res.status(404).send({ msg: "Not Found User!" });
  try {
    mockUsers[findUserIndex] = {
      ...mockUsers[findUserIndex],
      ...body,
    };
  } catch (error) {
    return res.status(400).send(error);
  }
  return res.status(204).send(mockUsers[findUserIndex]);
});

// DELETE a User
app.delete("/api/users/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad Request! Invalid Id" });
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1)
    return res.status(404).send({ msg: "Not Found User" });
  mockUsers.splice(findUserIndex, 1);
  return res.send(200);
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 1, name: "iphone 12", price: 2000 }]);
});

app.listen(PORT, () => console.log(`live on ${PORT}`));

// PUT
// PATCH
// DELETE
