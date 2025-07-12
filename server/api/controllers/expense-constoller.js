import Expense from "../models/expense-model.js";

export const getAllExpense = async (_, res) => {
  try {
    const expense = await Expense.find();
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Xarajatlarni olishda xato", error });
  }
}

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Xarajat topilmadi" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Xarajat olishda xato", error });
  }
}

export const CreateExpense = async (req,res) => {
    try {
        const {name, amount, date} = req.body

        const newExpense = await Expense.create({
            name,
            amount,
            date
        })

    res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Xarajat yaratishda xato", error });
    }
}


export const deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Xarajat topilmadi" });
    }
    res.status(200).json({ message: "Xarajat o'chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Xarajatni o'chirishda xato", error });
  }
}