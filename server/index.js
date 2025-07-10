// Optimized and cleaned up Express backend server for a Todo app with authentication
const express = require("express");
const mongoose = require("mongoose");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const { Todo, User } = require("./db.mdels.js");
const auth = require("./authCheck.js");
const todo = require("./db.service.js");

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("DB connected"))
    .catch(err => console.error("DB connection error:", err));

// Zod Schemas
const signupSchema = z.object({
    userName: z.string().min(4).max(100),
    email: z.string().min(4).max(100).email(),
    password: z.string().min(4).max(100)
});

const signinSchema = z.object({
    email: z.string().min(4).max(100).email(),
    password: z.string().min(4).max(100),
    userName: z.string().min(1).max(100)
});

const todoSchema = z.object({
    task: z.string().min(0).max(300),
    markAsDone: z.boolean()
});

const updateSchema = todoSchema.extend({
    taskId: z.string()
});

const taskIdSchema = z.object({ taskId: z.string() });
const userIdSchema = z.object({ userId: z.string() });

// Routes
app.post("/auth/signup", async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: false, msg: "Invalid signup format", error: parsed.error.format() });

    const { userName, email, password } = parsed.data;
    try {
        if (await todo.userFind(email)) {
            return res.status(409).json({ status: false, msg: "Email already in use" });
        }

        const hashedPassword = bcrypt.hashSync(password, 8);
        const createdUser = await todo.userCreate({ userName, email, password: hashedPassword });

        if (!createdUser) return res.status(500).json({ status: false, msg: "User creation failed" });

        res.status(201).json({ status: true, msg: "Signup successful, please sign in" });
    } catch (err) {
        res.status(500).json({ status: false, msg: "Server error", error: err.message });
    }
});

app.post("/auth/signin", async (req, res) => {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) return res.json({ status: false, msg: "Invalid format for signin", error: parsed.error });

    const { email, userName, password } = parsed.data;
    try {
        const user = await todo.userFind(email);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.json({ status: false, msg: "Email or password is incorrect" });
        }

        const token = jwt.sign({ email, userName }, process.env.JWT_SECRET);

    

        res.json({ status: true, msg: "Signin success", token, user: user });
    } catch (e) {
        res.json({ status: false, error: e.message });
    }
});

app.post("/addTodo", auth, async (req, res) => {
    const parsed = todoSchema.safeParse(req.body);
    if (!parsed.success) return res.json({ status: false, msg: "Invalid format", error: parsed.error });

    const { task, markAsDone } = parsed.data;
    try {
        const response = await todo.create({ task, markAsDone, userId: req.userId });
        res.json({ status: true, msg: "Task added successfully", data: response });
    } catch (e) {
        res.json({ status: false, error: e.message });
    }
});

app.put("/update", auth, async (req, res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.json({ status: false, msg: "Invalid format", error: parsed.error });

    const { task, markAsDone, taskId } = parsed.data;
    try {
        const response = await todo.updateOne(taskId, { task, markAsDone });
        res.json({ status: true, msg: "Task updated successfully", data: response });
    } catch (e) {
        res.json({ status: false, error: e.message });
    }
});

app.delete("/delete", auth, async (req, res) => {
    const parsed = taskIdSchema.safeParse(req.body);
    if (!parsed.success) return res.json({ status: false, error: parsed.error });

    try {
        const response = await todo.deletOne(parsed.data.taskId);
        res.json({ status: true, msg: "Delete successful", data: response });
    } catch (e) {
        res.json({ status: false, error: e.message });
    }
});

app.get("/findbyId", auth, async (req, res) => {
    const parsed = userIdSchema.safeParse(req.query);
    if (!parsed.success) return res.json({ status: false, error: parsed.error });

    try {
        const response = await todo.findOne(parsed.data.userId);
        res.json({ status: true, data: response });
    } catch (e) {
        res.json({ status: false, error: e.message });
    }
});

app.get("/find", auth, async (req, res) => {
    try {
        const response = await todo.find(req.userId);
        res.json({ status: true, data: response });
    } catch (e) {
        res.json({ status: false, error: e.message });
    }
});

// Start server
app.listen(8080, () => console.log("Server running on port 8080"));