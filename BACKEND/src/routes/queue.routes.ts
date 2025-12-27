import { Router } from "express";
import { joinQueue, seatFromQueue } from "../controllers/queue.controller";

const router = Router();

router.post("/join", joinQueue);
router.put("/seat", seatFromQueue);

export default router;
