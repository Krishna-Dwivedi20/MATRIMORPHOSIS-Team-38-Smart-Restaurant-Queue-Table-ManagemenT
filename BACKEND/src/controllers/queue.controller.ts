import { Request, Response } from "express";
import { db } from "../services/db.service";

export const joinQueue = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Step 1: Check if any table is AVAILABLE
    const [availTables] = await db.execute(
      "SELECT id FROM tables_reservations WHERE status = 'AVAILABLE' LIMIT 1"
    );

    if ((availTables as any[]).length > 0) {
      return res.status(200).json({
        message: "Table available. No need to join queue."
      });
    }

    // Step 2: Get oldest RESERVED table (FIFO queue)
    const [queueTables] = await db.execute(
      `SELECT id FROM tables_reservations 
       WHERE status = 'RESERVED'
       ORDER BY reservation_time ASC
       LIMIT 1`
    );

    if ((queueTables as any[]).length === 0) {
      return res.status(400).json({
        message: "No queue slot available"
      });
    }

    const tableId = (queueTables as any)[0].id;

    // Step 3: Update selected table
    await db.execute(
      `UPDATE tables_reservations
       SET current_customer_id = ?, reservation_time = CURRENT_TIMESTAMP
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
    const [queuedCustomers] = await db.execute(
      `SELECT id, current_customer_id 
       FROM tables_reservations
       WHERE status = 'RESERVED'
       ORDER BY reservation_time ASC
       LIMIT 1`
    );

    if ((queuedCustomers as any[]).length === 0) {
      return res.status(400).json({
        message: "No customers in queue"
      });
    }

    const queueTableId = (queuedCustomers as any)[0].id;
    const customerId = (queuedCustomers as any)[0].current_customer_id;

    // Step 2: find available table
    const [availableTables] = await db.execute(
      `SELECT id FROM tables_reservations
       WHERE status = 'AVAILABLE'
       LIMIT 1`
    );

    if ((availableTables as any[]).length === 0) {
      return res.status(400).json({
        message: "No available tables"
      });
    }

    const availableTableId = (availableTables as any)[0].id;

    // Step 3: seat customer
    await db.execute(
      `UPDATE tables_reservations
       SET status = 'OCCUPIED', current_customer_id = ?
       WHERE id = ?`,
      [customerId, availableTableId]
    );

    // Step 4: clear queue slot
    await db.execute(
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

