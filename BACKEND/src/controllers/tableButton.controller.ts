import { Router, Request, Response } from 'express';
import { db } from '../services/db.service';

const router = Router();

// Get all buttons for a specific table
router.get('/table/:tableId', async (req: Request, res: Response) => {
  try {
    const connection = await db.getConnection();
    const [buttons] = await connection.query(
      'SELECT * FROM table_buttons WHERE table_id = ? AND is_active = TRUE ORDER BY id',
      [req.params.tableId]
    );
    connection.release();
    res.json(buttons);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all buttons
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await db.getConnection();
    const [buttons] = await connection.query(
      'SELECT tb.*, tr.table_number FROM table_buttons tb JOIN tables_reservations tr ON tb.table_id = tr.id WHERE tb.is_active = TRUE ORDER BY tr.table_number'
    );
    connection.release();
    res.json(buttons);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new button
router.post('/', async (req: Request, res: Response) => {
  try {
    const { table_id, button_name, button_type, icon, color, action } = req.body;
    const connection = await db.getConnection();
    const [result]: any = await connection.query(
      'INSERT INTO table_buttons (table_id, button_name, button_type, icon, color, action) VALUES (?, ?, ?, ?, ?, ?)',
      [table_id, button_name, button_type, icon, color, action]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a button
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { button_name, button_type, icon, color, action, is_active } = req.body;
    const connection = await db.getConnection();
    await connection.query(
      'UPDATE table_buttons SET button_name = ?, button_type = ?, icon = ?, color = ?, action = ?, is_active = ? WHERE id = ?',
      [button_name, button_type, icon, color, action, is_active, req.params.id]
    );
    connection.release();
    res.json({ id: req.params.id, ...req.body });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a button (soft delete)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await db.getConnection();
    await connection.query(
      'UPDATE table_buttons SET is_active = FALSE WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    res.json({ message: 'Button deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
