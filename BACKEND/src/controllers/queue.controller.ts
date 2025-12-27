import { Request, Response } from "express";
import { db } from "../services/db.service";

export const joinQueue = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Step 1: Check if any table is AVAILABLE
    const availStmt = db.prepare(
      "SELECT id FROM tables_reservations WHERE status = 'AVAILABLE' LIMIT 1"
    );
    const availTable: any = availStmt.get();

    if (availTable) {
      return res.status(200).json({
        message: "Table available. No need to join queue."
      });
    }

    // Step 2: Get oldest RESERVED table (FIFO queue)
    const queueStmt = db.prepare(
      `SELECT id FROM tables_reservations 
       WHERE status = 'RESERVED'
       ORDER BY reservation_time ASC
       LIMIT 1`
    );
    const queueTable: any = queueStmt.get();

    if (!queueTable) {
      return res.status(400).json({
        message: "No queue slot available"
      });
    }

    const tableId = queueTable.id;

    // Step 3: Update selected table
    const updateStmt = db.prepare(
      `UPDATE tables_reservations
       SET current_customer_id = ?, reservation_time = CURRENT_TIMESTAMP
       WHERE id = ?`
    );
    updateStmt.run(user_id, tableId);

    return res.status(200).json({
      message: "Joined queue successfully"
    });

  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to join queue",
      error: error.message
    });
  }
};

export const seatFromQueue = async (req: Request, res: Response) => {
  try {
    // Step 1: get oldest queued customer
    const queueStmt = db.prepare(
      `SELECT id, current_customer_id 
       FROM tables_reservations
       WHERE status = 'RESERVED'
       ORDER BY reservation_time ASC
       LIMIT 1`
    );
    const queued: any = queueStmt.get();

    if (!queued) {
      return res.status(400).json({
        message: "No customers in queue"
      });
    }

    const queueTableId = queued.id;
    const customerId = queued.current_customer_id;

    // Step 2: find available table
    const availStmt = db.prepare(
      `SELECT id FROM tables_reservations
       WHERE status = 'AVAILABLE'
       LIMIT 1`
    );
    const available: any = availStmt.get();

    if (!available) {
      return res.status(400).json({
        message: "No available tables"
      });
    }

    const availableTableId = available.id;

    // Step 3: seat customer
    const seatStmt = db.prepare(
      `UPDATE tables_reservations
       SET status = 'OCCUPIED', current_customer_id = ?
       WHERE id = ?`
    );
    seatStmt.run(customerId, availableTableId);

    // Step 4: clear queue slot
    const clearStmt = db.prepare(
      `UPDATE tables_reservations
       SET status = 'AVAILABLE',
           current_customer_id = NULL,
           reservation_time = NULL
       WHERE id = ?`
    );
    clearStmt.run(queueTableId);

    return res.status(200).json({
      message: "Customer seated successfully",
      tableId: availableTableId,
      customerId
    });

  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to seat customer",
      error: error.message
    });
  }
};

