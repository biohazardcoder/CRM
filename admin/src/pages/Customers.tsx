import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "@/components/ui/loader";
import { Sheet } from "@/components/ui/sheet";
import { fetcher } from "@/middlewares/Fetcher";
import { AddCustomer } from "@/modules/AddCustomer";
import { generateCustomerDoc } from "@/lib/generateWordDocument";
import { BuyedProductTypes, CustomerTypes } from "@/types/RootTypes";
import { Check, EllipsisVertical, List, Paperclip, Pen, Trash } from "lucide-react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Fetch } from "@/middlewares/Fetch";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";

export const Customers = () => {
  const { data: customers, isLoading, error, mutate } = useSWR("/customer", fetcher);
  const [payed, setPayed] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerTypes | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmPayedId, setConfirmPayedId] = useState<string | null>(null);
const [editMode, setEditMode] = useState(false);
const [editModeProduct, setEditModeProduct] = useState(false);
const [search, setSearch] = useState("");
const [openAllProductsModal, setOpenAllProductsModal] = useState(false);
const [days, setDays] = useState("1");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

const [editData, setEditData] = useState({
  name: "",
  phone: "",
  location: "",
  date:""
});
const handleEditCustomer = (customer: CustomerTypes) => {
  setEditData({
    name: customer.name,
    phone: customer.phone,
    location: customer.location,
    date:customer.date
  });
  setSelectedCustomer(customer);
  setEditMode(true);
};

const saveEditedCustomer = async () => {
  if (!selectedCustomer?._id) return;

  const promise = Fetch.put(`/customer/edit/${selectedCustomer._id}`, editData);

  toast.promise(promise, {
    loading: "Xaridor yangilanmoqda...",
    success: "Xaridor muvaffaqiyatli yangilandi",
    error: "Xaridorni yangilashda xatolik yuz berdi",
  });

  try {
    await promise;
    mutate();
    setEditMode(false);
  } catch (error) {
    console.error(error);
  }
};


const handleTogglePayed = async (id: string) => {
  const promise = Fetch.patch(`/customer/payed/${id}`, { days });

  toast.promise(promise, {
    loading: "To'langan deb belgilanyapti...",
    success: "Xaridor to'lagan deb belgilandi",
    error: "Belgilashda xatolik yuz berdi",
  });

  try {
    await promise;
    setDays("");
    mutate();
  } catch (err) {
    console.error("Toggle payed error:", err);
  } finally {
    setConfirmPayedId(null);
  }
};


const handleDeleteCustomer = async (id: string) => {
   const confirmed = confirm("Rostdan ham ushbu xaridorni o'chirmoqchimisiz?");
  if (!confirmed) return;
  const promise = Fetch.delete(`/customer/${id}`);
  mutate();

  toast.promise(promise, {
    loading: "Xaridor o'chirilmoqda...",
    success: "Xaridor muvaffaqiyatli o'chirildi",
    error: "Xaridorni o'chirishda xatolik",
  });

  try {
    await promise;
    mutate()
  } catch (err) {
    console.error("Delete customer error:", err);
  }
};


const filteredCustomers = customers
  ?.filter((c: CustomerTypes) => {
    const matchesPayed = c.payed === payed;

    const matchesDateRange =
      startDate && endDate
        ? new Date(c.date) >= new Date(startDate) && new Date(c.date) <= new Date(endDate)
        : true;

    const matchesSearch = search
      ? c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
      : true;

    return matchesPayed && matchesDateRange && matchesSearch;
  })
  ?.sort((a:CustomerTypes, b:CustomerTypes) => {
    if (!payed) {
      const daysA = (new Date().getTime() - new Date(a.date).getTime()) / (1000 * 60 * 60 * 24);
      const daysB = (new Date().getTime() - new Date(b.date).getTime()) / (1000 * 60 * 60 * 24);

      const isAOverdue = !a.payed && daysA > 10;
      const isBOverdue = !b.payed && daysB > 10;

      if (isAOverdue && !isBOverdue) return -1;
      if (!isAOverdue && isBOverdue) return 1;
    }

    return 0;
  });

const totalAmount = filteredCustomers?.reduce((acc: number, customer: CustomerTypes) => {
  const customerTotal = typeof customer.all === "number" && customer.all > 0
    ? customer.all
    : customer.buyedProducts?.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      ) || 0;

  return acc + customerTotal;
}, 0) || 0;
const groupedProductsMap = new Map();


const allProducts = filteredCustomers?.flatMap((customer: CustomerTypes) =>
  customer.buyedProducts?.map((product: BuyedProductTypes) => ({
    ...product,
    date: customer.date,
    customerName: customer.name,
  }))
) || [];

