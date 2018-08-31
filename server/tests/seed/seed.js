const {ObjectID} = require('mongodb');
const {sign} = require('jsonwebtoken');


const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

/* 
    const id1 = new ObjectID().toHexString();
    const id2 = new ObjectID().toHexString(); 
    const completedAt = new Date().getTime();
*/
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const access = 'auth';
const token = sign({id: userOneId.toHexString(),access},process.env.JWT_SECRET).toString();
const users = [
    {
        _id: userOneId,
        email: 'user_one@example.com',
        password: 'userOne123',
        tokens: [
            {
                access,
                token
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'user_two@example.com',
        password: 'userTwo123'
    }
];

const todos = [
    {
        _id: new ObjectID(),
        text: 'First test todo',
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt: new Date().getTime(),
        _creator: userTwoId
    },
    {
        _id: new ObjectID(),
        text: 'Third test todo',
        completed: true,
        completedAt: new Date().getTime(),
        _creator: userOneId
    }
];

const insertTodos = (done) => {
    Todo.remove({})
        .then(() => {
        return Todo.insertMany(todos);
        })
        .then(() => done())
        ;
};

const insertUsers = (done) => {
    User.remove({})
        .then(() => {
            //insert user
            var user1 = new User(users[0]).save();
            var user2 = new User(users[1]).save();
            return Promise.all([user1,user2]);
        })
        .then(() => done())
        ;
};

module.exports = {
    insertTodos,
    todos,
    users,
    insertUsers
};