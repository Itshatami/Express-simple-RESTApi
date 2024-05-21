import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies);
  console.log(req.signedCookies);
  if (req.signedCookies.username && req.signedCookies.username === "Alireza")
    return res.send([{ id: 1, name: "iphone 12", price: 2000 }]);
  return res.send({ msg: "incorrect cookie" });
});

export default router;
