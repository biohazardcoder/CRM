import Expense from "../models/expense-model.js";

export const getAllExpense = async (_, res) => {
  try {
    const expense = await Expense.find();
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Qarzlarni olishda xato", error });
  }
}

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Qarz topilmadi" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Qarz olishda xato", error });
  }
}

export const CreateExpense = async (req,res) => {
    try {
        const {name, amount, date,phone} = req.body

        const newExpense = await Expense.create({
            name,
            phone,
            amount,
            date
        })

    res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Qarz yaratishda xato", error });
    }
}


export const deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Qarz topilmadi" });
    }
    res.status(200).json({ message: "Qarz o'chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Qarzni o'chirishda xato", error });
  }
}


export const editExpense = async (req, res) => {
  try {
    const { name, amount, date,phone } = req.body;
    const { id } = req.params;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { name, amount, date,phone },
      { new: true } 
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Qarz topilmadi" });
    }

    res.status(200).json({
      message: "Qarz muvaffaqiyatli tahrirlandi",
      expense: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Qarzni tahrirlashda xato", error });
  }
};
