
export interface AdminTypes {
  createdAt: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface CustomerTypes {
  _id: string;
  all: number;
  createdAt: string;
  name:string
phone: string;
date: string;
payed: boolean;
location: string;
buyedProducts: BuyedProductTypes[];

}

export interface BuyedProductTypes {
  productId:string
    _id: string;
    product: string;
    size: string;
    price: number;
    type: string;
    quantity: number;
    date: string;
  }
export interface ProductTypes {
  _id: string
  stock: number
  createdAt: string
  updatedAt: string
  name: string
  size: string
  price: number
  type: string
}

export interface ExpenseTypes{
  _id:string
  name:string
  amount:number
  date:string
}