allProducts.forEach((product: BuyedProductTypes) => {
  const key = `${product.product}_${product.type}_${product.size}_${product.price}`;
  if (!groupedProductsMap.has(key)) {
    groupedProductsMap.set(key, {
      ...product,
      quantity: 0,
      totalPrice: 0,
    });
  }
  const existing = groupedProductsMap.get(key);
  existing.quantity += product.quantity;
  existing.totalPrice += product.price * product.quantity;
});

const groupedProducts = Array.from(groupedProductsMap.values());

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
        <p className="text-lg font-medium text-red-600">{error.response.data.message || "Malumot olishda xatolik"}</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Xaridorlar</h1>
        <Sheet>
          <AddCustomer />
        </Sheet>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Button variant={payed ? "default" : "secondary"} onClick={() => setPayed(true)}>
          To'lagan
        </Button>
        <Button variant={!payed ? "default" : "secondary"} onClick={() => setPayed(false)}>
          To'lamagan
        </Button>
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-[200px] bg-primary text-white custom-date"
      />
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-[200px] bg-primary text-white custom-date"
      />

          <Input
        type="text"
        placeholder="Ism yoki telefon orqali qidirish"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[250px] bg-primary text-white"
      />
      </div>

      {filteredCustomers?.length <= 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium text-sky-400">
            Mos keluvchi xaridorlar topilmadi
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border border-gray-700 text-white">
            <thead className="bg-[#111]">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Ism</th>
                <th className="p-2 border">{payed ? "Umumiy to'lov" : "Kunlik to'lov"}</th>
                <th className="p-2 border">Telefon</th>
                <th className="p-2 border">Manzil</th>
                <th className="p-2 border">Sana</th>
                <th className="p-2 border">Holat</th>
                <th className="p-2 border">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c: CustomerTypes, idx: number) => (
                <tr key={c._id} className="border border-gray-600 bg-primary-foreground text-primary">
                  <td className="p-2">{idx + 1}</td>
              <td className="p-2">
                  {c.name}{" "}
                </td>
                  <td className="p-2">{payed ? (
                    `${c.all.toLocaleString()} so'm`
                  ) : (
                    `${c?.buyedProducts
                      ?.reduce((acc, p) => acc + p.price * p.quantity, 0)
                      .toLocaleString()} so'm`
                  )}</td>
                  <td
                    className={`p-2 ${
                      !c.payed &&
                      ( (new Date().getTime() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24) > 10 )
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {c.phone}
                  </td>
                  <td className="p-2">{c.location}</td>
                  <td className="p-2">{c.date}</td>
                  <td className="p-2">
                    {c.payed ? (
                      <span className="text-green-500">To'lagan</span>
                    ) : (
                      <span className="text-red-500">To'lamagan</span>
                    )}
                  </td>
                  <td className="p-2 flex items-center gap-2">
                    {!c.payed && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => {
                        setConfirmPayedId(c._id),
                        setSelectedCustomer(c)
                      }}
                      >
                        <Check size={16} />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setOpenDialog(true);
                      }}
                    >
                      <List size={16} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="text-zinc-400" size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => generateCustomerDoc(c)}
                        className="flex gap-2 text-black"
                      >
                        <Paperclip size={16} /> Yuklab olish
                      </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditCustomer(c)}
                          className="flex gap-2 text-blue-500"
                        >
                          <Pen size={16} /> Tahrirlash
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCustomer(c._id)}
                          className="flex gap-2 text-red-600"
                        >
                          <Trash size={16} /> O'chirish
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#111] text-white">
                <td colSpan={5} className="text-right p-4">Umumiy summa:</td>
                <td className="font-semibold">{totalAmount.toLocaleString()} so'm</td>
                <td colSpan={2}>
                  <Button size="sm" variant="secondary" onClick={() => setOpenAllProductsModal(true)}>
                    Tafsilotlar
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
       <Modal open={editMode} onClose={() => setEditMode(false)} title="Xaridorni tahrirlash">
           <div className="space-y-3">
            <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder="Ism" />
            <Input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} placeholder="Telefon" />
            <Input value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} placeholder="Manzil" />
            <Input value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} placeholder="Kun" type="date" className="custom-date" />
            <Button className="w-full" onClick={saveEditedCustomer}>Saqlash</Button>
          </div>
      </Modal>
 


<Modal open={openDialog} onClose={() => setOpenDialog(false)} title="Mahsulotlar ro'yxati">
  <div className="space-y-3 max-h-[400px] overflow-y-auto">
    <div className="flex justify-between text-primary items-center">
      <Button size="sm" variant="secondary" onClick={() => setEditModeProduct(prev => !prev)}>
        {editModeProduct ? "Yopish" : "Tahrirlash"}
      </Button>
        {editModeProduct && <div className="ml-2">
      <Button
  className="w-full"
  onClick={async () => {
    const promise = Fetch.put(`/customer/${selectedCustomer?._id}`, {
      ...selectedCustomer,
      name: selectedCustomer?.name || "",
      phone: selectedCustomer?.phone || "",
      location: selectedCustomer?.location || "",
      date: selectedCustomer?.date || "",
      buyedProducts: selectedCustomer?.buyedProducts,
    });

    toast.promise(promise, {
      loading: "Saqlanmoqda...",
      success: "Mahsulotlar muvaffaqiyatli yangilandi",
      error: "Xatolik yuz berdi",
    });

    try {
      await promise;
      mutate();
      setEditModeProduct(false);
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
    }
  }}
>
  Saqlash
</Button>

    </div>}
    </div>

    {selectedCustomer?.buyedProducts?.map((product, idx) => (
      <div key={idx} className="border-b pb-2 space-y-2">
        <div className="flex justify-between items-center gap-2">
          <div className="w-full">
            <div className="flex items-center justify-between"> 
              <div>
                <p className="font-semibold">
                  {product.product} ({product.size})
                </p>
                <p className="text-sm ">
                  {product.quantity} {product.type} x {product.price.toLocaleString()} so'm
                </p>
              </div>
              {editModeProduct && (
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    value={product.quantity}
                    min={1}
                    className="w-24"
                    onChange={(e) => {
                      const updated = selectedCustomer.buyedProducts.map((p, i) =>
                        i === idx ? { ...p, quantity: Number(e.target.value) } : p
                      );
                      setSelectedCustomer(prev => ({
                        ...(prev as CustomerTypes),
                        buyedProducts: updated,
                      }));
                    }}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      const filtered = selectedCustomer.buyedProducts.filter((_, i) => i !== idx);
                      setSelectedCustomer(prev => ({
                        ...(prev as CustomerTypes),
                        buyedProducts: filtered,
                      }));
                    }}
                  >
                    O'chirish
                  </Button>
                </div>
              )}
            </div>
            <p className="text-sm font-bold mt-1 text-end">
              Jami: {(product.quantity * product.price).toLocaleString()} so'm
            </p>
          </div>
        </div>
      </div>
    ))}

    <div className="pt-4 text-right font-bold">
      Umumiy: {selectedCustomer?.buyedProducts
        ?.reduce((acc, p) => acc + p.price * p.quantity, 0)
        .toLocaleString()} so'm
    </div>

    
  </div>
</Modal>
    <Modal open={!!confirmPayedId} onClose={() => setConfirmPayedId(null)} title="Tasdiqlash" >
       <p>Necha kun ishlatganini belgilang</p>
      <Input
        value={days}
        onChange={(e) => setDays(e.target.value)}
        type="text"
        className="my-2"
      />
      <h1>
        {days} kunda = {" "}
        {days ? (
          selectedCustomer?.buyedProducts
            ? (
                selectedCustomer.buyedProducts.reduce(
                  (acc, p) => acc + (p.price ?? 0) * (p.quantity ?? 0),
                  0
                ) * Number(days)
              ).toLocaleString()
            : '0'
        ) : '0'} so'm 
      </h1>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="destructive" onClick={() => setConfirmPayedId(null)}>Yo‘q</Button>
          <Button onClick={() => confirmPayedId && handleTogglePayed(confirmPayedId)}>Ha, belgilash</Button>
        </div>
    </Modal>

    <Modal open={openAllProductsModal} onClose={() => setOpenAllProductsModal(false)} title="Umumiy mahsulotlar" big={true}>
  <div className="max-h-[400px] overflow-y-auto max-w-3xl">
    {groupedProducts.length === 0 ? (
      <p className="text-muted">Mahsulotlar mavjud emas</p>
    ) : (
      <table className="w-full text-sm border border-gray-700 text-white">
        <thead className="bg-[#111]">
          <tr>
            <th className="p-4 border">Mahsulot</th>
            <th className="p-4 border">Narxi</th>
            <th className="p-4 border">Soni</th>
            <th className="p-4 border">Jami</th>
          </tr>
        </thead>
        <tbody className="bg-white text-black font-semibold">
          {groupedProducts.map((p, i) => (
            <tr key={i} className="border border-gray-600">
              <td className="p-4">{p.product}({p.size})</td>
              <td className="p-4">{p.price.toLocaleString()} so'm</td>
              <td className="p-4">{p.quantity}</td>
              <td className="p-4">{p.totalPrice.toLocaleString()} so'm</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</Modal>
    </div>
  );
};
