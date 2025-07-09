import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './api/routes/product-route.js';
import customerRoutes from './api/routes/customer-route.js';
import adminRoutes from './api/routes/admin-route.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

app.use(express.json());
app.use(cors());

app.use("/api/product", productRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/admin", adminRoutes);
app.get('/', (_, res) => {
  res.send('Hello, World!'); 
});

mongoose.connect(MONGO_URI, console.log('✅ Connected to MongoDB'))
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});