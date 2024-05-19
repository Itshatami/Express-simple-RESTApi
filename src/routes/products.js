import { Router } from "express";

const router = Router();

router.get('/' , (req,res)=>{
    res.send([{ id: 1, name: "iphone 12", price: 2000 }]);
})

export default router;