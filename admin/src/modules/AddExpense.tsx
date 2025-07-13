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

export function AddExpense() {
  const [formData, setFormData] = useState<{
  [key: string]: string; 
  name: string;
  amount: string;
  date: string;
}>({
  name: "",
  amount: "",
  date: "",
});

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { mutate } = useSWR("/expense", fetcher)
  const resetForm = () => {
    setFormData({ name: "", amount:"",date:"" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Qarzdor ismi majburiy.";
    if (!formData.amount.trim()) newErrors.amount = "Qarz qiymati majburiy.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      await Fetch.post("/expense", formData, {
  headers: {
    "Content-Type": "application/json",
  },
});
      await mutate()
      toast.success("Qarzdor muvaffaqiyatli qo‘shildi!");

      resetForm();
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Qarzdor qo‘shishda xatolik yuz berdi.");
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
        <Button variant="default" className="bg-sky-600">Qarzdor qo‘shish</Button>
      </SheetTrigger>
      <SheetContent className="h-full w-full sm:max-w-md sm:h-auto bg-[#202020] text-white border-none">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">Yangi Qarzdor</SheetTitle>
        </SheetHeader>
        <SheetDescription>Barcha maydonlarni to‘ldiring</SheetDescription>

      <div className="flex flex-col gap-4 py-4">
  {["name", "amount", "date"].map((field) => (
    <div className="space-y-1" key={field}>
      <Label htmlFor={field}>
        {{
          name: "Qarzdor ismi *",
          amount: "Qiymati",
          date: "Sana",
        }[field]}
      </Label>

      <Input
        id={field}
        name={field}
        type={field === "amount" ? "number" : field === "date" ? "date" : "text"}
        value={formData[field]}
        className="custom-date"
        onChange={(e) =>
          setFormData({ ...formData, [field]: e.target.value })
        }
      />

      {errors[field] && (
        <span className="text-red-500 text-sm">{errors[field]}</span>
      )}
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
