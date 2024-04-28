const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  categoryId: { type: String, required: true },
  userId: { type: String, required: true },

});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
