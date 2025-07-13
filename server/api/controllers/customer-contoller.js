import Customer from "../models/customer-model.js";
import Product from "../models/product-model.js";

export const getAllCustomers = async (_, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Haridorlarni olishda xato", error });
  }
}

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Haridor topilmadi" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Haridor olishda xato", error });
  }
}

export const createCustomer = async (req, res) => {
  try {
    const { name, phone, location, buyedProducts,  date } = req.body;
    

    for (const item of buyedProducts) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Mahsulot topilmadi: ${item.productId}` });
      }

      await product.save();


      item.price = product.price;
    }

    const newCustomer = new Customer({
      name,
      phone,
      location,
      buyedProducts,
      date,
    });
    
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Haridor yaratishda xato", error });
  }
};


export const updateCustomer = async (req, res) => {
  try {
    const { name, phone, location, buyedProducts, date } = req.body;
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Haridor topilmadi" });
    }

    customer.name = name;
    customer.phone = phone;
    customer.location = location;
    customer.date = date;

    const newBuyedProducts = [];

    for (const item of buyedProducts) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Mahsulot topilmadi: ${item.productId}` });
      }

      const price = product.price;

      newBuyedProducts.push({
        productId: item.productId,
        product: item.product,
        size: item.size,
        type: item.type,
        date: item.date,
        quantity: item.quantity,
        price,
      });
    }

    customer.buyedProducts = newBuyedProducts;

    await customer.save();

    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Haridorni yangilashda xato", error });
  }
};


export const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Haridor topilmadi" });
    }
    res.status(200).json({ message: "Haridor o'chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Haridorni o'chirishda xato", error });
  }
}



export const ToggleCustomerPayed = async (req, res) => {
  try {
    const { days } = req.body;
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: "Haridor topilmadi" });
    }

    if (customer.payed === true) {
      return res.status(400).json({ message: "Bu haridor allaqachon to‘langan" });
    }

    let total = 0;

    for (const item of customer.buyedProducts) {
      const product = await Product.findById(item.productId);
      if (product) {
        total += product.price * item.quantity;

        product.stock += item.quantity;
        await product.save();
      }
    }

    customer.all = total * (days || 1);

    customer.payed = true;
    await customer.save();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: "Haridorni to'langan holatini o'zgartirishda xato",
      error,
    });
  }
};
