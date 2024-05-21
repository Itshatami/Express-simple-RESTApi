import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { getUsersValidationSchema, creaetUserValidationSchema } from "../utils/validationSchemas.js";
import { mockUsers } from "../utils/constants.js";
import resolveIndexByUserId from "../middlewares/findUserMiddleware.js";

const router = Router();

router.get("/", checkSchema(getUsersValidationSchema), (req, res) => {
  const result = validationResult(req);
  // console.log(result);
  // console.log(req.session);
  console.log(req.session.id);
  req.sessionStore.get(req.session.id , (err , sessionData) => {
    if(err){
      console.log(err);
      throw err;
    }
    console.log(sessionData);
  })
  const {
    query: { filter, value },
  } = req;
  // if filter exist
  if (filter && value) return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  return res.send(mockUsers);
});

// GET single user
router.get("/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

// router.get("/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   if (isNaN(id)) return res.status(400).send({ msg: "Bad Request , invalid params" });
//   const user = mockUsers.find((u) => u.id === id);
//   if (!user) return res.status(404).send({ msg: "Not found user!" });
//   return res.send(user);
// });

// Create User
router.post("/api/users", checkSchema(creaetUserValidationSchema), (req, res) => {
  // Apply Express-validator
  const result = validationResult(req);
  // Check If Error
  if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

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
router.put("/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).send({ msg: "Bad Request! Invalid Id" });
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.status(404).send({ msg: "Not Found User!" });

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

// Update a user
router.patch("/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).send({ msg: "Bad Request! Invalid Id" });
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.status(404).send({ msg: "Not Found User!" });
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
router.delete("/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).send({ msg: "Bad Request! Invalid Id" });
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.status(404).send({ msg: "Not Found User" });
  mockUsers.splice(findUserIndex, 1);
  return res.send(200);
});

export default router;

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
