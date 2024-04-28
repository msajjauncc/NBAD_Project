const mongo = require('mongoose')

const Category = require('./category');
const Expense = require('./expense');
const User = require('./user');


module.exports = {
    Category,
    Expense,
    User
};

