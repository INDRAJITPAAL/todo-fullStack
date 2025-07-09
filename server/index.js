const express = require("express");
const app = express();
const { Todo, User } = require("./db.mdels.js");
const { default: mongoose } = require("mongoose");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("./authCheck.js");
const todo = require("./db.service.js");

app.use(express.json());
app.use(express.urlencoded());


mongoose.connect(process.env.DB_URL).then(() => {
    console.log("db connected");
}).catch((e) => {
    console.error(e);
})

app.post("/auth/signup", async (req, res) => {
    const requestBody = z.object({
        userName: z.string().min(4).max(100),
        email: z.string().min(4).max(100).email(),
        password: z.string().min(4).max(100)
    })
    const parsedBodyData = requestBody.safeParse(req.body);
    if (parsedBodyData.error) {
        res.json({
            msg: "invalid Formate while signup",
            error: parsedBodyData.error,
        })
        return;
    }
    const { userName, email, password } = req.body;

    try {
        const isEmailValid = await todo.userFind(email)
        if (isEmailValid) {
            res.json({
                msg: "email is already in use"
            });
            return;
        }

        const hashedPassword = bcrypt.hashSync(password, 8);
        const response = await todo.userCreate(
            {
                userName: userName,
                email: email,
                password: hashedPassword,
            }
        )
        if (response) {
            res.json({
                msg: "signup success please signin",
            })
        }
    } catch (e) {
        console.error(e.message);
        res.json({
            error: e.message,
        })
    }

});


app.post("/auth/signin", async (req, res) => {
    const requestBody = z.object({
        email: z.string().min(4).max(100).email(),
        password: z.string().min(4).max(100),
        userName:z.string().min(1).max(100)
    })
    const parsedBodyData = requestBody.safeParse(req.body);
    if (parsedBodyData.error) {
        res.json({
            msg: "invalid Formate while signup",
            error: parsedBodyData.error,
        })
        return;
    }


    const { email, userName, password } = req.body;
    try {
        const response = await todo.userFind(email);
        if (!response) {
            res.json({
                msg: "email and password is not matched please signup",
            })
            return;
        }
        const isValidPassword = bcrypt.compare(response.password, password);
        if (isValidPassword) {
            const token = jwt.sign({
                email: email,
                userName: userName
            }, process.env.JWT_SECRET);

            res.json({
                msg: "signin success ",
                token: token,
            });
            return;
        }

    } catch (e) {
        console.error(e.message);
        res.json({
            error: e.message,
        })
    }

});


app.post("/addTodo", auth, async (req, res) => {

    const requestBody = z.object({
        task: z.string().min(0).max(300),
        markAsDone: z.boolean(),
    })

    const parsedBodyData = requestBody.safeParse(req.body);
    if (parsedBodyData.error) {
        res.json({
            msg: "invalid Formate",
            error: parsedBodyData.error,
        })
        return;
    }

    const { task, markAsDone } = req.body;
    const userId = req.userId;
    try {

        const response = await todo.create({
            task: task,
            markAsDone: markAsDone,
            userId: userId,
        })

        if (response) {
            res.json({
                status: "true",
                msg: "task added successfull"
            })
            return;
        }

    } catch (e) {
        console.error(e);
        res.json({
            status: "false",
            error: e.message
        })
    }


})

app.put("/update", auth, async (req, res) => {

    const requestBody = z.object({
        task: z.string().min(0).max(300),
        markAsDone: z.boolean(),
        taskId: z.string(),
    })

    const parsedBodyData = requestBody.safeParse(req.body);
    if (parsedBodyData.error) {
        res.json({
            msg: "invalid Formate",
            error: parsedBodyData.error,
        })
        return;
    }

    const { task, markAsDone, taskId } = req.body;
    try {

        const response = await todo.updateOne(taskId, {
            task: task,
            markAsDone: markAsDone
        })

        if (response) {
            res.json({
                status: "true",
                msg: "task update succesfull"
            })
            return;
        }

    } catch (e) {
        console.error(e);
        res.json({
            status: "false",
            error: e.message
        })
    }


})

app.delete("/delete", auth, async (req, res) => {

    const requestBody = z.object({
        taskId: z.string()
    })

    const parsedBodyData = requestBody.safeParse(req.body);

    if (parsedBodyData.error) {
        res.json({
            status: "false",
            error: parsedBodyData.error
        })
    }


    try {
        const { taskId } = req.body;
        const response = await todo.deletOne(taskId);
        if (response) {
            res.json({
                status: "true",
                msg: "delete succefull",
            })
        }
    } catch (e) {
        console.error(e);
        res.json({
            status: "false",
            error: e.message
        })
    }




})

app.get("/findbyId", auth, async (req, res) => {
    const requestBody = z.object({
        userId: z.string()
    })

    const parsedBodyData = requestBody.safeParse(req.query);

    if (parsedBodyData.error) {
        res.json({
            status: "false",
            error: parsedBodyData.error
        })
    }



    try {

        const { userId } = req.query;
        const response = await todo.findOne(userId);
        if (response) {
            res.json({
                status: "true",
                data: response
            })
        }


    } catch (e) {
        res.json({
            status: "false",
            error: e.message
        })
    }


})
app.get("/find", auth, async (req, res) => {
    try {

        const userId  = req.userId;
        const response = await todo.find(userId);
        if (response) {
            res.json({
                status: "true",
                data: response
            })
        }


    } catch (e) {
        res.json({
            status: "false",
            error: e.message
        })
    }


})



app.listen(8080);





