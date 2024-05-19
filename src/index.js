import express from "express";
import usersRoute from "./routes/users.js";
import productsRouter from "./routes/products.js";

const app = express();

const PORT = process.env.PORT || 3000;

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

app.use(express.json());

// app.use(loggerMiddleware, (req, res, next) => {
//   console.log("logger 2");
//   next();
// });

// We Can Write Middlewares like this
// app.get("/", (req, res, next) => {
//     console.log(`${req.method} - ${req.url}`);
//   },
//   (req, res) => {
//     res.status(201).send({ message: "hello" });
//   }
// );

app.use("/api/users", usersRoute);

app.use("/api/products", productsRouter);

app.listen(PORT, () => console.log(`live on ${PORT}`));