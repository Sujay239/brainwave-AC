"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173', // Vite dev server
        'http://localhost:3000', // Backend (for direct API calls)
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});
// Login API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const [rows] = await pool.query("SELECT id, name, email, password, role FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const user = rows[0];
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Remove password from user object before sending
        const { password: _, ...userWithoutPassword } = user;
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1d' });
        return res.json({ user: userWithoutPassword, token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// -----------------------User API--------------------------------
app.get("/users", auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, name, email, role, join_date, check_in_time, check_out_time FROM users");
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});
// Add User API
app.post("/users", auth_1.authenticateToken, async (req, res) => {
    const { name, email, password, role, joinDate, checkInTime, checkOutTime } = req.body;
    if (!name || !email || !password || !role || !joinDate || !checkInTime || !checkOutTime) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const [result] = await pool.query(`INSERT INTO users (name, email, password, role, join_date, check_in_time, check_out_time) VALUES (?, ?, ?, ?, ?, ?, ?)`, [name, email, hashedPassword, role, joinDate, checkInTime, checkOutTime]);
        const [rows] = await pool.query("SELECT id, name, email, role, join_date, check_in_time, check_out_time FROM users WHERE id = ?", [result.insertId]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Email already exists" });
        }
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Update User API
app.put("/users/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, email, role, joinDate, checkInTime, checkOutTime } = req.body;
    if (!name || !email || !role || !joinDate || !checkInTime || !checkOutTime) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        await pool.query(`UPDATE users SET name = ?, email = ?, role = ?, join_date = ?, check_in_time = ?, check_out_time = ? WHERE id = ?`, [name, email, role, joinDate, checkInTime, checkOutTime, id]);
        const [rows] = await pool.query("SELECT id, name, email, role, join_date, check_in_time, check_out_time FROM users WHERE id = ?", [id]);
        if (rows.length === 0)
            return res.status(404).json({ message: "User not found" });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// ------------------- TASKS API -------------------
// Get all tasks
app.get("/tasks", auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM tasks");
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});
// Add a new task
app.post("/tasks", auth_1.authenticateToken, async (req, res) => {
    const { user_id, title, description, status, due_date } = req.body;
    if (!user_id || !title) {
        return res.status(400).json({ message: "user_id and title are required" });
    }
    try {
        const [result] = await pool.query(`INSERT INTO tasks (user_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)`, [user_id, title, description || null, status || 'pending', due_date || null]);
        const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Update a task
app.put("/tasks/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { user_id, title, description, status, due_date } = req.body;
    if (!user_id || !title) {
        return res.status(400).json({ message: "user_id and title are required" });
    }
    try {
        await pool.query(`UPDATE tasks SET user_id = ?, title = ?, description = ?, status = ?, due_date = ? WHERE id = ?`, [user_id, title, description || null, status || 'pending', due_date || null, id]);
        const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
        if (rows.length === 0)
            return res.status(404).json({ message: "Task not found" });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Delete a task
app.delete("/tasks/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// ------------------- CHAT API -------------------
// Get all chat messages, or filter by sender_id or receiver_id
app.get("/chat", auth_1.authenticateToken, async (req, res) => {
    const { sender_id, receiver_id } = req.query;
    let query = "SELECT * FROM chat";
    const params = [];
    if (sender_id && receiver_id) {
        query += " WHERE sender_id = ? AND receiver_id = ?";
        params.push(sender_id, receiver_id);
    }
    else if (sender_id) {
        query += " WHERE sender_id = ?";
        params.push(sender_id);
    }
    else if (receiver_id) {
        query += " WHERE receiver_id = ?";
        params.push(receiver_id);
    }
    try {
        const [rows] = await pool.query(query, params);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});
// Send a chat message
app.post("/chat", auth_1.authenticateToken, async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    if (!sender_id || !receiver_id || !message) {
        return res.status(400).json({ message: "sender_id, receiver_id, and message are required" });
    }
    try {
        const [result] = await pool.query(`INSERT INTO chat (sender_id, receiver_id, message) VALUES (?, ?, ?)`, [sender_id, receiver_id, message]);
        const [rows] = await pool.query("SELECT * FROM chat WHERE id = ?", [result.insertId]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Delete a chat message
app.delete("/chat/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM chat WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Message not found" });
        res.json({ message: "Message deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// ------------------- ATTENDES API -------------------
// Get all attendes
app.get("/attendes", auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM attendes");
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});
// Add a new attendes record
app.post("/attendes", auth_1.authenticateToken, async (req, res) => {
    const { user_id, date, check_in_time, check_out_time, status } = req.body;
    if (!user_id || !date) {
        return res.status(400).json({ message: "user_id and date are required" });
    }
    try {
        const [result] = await pool.query(`INSERT INTO attendes (user_id, date, check_in_time, check_out_time, status)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE check_in_time = VALUES(check_in_time), check_out_time = VALUES(check_out_time), status = VALUES(status)`, [user_id, date, check_in_time || null, check_out_time || null, status || 'present']);
        // Get the correct record (by user_id and date)
        const [rows] = await pool.query("SELECT * FROM attendes WHERE user_id = ? AND date = ?", [user_id, date]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Update an attendes record
app.put("/attendes/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { user_id, date, check_in_time, check_out_time, status } = req.body;
    if (!user_id || !date) {
        return res.status(400).json({ message: "user_id and date are required" });
    }
    try {
        await pool.query(`UPDATE attendes SET user_id = ?, date = ?, check_in_time = ?, check_out_time = ?, status = ? WHERE id = ?`, [user_id, date, check_in_time || null, check_out_time || null, status || 'present', id]);
        const [rows] = await pool.query("SELECT * FROM attendes WHERE id = ?", [id]);
        if (rows.length === 0)
            return res.status(404).json({ message: "Attendes record not found" });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Delete an attendes record
app.delete("/attendes/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM attendes WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Attendes record not found" });
        res.json({ message: "Attendes record deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// ------------------- OFFICE IN/OUT API -------------------
// Get all office in/out records
app.get("/office-in-out", auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM office_in_out");
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});
// Add a new office in/out record
app.post("/office-in-out", auth_1.authenticateToken, async (req, res) => {
    const { user_id, in_time, out_time, remarks, on_off } = req.body;
    if (!user_id || typeof on_off === 'undefined') {
        return res.status(400).json({ message: "user_id and on_off are required" });
    }
    try {
        // Use time string directly (frontend sends HH:mm:ss)
        let inTimeOnly = in_time || null;
        let outTimeOnly = out_time || null;
        // Insert into office_in_out
        const [result] = await pool.query(`INSERT INTO office_in_out (user_id, in_time, out_time, remarks, on_off) VALUES (?, ?, ?, ?, ?)`, [user_id, inTimeOnly, outTimeOnly, remarks || null, on_off]);
        // Also insert/update attendes table
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10);
        if (on_off === 1 && inTimeOnly) {
            // Check-in: insert or update attendes for today
            const [attRows] = await pool.query("SELECT * FROM attendes WHERE user_id = ? AND date = ?", [user_id, dateStr]);
            if (attRows.length === 0) {
                await pool.query(`INSERT INTO attendes (user_id, date, check_in_time, status) VALUES (?, ?, ?, ?)`, [user_id, dateStr, inTimeOnly, 'present']);
            }
            else {
                await pool.query(`UPDATE attendes SET check_in_time = ? WHERE id = ?`, [inTimeOnly, attRows[0].id]);
            }
        }
        else if (on_off === 0 && outTimeOnly) {
            // Check-out: update attendes for today
            const [attRows] = await pool.query("SELECT * FROM attendes WHERE user_id = ? AND date = ?", [user_id, dateStr]);
            if (attRows.length > 0) {
                await pool.query(`UPDATE attendes SET check_out_time = ? WHERE id = ?`, [outTimeOnly, attRows[0].id]);
            }
        }
        const [rows] = await pool.query("SELECT * FROM office_in_out WHERE id = ?", [result.insertId]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Update an office in/out record
app.put("/office-in-out/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { user_id, in_time, out_time, remarks, on_off } = req.body;
    if (!user_id || typeof on_off === 'undefined') {
        return res.status(400).json({ message: "user_id and on_off are required" });
    }
    try {
        // Use time string directly (frontend sends HH:mm:ss)
        let inTimeOnly = in_time || null;
        let outTimeOnly = out_time || null;
        await pool.query(`UPDATE office_in_out SET user_id = ?, in_time = ?, out_time = ?, remarks = ?, on_off = ? WHERE id = ?`, [user_id, inTimeOnly, outTimeOnly, remarks || null, on_off, id]);
        // Also update attendes table for today
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10);
        if (on_off === 1 && inTimeOnly) {
            // Check-in: update attendes for today
            const [attRows] = await pool.query("SELECT * FROM attendes WHERE user_id = ? AND date = ?", [user_id, dateStr]);
            if (attRows.length === 0) {
                await pool.query(`INSERT INTO attendes (user_id, date, check_in_time, status) VALUES (?, ?, ?, ?)`, [user_id, dateStr, inTimeOnly, 'present']);
            }
            else {
                await pool.query(`UPDATE attendes SET check_in_time = ? WHERE id = ?`, [inTimeOnly, attRows[0].id]);
            }
        }
        else if (on_off === 0 && outTimeOnly) {
            // Check-out: update attendes for today
            const [attRows] = await pool.query("SELECT * FROM attendes WHERE user_id = ? AND date = ?", [user_id, dateStr]);
            if (attRows.length > 0) {
                await pool.query(`UPDATE attendes SET check_out_time = ? WHERE id = ?`, [outTimeOnly, attRows[0].id]);
            }
        }
        const [rows] = await pool.query("SELECT * FROM office_in_out WHERE id = ?", [id]);
        if (rows.length === 0)
            return res.status(404).json({ message: "Office In/Out record not found" });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Delete an office in/out record
app.delete("/office-in-out/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM office_in_out WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Office In/Out record not found" });
        res.json({ message: "Office In/Out record deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// ------------------- OTHER SETTINGS API -------------------
// Get all other settings
app.get("/other-settings", auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM other_settings");
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});
// Add a new other setting
app.post("/other-settings", auth_1.authenticateToken, async (req, res) => {
    const { user_id, setting_key, setting_value } = req.body;
    if (!setting_key) {
        return res.status(400).json({ message: "setting_key is required" });
    }
    try {
        const [result] = await pool.query(`INSERT INTO other_settings (user_id, setting_key, setting_value) VALUES (?, ?, ?)`, [user_id || null, setting_key, setting_value || null]);
        const [rows] = await pool.query("SELECT * FROM other_settings WHERE id = ?", [result.insertId]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Update an other setting
app.put("/other-settings/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { user_id, setting_key, setting_value } = req.body;
    if (!setting_key) {
        return res.status(400).json({ message: "setting_key is required" });
    }
    try {
        await pool.query(`UPDATE other_settings SET user_id = ?, setting_key = ?, setting_value = ? WHERE id = ?`, [user_id || null, setting_key, setting_value || null, id]);
        const [rows] = await pool.query("SELECT * FROM other_settings WHERE id = ?", [id]);
        if (rows.length === 0)
            return res.status(404).json({ message: "Other setting not found" });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Delete an other setting
app.delete("/other-settings/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM other_settings WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Other setting not found" });
        res.json({ message: "Other setting deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// ------------------- DASHBOARD API -------------------
// Get all dashboard widgets
app.get("/dashboard", auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM dashboard");
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});
// Add a new dashboard widget
app.post("/dashboard", auth_1.authenticateToken, async (req, res) => {
    const { user_id, widget_name, widget_data } = req.body;
    if (!user_id || !widget_name) {
        return res.status(400).json({ message: "user_id and widget_name are required" });
    }
    try {
        const [result] = await pool.query(`INSERT INTO dashboard (user_id, widget_name, widget_data) VALUES (?, ?, ?)`, [user_id, widget_name, widget_data || null]);
        const [rows] = await pool.query("SELECT * FROM dashboard WHERE id = ?", [result.insertId]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Update a dashboard widget
app.put("/dashboard/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { user_id, widget_name, widget_data } = req.body;
    if (!user_id || !widget_name) {
        return res.status(400).json({ message: "user_id and widget_name are required" });
    }
    try {
        await pool.query(`UPDATE dashboard SET user_id = ?, widget_name = ?, widget_data = ? WHERE id = ?`, [user_id, widget_name, widget_data || null, id]);
        const [rows] = await pool.query("SELECT * FROM dashboard WHERE id = ?", [id]);
        if (rows.length === 0)
            return res.status(404).json({ message: "Dashboard widget not found" });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
// Delete a dashboard widget
app.delete("/dashboard/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM dashboard WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Dashboard widget not found" });
        res.json({ message: "Dashboard widget deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
