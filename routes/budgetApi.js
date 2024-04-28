const express = require("express");
const router = express.Router();
const { Expense, Category } = require("../models/db");


// /addBudget - k
router.post("/addBudget", async (req, res) => {
  try {
    const { userId, _id, name, allocatedAmount, spend } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (_id) {
      // edit case 
      const existingCategory = await Category.findById(_id);
      if (!existingCategory) {
        res.status(400).json({ message: "Category not found" });
      } else {
        existingCategory.name = name;
        existingCategory.allocatedAmount = allocatedAmount;
        existingCategory.spend = spend || existingCategory.spend;

        await existingCategory.save();
      }
    }
    else {
      // new case 
      const newCategory = new Category({
        name,
        allocatedAmount,
        userId
      });
      await newCategory.save();
    }


    res.status(200).json({ message: "Category added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//getAllBudget - k
router.get("/getAllBudget", async (req, res) => {
  try {
    let userId = req.user.id
    if (!userId) {
      return res.status(400).json({ message: "User ID is required", });
    }

    const categories = await Category.find({ userId: userId });
    res.status(200).json({ message: "Categories retrieved successfully", categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// /deleteBudget -k
router.delete("/deleteBudget", async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryId = req.headers["categoryid"]
    if (!userId || !categoryId) {
      return res
        .status(400)
        .json({ message: "User ID and categoryId ID are required" });
    }
    let result = await Expense.find({ categoryId: categoryId });
    if (result) {
      return res
        .status(206)
        .json({ message: "Can't delete , Category already used by expense" });
    }
    await Category.deleteOne({ _id: categoryId });
    res
      .status(200)
      .json({ message: "categoryId deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// addExpense -k
router.post("/addExpense", async (req, res) => {
  try {
    const { userId, _id, description, amount, date, categoryId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    let savedExpense;
    if (_id) {
      // edit case 
      savedExpense = await Expense.findById(_id);
      if (!savedExpense) {
        res.status(400).json({ message: "Expense not found" });
      } else {
        savedExpense.description = description
        savedExpense.amount = amount
        savedExpense.date = date
        savedExpense.categoryId = categoryId
        savedExpense = await savedExpense.save();
      }
    }
    else {
      // new case 
      const newExpense = new Expense({
        description,
        amount,
        date,
        categoryId,
        userId
      });
      savedExpense = await newExpense.save();
    }
    res.status(200).json({ message: "Expense added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//getAllExpense -k
router.get("/getAllExpense", async (req, res) => {
  try {
    let userId = req.user.id
    if (!userId) {
      return res.status(400).json({ message: "User ID is required", });
    }

    const expenses = await Expense.find({ userId: userId });
    res.status(200).json({ message: "Expenses retrieved successfully", expenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



// deleteExpense -k
router.delete("/deleteExpense", async (req, res) => {
  try {
    const expenseId = req.headers["expenseid"]

    if (!expenseId) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await Expense.deleteOne({ _id: expenseId });


    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
