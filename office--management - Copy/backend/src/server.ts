import bcrypt from "bcryptjs";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
// const db = require('./dbConfig');
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./middleware/auth";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev server
      "http://localhost:3000", // Backend (for direct API calls)
      "http://localhost:8080", // Frontend (nginx in docker)
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Handle preflight requests for all routes
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Login API

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const [rows]: any = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Remove password from user object before sending
    const { password: _, ...userWithoutPassword } = user;
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );
    res.cookie("token", token);
    return res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// -----------------------User API--------------------------------

app.get("/users", authenticateToken, async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, join_date, check_in_time, check_out_time FROM users"
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.delete("/users", authenticateToken, async (req: Request, res: Response) => {
  try {
    const email = req.body;
    const [result]: any = await pool.query(
      `UPDATE users
         SET role = ?,
             left_date = CURDATE(),
             join_date = COALESCE(join_date, CURDATE())
       WHERE email = ?`,
      ["pastemp", email]
    );

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User marked as past employee" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Add User API
app.post("/users", authenticateToken, async (req: Request, res: Response) => {
  // const { name, email, password, role, joinDate, checkInTime, checkOutTime } = req.body;
  const name = req.body.name;
  const email = req.body.email;
  const role = req.body.role;
  const password = req.body.password;
  const joinDate = req.body.JoinDate;
  const checkInTime = req.body.checkInTime;
  const checkOutTime = req.body.checkOutTime;
  console.log(req.body);
  if (
    !name ||
    !email ||
    !password ||
    !role ||
    !joinDate ||
    !checkInTime ||
    !checkOutTime
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result]: any = await pool.query(
      `INSERT INTO users (name, email, password, role, join_date, check_in_time, check_out_time) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, joinDate, checkInTime, checkOutTime]
    );
    const [rows]: any = await pool.query(
      "SELECT id, name, email, role, join_date, check_in_time, check_out_time FROM users WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// Update User API
app.put(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const fields = req.body;
    // Build dynamic SQL for only provided fields
    const allowed = [
      "name",
      "email",
      "role",
      "joinDate",
      "checkInTime",
      "checkOutTime",
      "phone",
      "location",
    ];
    const updates: any = [];
    const values: any = [];
    allowed.forEach((key) => {
      if (fields[key] !== undefined) {
        // Map frontend keys to DB columns
        let col = key;
        if (key === "joinDate") col = "join_date";
        if (key === "checkInTime") col = "check_in_time";
        if (key === "checkOutTime") col = "check_out_time";
        updates.push(`${col} = ?`);
        values.push(fields[key]);
      }
    });
    if (updates.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }
    try {
      await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, [
        ...values,
        id,
      ]);
      const [rows]: any = await pool.query(
        "SELECT id, name, email, role, join_date, check_in_time, check_out_time, phone, location FROM users WHERE id = ?",
        [id]
      );
      if (rows.length === 0)
        return res.status(404).json({ message: "User not found" });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// Change User Password API
app.put(
  "/users/:id/password",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [
        hashedPassword,
        id,
      ]);
      res.json({ message: "Password updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// //Delete Users if admin delete it
// app.delete("/:email", authenticateToken , async (req: Request, res: Response) => {
//   const { email } = req.params;
//   try {
//     const [result]: any = await pool.query(
//       `UPDATE users
//          SET role = ?,
//              left_date = CURDATE(),
//              join_date = COALESCE(join_date, CURDATE())
//        WHERE email = ?`,
//       ["pastemp", email]
//     );

// if (!result || result.affectedRows === 0) {
//   return res.status(404).json({ message: "User not found" });
// }

// return res.json({ message: "User marked as past employee" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Database error" });
//   }
// });

// ------------------- TASKS API -------------------

// Get all tasks
app.get("/tasks", authenticateToken, async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Add a new task
app.post("/tasks", authenticateToken, async (req: Request, res: Response) => {
  const { user_id, title, description, status, due_date } = req.body;
  if (!user_id || !title) {
    return res.status(400).json({ message: "user_id and title are required" });
  }
  try {
    const [result]: any = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)`,
      [
        user_id,
        title,
        description || null,
        status || "pending",
        due_date || null,
      ]
    );
    const [rows]: any = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// Update a task
app.put(
  "/tasks/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, title, description, status, due_date } = req.body;
    if (!user_id || !title) {
      return res
        .status(400)
        .json({ message: "user_id and title are required" });
    }
    try {
      await pool.query(
        `UPDATE tasks SET user_id = ?, title = ?, description = ?, status = ?, due_date = ? WHERE id = ?`,
        [
          user_id,
          title,
          description || null,
          status || "pending",
          due_date || null,
          id,
        ]
      );
      const [rows]: any = await pool.query("SELECT * FROM tasks WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0)
        return res.status(404).json({ message: "Task not found" });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// Delete a task
app.delete(
  "/tasks/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const [result]: any = await pool.query("DELETE FROM tasks WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Task not found" });
      res.json({ message: "Task deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// ------------------- CHAT API -------------------

// Get all chat messages, or filter by sender_id or receiver_id
app.get("/chat", authenticateToken, async (req: Request, res: Response) => {
  const { sender_id, receiver_id } = req.query;
  let query = "SELECT * FROM chat";
  const params: any[] = [];
  if (sender_id && receiver_id) {
    query += " WHERE sender_id = ? AND receiver_id = ?";
    params.push(sender_id, receiver_id);
  } else if (sender_id) {
    query += " WHERE sender_id = ?";
    params.push(sender_id);
  } else if (receiver_id) {
    query += " WHERE receiver_id = ?";
    params.push(receiver_id);
  }
  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Send a chat message
app.post("/chat", authenticateToken, async (req: Request, res: Response) => {
  const { sender_id, receiver_id, message } = req.body;
  if (!sender_id || !receiver_id || !message) {
    return res
      .status(400)
      .json({ message: "sender_id, receiver_id, and message are required" });
  }
  try {
    const [result]: any = await pool.query(
      `INSERT INTO chat (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
      [sender_id, receiver_id, message]
    );
    const [rows]: any = await pool.query("SELECT * FROM chat WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// Delete a chat message
app.delete(
  "/chat/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const [result]: any = await pool.query("DELETE FROM chat WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Message not found" });
      res.json({ message: "Message deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// ------------------- ATTENDES API -------------------

// Get all attendes
app.get("/attendes", authenticateToken, async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM attendes");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Add a new attendes record
app.post(
  "/attendes",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { user_id, date, check_in_time, check_out_time, status } = req.body;
    if (!user_id || !date) {
      return res.status(400).json({ message: "user_id and date are required" });
    }
    try {
      const [result]: any = await pool.query(
        `INSERT INTO attendes (user_id, date, check_in_time, check_out_time, status)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE check_in_time = VALUES(check_in_time), check_out_time = VALUES(check_out_time), status = VALUES(status)`,
        [
          user_id,
          date,
          check_in_time || null,
          check_out_time || null,
          status || "present",
        ]
      );
      // Get the correct record (by user_id and date)
      const [rows]: any = await pool.query(
        "SELECT * FROM attendes WHERE user_id = ? AND date = ?",
        [user_id, date]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// Update an attendes record
app.put(
  "/attendes/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, date, check_in_time, check_out_time, status } = req.body;
    if (!user_id || !date) {
      return res.status(400).json({ message: "user_id and date are required" });
    }
    try {
      await pool.query(
        `UPDATE attendes SET user_id = ?, date = ?, check_in_time = ?, check_out_time = ?, status = ? WHERE id = ?`,
        [
          user_id,
          date,
          check_in_time || null,
          check_out_time || null,
          status || "present",
          id,
        ]
      );
      const [rows]: any = await pool.query(
        "SELECT * FROM attendes WHERE id = ?",
        [id]
      );
      if (rows.length === 0)
        return res.status(404).json({ message: "Attendes record not found" });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// Delete an attendes record
app.delete(
  "/attendes/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const [result]: any = await pool.query(
        "DELETE FROM attendes WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Attendes record not found" });
      res.json({ message: "Attendes record deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// ------------------- OFFICE IN/OUT API -------------------

// Get all office in/out records
app.get(
  "/office-in-out",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query("SELECT * FROM office_in_out");
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Database error");
    }
  }
);

// Add a new office in/out record
app.post(
  "/office-in-out",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { user_id, in_time, out_time, remarks, on_off } = req.body;
    if (!user_id || typeof on_off === "undefined") {
      return res
        .status(400)
        .json({ message: "user_id and on_off are required" });
    }
    try {
      // Use time string directly (frontend sends HH:mm:ss)
      let inTimeOnly = in_time || null;
      let outTimeOnly = out_time || null;
      // Insert into office_in_out
      const [result]: any = await pool.query(
        `INSERT INTO office_in_out (user_id, in_time, out_time, remarks, on_off) VALUES (?, ?, ?, ?, ?)`,
        [user_id, inTimeOnly, outTimeOnly, remarks || null, on_off]
      );
      // Also insert/update attendes table
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);
      if (on_off === 1 && inTimeOnly) {
        // Check-in: insert or update attendes for today
        const [attRows]: any = await pool.query(
          "SELECT * FROM attendes WHERE user_id = ? AND date = ?",
          [user_id, dateStr]
        );
        if (attRows.length === 0) {
          await pool.query(
            `INSERT INTO attendes (user_id, date, check_in_time, status) VALUES (?, ?, ?, ?)`,
            [user_id, dateStr, inTimeOnly, "present"]
          );
        } else {
          await pool.query(
            `UPDATE attendes SET check_in_time = ? WHERE id = ?`,
            [inTimeOnly, attRows[0].id]
          );
        }
      } else if (on_off === 0 && outTimeOnly) {
        // Check-out: update attendes for today
        const [attRows]: any = await pool.query(
          "SELECT * FROM attendes WHERE user_id = ? AND date = ?",
          [user_id, dateStr]
        );
        if (attRows.length > 0) {
          await pool.query(
            `UPDATE attendes SET check_out_time = ? WHERE id = ?`,
            [outTimeOnly, attRows[0].id]
          );
        }
      }
      const [rows]: any = await pool.query(
        "SELECT * FROM office_in_out WHERE id = ?",
        [result.insertId]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// Update an office in/out record
app.put(
  "/office-in-out/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, in_time, out_time, remarks, on_off } = req.body;
    if (!user_id || typeof on_off === "undefined") {
      return res
        .status(400)
        .json({ message: "user_id and on_off are required" });
    }
    try {
      // Use time string directly (frontend sends HH:mm:ss)
      let inTimeOnly = in_time || null;
      let outTimeOnly = out_time || null;
      await pool.query(
        `UPDATE office_in_out SET user_id = ?, in_time = ?, out_time = ?, remarks = ?, on_off = ? WHERE id = ?`,
        [user_id, inTimeOnly, outTimeOnly, remarks || null, on_off, id]
      );
      // Also update attendes table for today
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);
      if (on_off === 1 && inTimeOnly) {
        // Check-in: update attendes for today
        const [attRows]: any = await pool.query(
          "SELECT * FROM attendes WHERE user_id = ? AND date = ?",
          [user_id, dateStr]
        );
        if (attRows.length === 0) {
          await pool.query(
            `INSERT INTO attendes (user_id, date, check_in_time, status) VALUES (?, ?, ?, ?)`,
            [user_id, dateStr, inTimeOnly, "present"]
          );
        } else {
          await pool.query(
            `UPDATE attendes SET check_in_time = ? WHERE id = ?`,
            [inTimeOnly, attRows[0].id]
          );
        }
      } else if (on_off === 0 && outTimeOnly) {
        // Check-out: update attendes for today
        const [attRows]: any = await pool.query(
          "SELECT * FROM attendes WHERE user_id = ? AND date = ?",
          [user_id, dateStr]
        );
        if (attRows.length > 0) {
          await pool.query(
            `UPDATE attendes SET check_out_time = ? WHERE id = ?`,
            [outTimeOnly, attRows[0].id]
          );
        }
      }
      const [rows]: any = await pool.query(
        "SELECT * FROM office_in_out WHERE id = ?",
        [id]
      );
      if (rows.length === 0)
        return res
          .status(404)
          .json({ message: "Office In/Out record not found" });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// Delete an office in/out record
app.delete(
  "/office-in-out/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const [result]: any = await pool.query(
        "DELETE FROM office_in_out WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ message: "Office In/Out record not found" });
      res.json({ message: "Office In/Out record deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// ------------------- OTHER SETTINGS API -------------------

// Get all other settings
app.get(
  "/other-settings",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query("SELECT * FROM other_settings");
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Database error");
    }
  }
);

// Add a new other setting
app.post(
  "/other-settings",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { user_id, setting_key, setting_value } = req.body;
    if (!setting_key) {
      return res.status(400).json({ message: "setting_key is required" });
    }
    try {
      const [result]: any = await pool.query(
        `INSERT INTO other_settings (user_id, setting_key, setting_value) VALUES (?, ?, ?)`,
        [user_id || null, setting_key, setting_value || null]
      );
      const [rows]: any = await pool.query(
        "SELECT * FROM other_settings WHERE id = ?",
        [result.insertId]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// Update an other setting
app.put(
  "/other-settings/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, setting_key, setting_value } = req.body;
    if (!setting_key) {
      return res.status(400).json({ message: "setting_key is required" });
    }
    try {
      await pool.query(
        `UPDATE other_settings SET user_id = ?, setting_key = ?, setting_value = ? WHERE id = ?`,
        [user_id || null, setting_key, setting_value || null, id]
      );
      const [rows]: any = await pool.query(
        "SELECT * FROM other_settings WHERE id = ?",
        [id]
      );
      if (rows.length === 0)
        return res.status(404).json({ message: "Other setting not found" });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// Delete an other setting
app.delete(
  "/other-settings/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const [result]: any = await pool.query(
        "DELETE FROM other_settings WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Other setting not found" });
      res.json({ message: "Other setting deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// ------------------- DASHBOARD API -------------------

// Get all dashboard widgets
app.get(
  "/dashboard",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query("SELECT * FROM dashboard");
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Database error");
    }
  }
);

// Add a new dashboard widget
app.post(
  "/dashboard",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { user_id, widget_name, widget_data } = req.body;
    if (!user_id || !widget_name) {
      return res
        .status(400)
        .json({ message: "user_id and widget_name are required" });
    }
    try {
      const [result]: any = await pool.query(
        `INSERT INTO dashboard (user_id, widget_name, widget_data) VALUES (?, ?, ?)`,
        [user_id, widget_name, widget_data || null]
      );
      const [rows]: any = await pool.query(
        "SELECT * FROM dashboard WHERE id = ?",
        [result.insertId]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// Update a dashboard widget
app.put(
  "/dashboard/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, widget_name, widget_data } = req.body;
    if (!user_id || !widget_name) {
      return res
        .status(400)
        .json({ message: "user_id and widget_name are required" });
    }
    try {
      await pool.query(
        `UPDATE dashboard SET user_id = ?, widget_name = ?, widget_data = ? WHERE id = ?`,
        [user_id, widget_name, widget_data || null, id]
      );
      const [rows]: any = await pool.query(
        "SELECT * FROM dashboard WHERE id = ?",
        [id]
      );
      if (rows.length === 0)
        return res.status(404).json({ message: "Dashboard widget not found" });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

// Delete a dashboard widget
app.delete(
  "/dashboard/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const [result]: any = await pool.query(
        "DELETE FROM dashboard WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Dashboard widget not found" });
      res.json({ message: "Dashboard widget deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
