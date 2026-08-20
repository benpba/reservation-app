const pool = require('../config/db');

exports.createReservation = async (req, res) => {
  const { table_id, reservation_date, reservation_time, party_size } = req.body;
  const user_id = req.user.id;

  if (!table_id || !reservation_date || !reservation_time || !party_size) {
    return res.status(400).json({ error: 'table_id, reservation_date, reservation_time, and party_size are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO reservations (user_id, table_id, reservation_date, reservation_time, party_size)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, table_id, reservation_date, reservation_time, party_size]
    );
    res.status(201).json({ id: result.insertId, table_id, reservation_date, reservation_time, party_size });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'That table is already booked for this date and time' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

exports.getMyReservations = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.reservation_date, r.reservation_time, r.party_size, r.status, t.table_number, t.seats
       FROM reservations r
       JOIN tables t ON r.table_id = t.id
       WHERE r.user_id = ?
       ORDER BY r.reservation_date, r.reservation_time`,
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

exports.cancelReservation = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      `UPDATE reservations SET status = 'cancelled' WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
};
