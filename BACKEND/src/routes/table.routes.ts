import { Router } from "express";
import {
  createTable,
  getAllTables,
  updateTableStatus,
  reserveTable,
  cancelReservation
} from "../controllers/table.controller";

const router = Router();

router.post("/", createTable);
router.get("/", getAllTables);
router.put("/:id/status", updateTableStatus);
router.post("/reserve", reserveTable);
router.put("/:table_id/cancel", cancelReservation);

export default router;
