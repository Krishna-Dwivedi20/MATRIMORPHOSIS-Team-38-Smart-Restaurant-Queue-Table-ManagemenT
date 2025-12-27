import { Request, Response } from "express";
import { db } from "../services/db.service";

export const joinQueue = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Step 1: Check if any table is AVAILABLE
    const [availableTables]: any = await db.query(
      "SELECT id FROM tables_reservations WHERE status = 'AVAILABLE' LIMIT 1"
    );

    if (availableTables.length > 0) {
      return res.status(200).json({
        message: "Table available. No need to join queue."
      });
    }

    // Step 2: Get oldest RESERVED table (FIFO queue)
    const [queueTables]: any = await db.query(
      `SELECT id FROM tables_reservations 
       WHERE status = 'RESERVED'
       ORDER BY reservation_time ASC
       LIMIT 1`
    );

    if (queueTables.length === 0) {
      return res.status(400).json({
        message: "No queue slot available"
      });
    }

    const tableId = queueTables[0].id;

    // Step 3: Update selected table
    await db.query(
      `UPDATE tables_reservations
       SET current_customer_id = ?, reservation_time = NOW()
       WHERE id = ?`,
      [user_id, tableId]
    );

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
    const [queued]: any = await db.query(
      `SELECT id, current_customer_id 
       FROM tables_reservations
       WHERE status = 'RESERVED'
       ORDER BY reservation_time ASC
       LIMIT 1`
    );

    if (queued.length === 0) {
      return res.status(400).json({
        message: "No customers in queue"
      });
    }

    const queueTableId = queued[0].id;
    const customerId = queued[0].current_customer_id;

    // Step 2: find available table
    const [available]: any = await db.query(
      `SELECT id FROM tables_reservations
       WHERE status = 'AVAILABLE'
       LIMIT 1`
    );

    if (available.length === 0) {
      return res.status(400).json({
        message: "No available tables"
      });
    }

    const availableTableId = available[0].id;

    // Step 3: seat customer
    await db.query(
      `UPDATE tables_reservations
       SET status = 'OCCUPIED', current_customer_id = ?
       WHERE id = ?`,
      [customerId, availableTableId]
    );

    // Step 4: clear queue slot
    await db.query(
      `UPDATE tables_reservations
       SET status = 'AVAILABLE',
           current_customer_id = NULL,
           reservation_time = NULL
       WHERE id = ?`,
      [queueTableId]
    );

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

