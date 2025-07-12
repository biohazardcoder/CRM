import Product from "../models/product-model.js";

export const getAllProducts = async (_, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Mahsulotlar olishda xato", error });
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Mahsulot topilmadi" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Mahsulot olishda xato", error });
  }
}
export const createProduct = async (req, res) => {
  try {
    const { name, size, price, type, stock } = req.body;

    const newProduct = new Product({ name, size, price, type, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Mahsulot yaratishda xato", error });
    console.error(error);
  }
}
export const updateProduct = async (req, res) => {
  try {
    const { name, size, price, type, stock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, size, price, type, stock   },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Mahsulot topilmadi" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Mahsulotni yangilashda xato", error });
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Mahsulot topilmadi" });
    }
    res.status(200).json({ message: "Mahsulot o'chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Mahsulotni o'chirishda xato", error });
  }
}