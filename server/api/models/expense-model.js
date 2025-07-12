import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: new Date().toISOString().slice(0, 10)
  },
});

export default mongoose.model("Expense", expenseSchema);