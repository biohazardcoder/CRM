import { useState } from "react";
import { ProductTypes } from "../types/RootTypes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash, Pen } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { AddProduct } from "@/modules/AddProduct";
import useSWR from "swr";
import { fetcher } from "@/middlewares/Fetcher";
import Loader from "@/components/ui/loader";
import { Fetch } from "@/middlewares/Fetch";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

export default function Products() {
  const { data: products, error, isLoading, mutate } = useSWR("/product", fetcher);

  const [editProduct, setEditProduct] = useState<ProductTypes | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    price: 0,
    type: "",
  });

const handleDeleteProduct = async (id: string) => {
  const toastId = toast.loading("Mahsulot o'chirilmoqda...");

  try {
    await Fetch.delete(`product/${id}`);
    await mutate();
    toast.dismiss(toastId); 
    toast.success("Mahsulot muvaffaqiyatli o‘chirildi!");
  } catch (error) {
    toast.dismiss(toastId); 
    toast.error("Xatolik yuz berdi");
    console.error(error);
  }
};


  const openEditModal = (product: ProductTypes) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      size: product.size,
      price: product.price,
      type: product.type,
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      if (!editProduct) return;
      await Fetch.put(`/product/${editProduct._id}`, formData);
      await mutate();
      toast.success("Mahsulot muvaffaqiyatli yangilandi!");
      setEditOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Tahrirlashda xatolik yuz berdi.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Mahsulotlar</h1>
        <Sheet>
          <AddProduct />
        </Sheet>
      </div>

      {products?.length <= 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium text-sky-400">Mahsulotlar topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product: ProductTypes) => (
            <div
              key={product._id}
              className="bg-[#202020] rounded-lg p-4 relative"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold truncate text-white">
                  {product.name} ({product.size})
                </h2>
                <p className="text-muted-foreground text-sm">
                  Narxi: <span className="text-white">{product.price} so'm / {product.type}</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  Yaratilgan: <span className="text-white">{product.createdAt.slice(0, 10)}</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  Tahrirlangan: <span className="text-white">{product.updatedAt.slice(0, 10)}</span>
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="absolute bottom-[18px] right-3">
                  <EllipsisVertical size={24} className="text-zinc-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-none">
                  <DropdownMenuItem
                    onClick={() => openEditModal(product)}
                    className="flex items-center gap-2 text-blue-500 cursor-pointer"
                  >
                    <Pen size={18} /> Tahrirlash
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteProduct(product._id)}
                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                  >
                    <Trash size={18} /> O'chirish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

 <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Mahsulotni tahrirlash">
  <div className="flex flex-col gap-4">
    {["name", "size", "price", "type"].map((field) => (
      <div key={field} className="space-y-1">
        <Label htmlFor={field}>
          {{
            name: "Mahsulot nomi *",
            size: "O'lcham *",
            price: "Narx *",
            type: "Tur *",
          }[field]}
        </Label>
        <Input
          id={field}
          value={(formData as any)[field]}
          onChange={(e) =>
            setFormData({
              ...formData,
              [field]: field === "price" ? +e.target.value : e.target.value,
            })
          }
        />
      </div>
    ))}
    <div className="flex justify-end gap-2 pt-4">
      <button
        onClick={() => setEditOpen(false)}
        className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500"
      >
        Bekor qilish
      </button>
      <button
        onClick={handleUpdate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Yangilash
      </button>
    </div>
  </div>
</Modal>


    </div>
  );
}
