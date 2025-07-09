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

export function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    price: "",
    type: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { mutate } = useSWR("/product", fetcher)
  const resetForm = () => {
    setFormData({ name: "", size: "", price: "", type: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Mahsulot nomi majburiy.";
    if (!formData.size.trim()) newErrors.size = "O'lcham majburiy.";
    if (!formData.price.trim()) newErrors.price = "Narx majburiy va musbat bo'lishi kerak.";
    if (!formData.type.trim()) newErrors.type = "Tur majburiy.";
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      await Fetch.post("/product", formData, {
  headers: {
    "Content-Type": "application/json",
  },
});
      await mutate()
      toast.success("Mahsulot muvaffaqiyatli qo‘shildi!");

      resetForm();
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Mahsulot qo‘shishda xatolik yuz berdi.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) resetForm();
      }}
    >
      <SheetTrigger asChild>
        <Button variant="default" className="bg-sky-600">Mahsulot qo‘shish</Button>
      </SheetTrigger>
      <SheetContent className="h-full w-full sm:max-w-md sm:h-auto bg-[#202020] text-white border-none">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">Yangi Mahsulot</SheetTitle>
        </SheetHeader>
        <SheetDescription>Barcha maydonlarni to‘ldiring</SheetDescription>

        <div className="flex flex-col gap-4 py-4">
          {["name", "size", "price", "type"].map((field) => (
            <div className="space-y-1" key={field}>
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
                onChange={handleInputChange}
                className={errors[field] ? "border-red-500" : ""}
              />
              {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
            </div>
          ))}
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Yaratilmoqda..." : "Yaratish"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
