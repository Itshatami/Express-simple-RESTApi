import express from "express";
import routes from "./routes/routes.js";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser("main-cookie-secret"));
app.use(
  session({
    secret: "app-session-secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(routes);

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;  
  res.cookie("username", "Alireza", { maxAge: 60000 * 60, signed: true });
  res.status(201).send({ msg: "Hii There." });
});

app.listen(PORT, () => console.log(`live on ${PORT}`));
