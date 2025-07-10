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

import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";

export default function Products() {
  const { data: products, error, isLoading, mutate } = useSWR("/product", fetcher);
  const [editProduct, setEditProduct] = useState<ProductTypes | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    price: 0,
    type: "",
  });
const filteredProducts = products?.filter((product: ProductTypes) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);

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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Input
            placeholder="Mahsulot nomi bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[300px] bg-primary text-primary-foreground"
          />
          <Sheet>
            <AddProduct />
          </Sheet>
        </div>
      </div>

      {products?.length <= 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium text-sky-400">Mahsulotlar topilmadi</p>
        </div>
      ) : (
        <div className="overflow-auto rounded-md border border-zinc-800">
          <Table className="hover:table-hover">
            <TableHeader className="bg-zinc-800 text-white hover:bg-zinc-700">
              <TableRow>
                <TableHead>Nomi</TableHead>
                <TableHead>O‘lcham</TableHead>
                <TableHead>Narx</TableHead>
                <TableHead>Tur</TableHead>
                <TableHead>Yaratilgan</TableHead>
                <TableHead>Tahrirlangan</TableHead>
                <TableHead>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts?.map((product: ProductTypes, index: number) => (
              <TableRow key={index} className="hover:bg-sky-200 transition-colors">
                <TableCell className="font-semibold text-xl">{product.name}</TableCell>
                <TableCell className="text-lg">{product.size}</TableCell>
                <TableCell className="text-lg">{product.price} so'm</TableCell>
                <TableCell className="text-lg">{product.type}</TableCell>
                <TableCell>{product.createdAt?.slice(0, 10) || "Noma'lum"}</TableCell>
                <TableCell>{product.updatedAt?.slice(0, 10) || "Noma'lum"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical size={20} className="text-zinc-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => openEditModal(product)}
                        className="text-blue-500 cursor-pointer"
                      >
                        <Pen size={16} className="mr-2" /> Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 cursor-pointer"
                      >
                        <Trash size={16} className="mr-2" /> O‘chirish
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Mahsulotni tahrirlash">
        <div className="flex flex-col gap-4">
          {["name", "size", "price", "type"].map((field) => (
            <div key={field} className="space-y-1">
              <Label htmlFor={field}>
                {{
                  name: "Mahsulot nomi *",
                  size: "O‘lcham *",
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
