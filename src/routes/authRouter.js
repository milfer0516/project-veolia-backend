import { Router } from "express";
import { googleLogin } from "../controllers/authController.js";

const router = Router();


router.get('/test', (req , res ) => {
  res.send('From tests')
});

router.get("/auth/google", googleLogin);

export default router;
