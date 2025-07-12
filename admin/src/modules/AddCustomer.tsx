import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Fetch } from "@/middlewares/Fetch";
import useSWR from "swr";
import { fetcher } from "@/middlewares/Fetcher";
import { ProductTypes } from "@/types/RootTypes";
import { cn } from "@/lib/utils";

export function AddCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    date: "",
    days: 1, 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProducts, setSelectedProducts] = useState<{ [id: string]: number }>({});
  const [step, setStep] = useState<"select-products" | "enter-details">("select-products");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products,mutate } = useSWR<ProductTypes[]>("/product", fetcher);
  const CustomerData = useSWR("/customer", fetcher);

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: "", phone: "", location: "",  date: "", days: 1 });
    setSelectedProducts({});
    setErrors({});
    setStep("select-products");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Ism majburiy.";
    if (!formData.phone.trim()) newErrors.phone = "Telefon raqami majburiy.";
    if (!formData.location.trim()) newErrors.location = "Manzil majburiy.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const buyedProducts = products
      ?.filter((product) => selectedProducts[product._id])
      .map((product) => ({
        productId: product._id,
        product: product.name,
        size: product.size,
        price: product.price,
        type: product.type,
        quantity: selectedProducts[product._id],
        date: new Date().toISOString().slice(0, 10),
      }));

    try {
      await Fetch.post("/customer/", {
        ...formData,
        buyedProducts,
      });
      await mutate();
      await CustomerData.mutate()
      toast.success("Mijoz muvaffaqiyatli qo‘shildi!");
      setIsSheetOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = products?.reduce((acc, product) => {
    const quantity = selectedProducts[product._id] || 0;
    return acc + quantity * product.price;
  }, 0) ?? 0;

  const totalCount = Object.values(selectedProducts).reduce((a, b) => a + b, 0);

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) resetForm();
      }}
    >
      <SheetTrigger asChild>
        <Button variant="default" className="bg-sky-600">Xaridor qo‘shish</Button>
      </SheetTrigger>

      <SheetContent className="h-full w-full sm:max-w-md sm:h-auto bg-[#202020] text-white border-none overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">Yangi Xaridor</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          {step === "select-products" ? "Mahsulotlardan tanlang va miqdorini kiriting" : "Mijoz ma'lumotlarini kiriting"}
        </SheetDescription>

        <div className="flex flex-col gap-4 py-4">
          {step === "select-products" && (
            <>
              <div className="mb-2">
                <Input
                  placeholder="Mahsulot nomi bo‘yicha qidiring..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#1c1c1c] text-white"
                />
              </div>
        <SheetFooter>
          {step === "select-products" ? (
            <Button onClick={() => setStep("enter-details")} disabled={totalCount === 0}>
              Davom etish
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Yaratilmoqda..." : "Yaratish"}
            </Button>
          )}
        </SheetFooter>
              {filteredProducts?.length ? (
                filteredProducts.map((product) => (
                  <div key={product._id} className="flex items-center justify-between bg-[#1c1c1c] p-2 rounded">
                    <div>
                      <p className="text-white font-medium">{product.name}({product.size})</p>
                      <p className="text-sm text-gray-400">{product.stock} {product.type} / {product.price.toLocaleString()} so'm</p>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      value={selectedProducts[product._id] || ""}
                      onChange={(e) =>
                        setSelectedProducts({
                          ...selectedProducts,
                          [product._id]: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20 bg-[#2c2c2c] text-white"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Hech qanday mahsulot topilmadi.</p>
              )}
            </>
          )}

          {step === "enter-details" && (
            <>
              {["name", "phone", "location"].map((field) => (
                <div key={field} className="space-y-1">
                  <Label htmlFor={field}>
                    {{
                      name: "Ism *",
                      phone: "Telefon raqami *",
                      location: "Manzil *",
                    }[field]}
                  </Label>
                  <Input
                    id={field}
                    value={(formData as any)[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className={errors[field] ? "border-red-500" : ""}
                  />
                  {errors[field] && (
                    <span className="text-red-500 text-sm">{errors[field]}</span>
                  )}
                </div>
              ))}
                <div >
                  <Label htmlFor="date" className="text-sm text-gray-300">
                    Sana *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={cn(errors.date ? "border-red-500" : "", "custom-date")}
                  />
                  {errors.date && (
                    <span className="text-red-500 text-sm">{errors.date}</span>
                  )}
                </div>
              <div className="mt-4 border-t pt-4 text-sm text-gray-300 space-y-2">
                <p>📦 Umumiy mahsulotlar miqdori: <span className="text-white">{totalCount}</span></p>
                <p>💰 Umumiy summa: <span className="text-white">{totalAmount.toLocaleString()} so'm</span></p>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Yaratilmoqda..." : "Yaratish"}
            </Button>
              </div>
            </>
          )}
        </div>

        
      </SheetContent>
    </Sheet>
  );
}
