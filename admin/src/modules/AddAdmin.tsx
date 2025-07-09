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
import { Fetch } from "@/middlewares/Fetch";
import { toast } from "sonner";
import useSWR from "swr";
import { fetcher } from "@/middlewares/Fetcher";
export function AddAdmin() {
  const [formData, setFormData] = useState({
    firstName: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {mutate} = useSWR("/admin", fetcher);


  const resetForm = () => {
    setFormData({
      firstName: "",
      phoneNumber: "",
      password: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Полное имя обязательно.";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Номер телефона обязателен.";
    } else if (!/^\+998\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Неверный формат номера телефона.";
    }
 
    if (!formData.password) {
      newErrors.password = "Пароль обязателен.";
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)
    ) {
      newErrors.password =
        "Пароль должен содержать не менее 8 символов и включать хотя бы одну букву и одну цифру.";
    }

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
      await Fetch.post("admin/register", formData);
      mutate()
      toast("Администратор был создан", {
        action: {
          label: "Удалить",
          onClick: () => console.log("Отменить"),
        },
      });
      resetForm();
      setIsSheetOpen(false);
    } catch (error) {
      alert("Не удалось создать администратора. Попробуйте еще раз.");
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
        <Button variant="default" className="bg-sky-600">
          Admin yaratish
        </Button>
      </SheetTrigger>
      <SheetContent className="h-full w-full sm:max-w-md sm:h-auto bg-[#202020] text-white border-none">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">
            Yangi Admin Yaratish
          </SheetTitle>
        </SheetHeader>
        <SheetDescription>
          <span>Barcha maydonlarni to'ldiring</span>
        </SheetDescription>
        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="fullName">
              Ismi{" "}
              <span
                className={`${
                  errors.fullName ? "text-red-500" : "text-blue-500"
                }`}
              >
                *
              </span>
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={errors.firstname ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">{errors.firstName}</span>
            )}
          </div>
         
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">
              Telefon raqami{" "}
              <span
                className={`${
                  errors.phoneNumber ? "text-red-500" : "text-blue-500"
                }`}
              >
                *
              </span>
            </Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">
              Paroli{" "}
              <span
                className={`${
                  errors.password ? "text-red-500" : "text-blue-500"
                }`}
              >
                *
              </span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "border-red-500" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 text-gray-300 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>
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
