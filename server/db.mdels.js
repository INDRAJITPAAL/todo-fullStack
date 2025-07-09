const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    userName: String,
    email: { type: String, unique: true },
    password: String,
})


const todoSchema = new Schema({
    task: String,
    markAsDone: { type: Boolean, default: false },
    userId: { type: objectId, required: true },
})

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", todoSchema);


module.exports = {
    Todo,
    User
}