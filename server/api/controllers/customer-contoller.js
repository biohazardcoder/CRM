import Customer from "../models/customer-model.js";

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
    const { name, phone, location, buyedProducts, payed, date } = req.body;
    const newCustomer = new Customer({ name, phone, location, buyedProducts, payed, date });

    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: "Haridor yaratishda xato", error });
  }
}

export const updateCustomer = async (req, res) => {
  try {
    const { name, phone, location, buyedProducts } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phone, location, buyedProducts },
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Haridor topilmadi" });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: "Haridorni yangilashda xato", error });
  }
}

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
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Haridor topilmadi" });
    }
    customer.payed = true;
    await customer.save();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Haridorni to'langan holatini o'zgartirishda xato", error });
  }
}