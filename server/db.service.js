const { id } = require("zod/v4/locales");
const { User, Todo } = require("./db.mdels");
//crud
//destruct data and remove password and __v


async function userFind(email) {
    const response = await User.findOne({ email: email });
    return response;
}
async function userCreate(data) {
    const res = await User.create(data);
    return res;
}


async function find(userId) {
    const response = await Todo.find({ userId: userId });
    return response;
}

async function findOne(userId) {
    const response = await Todo.findOne({ _id: userId });
    return response;
}

async function create(data) {
    const res = await Todo.create(data);
    return res;
}

async function updateOne(taskId, data) {
    const res = await Todo.updateOne({ _id: taskId }, data);
    return res;
}

async function deletOne(id) {
    const res = await Todo.deleteOne({ _id: id });
    return res;
}
async function deletMany() {
    const res = await Todo.deleteMany({});
    return res;
}

module.exports = {
    create,
    userFind,
    userCreate,
    find,
    findOne,
    updateOne,
    deletOne,
    deletMany,
}