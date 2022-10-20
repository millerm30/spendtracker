const express = require('express');
const cors = require('cors');
//const pool = require('./db');
const Pool = require('pg').Pool;
const app = express();
const PORT = process.env.PORT || 3010;
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});  

const pool = new Pool ({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});

// create a new transaction record

app.post('/transactions', async (req, res) => {
  try {
    const { item, price, record_time } = req.body;
    const newTransaction = await pool.query(
      'INSERT INTO transactions (item, price, record_time) VALUES ($1, $2, $3) RETURNING *',
      [item, price, record_time]
    );
  res.json(newTransaction.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get all transactions records

app.get('/transactions', async (req, res) => {
  try {
    const allTransactions = await pool.query('SELECT * FROM transactions');
    res.json(allTransactions.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// delete a transaction rrecord by the id

app.delete("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const transToDelete = await pool.query(
      "DELETE FROM transactions WHERE trans_id = $1",
      [id]
    );
    console.log("transaction is deleted.");
  } catch (error) {
    console.log(error);
  }
});