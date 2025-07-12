import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
    },
    payed: {
        type: Boolean,
        default: false,
    },
    all:{
        type: Number,
        default: 0,
    },
    buyedProducts: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        product: { type:String},
        size: { type: String },
        price: { type: Number, min: 0 },
        type: { type: String },
        quantity: { type: Number, min: 1 },
        date: { type: Date, default: Date.now },
    }],
  date: {
    type: String,
    default: new Date().toISOString().slice(0, 10), 
  }
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);