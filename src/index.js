import express from "express";

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

app.use(express.json());

app.get("/", (req, res) => {
  res.status(201).send({ message: "hello" });
});

// GET all users
app.get("/api/users", (req, res) => {
  console.log(req.query);
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
app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = {
    id: mockUsers[mockUsers.length - 1].id + 1,
    ...body,
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
