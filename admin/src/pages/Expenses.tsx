import { useState } from "react";
import { ExpenseTypes} from "../types/RootTypes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import useSWR from "swr";
import { fetcher } from "@/middlewares/Fetcher";
import Loader from "@/components/ui/loader";
import { Fetch } from "@/middlewares/Fetch";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";


import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableFooter,
} from "@/components/ui/table";
import { AddExpense } from "@/modules/AddExpense";

export default function Expenses() {
  const { data: expenses, error, isLoading, mutate } = useSWR("/expense", fetcher);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const filteredExpenses = expenses?.filter((expense: ExpenseTypes) => {
  const matchesSearch = expense.name.toLowerCase().includes(search.toLowerCase());

  const matchesDateRange =
    startDate && endDate
      ? new Date(expense.date) >= new Date(startDate) &&
        new Date(expense.date) <= new Date(endDate)
      : true;

  return matchesSearch && matchesDateRange;
});

const totalAmount = filteredExpenses?.reduce((acc:number, item:ExpenseTypes) => acc + item.amount, 0) || 0;

  const handleDeleteExpense = async (id: string) => {
    const toastId = toast.loading("Xarajat o'chirilmoqda...");
    try {
      await Fetch.delete(`expense/${id}`);
      await mutate();
      toast.dismiss(toastId);
      toast.success("Xarajat muvaffaqiyatli o‘chirildi!");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Xatolik yuz berdi");
      console.error(error);
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
      <h1 className="text-2xl font-bold">Xarajatlar</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
         <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-primary text-white custom-date"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-primary text-white custom-date"
            />
            <Input
              placeholder="Xarajat nomi bo‘yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-[250px] bg-primary text-primary-foreground"
            />
            <Sheet>
              <AddExpense />
            </Sheet>
          </div>
        </div>
      </div>

      {expenses?.length <= 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium text-sky-400">Xarajatlar topilmadi</p>
        </div>
      ) : (
        <div className="overflow-auto rounded-md border border-zinc-800">
          <Table className="hover:table-hover">
            <TableHeader className="bg-zinc-800 text-white hover:bg-zinc-700">
              <TableRow>
                <TableHead>Nomi</TableHead>
                <TableHead>Qiynat</TableHead>
                <TableHead>Yaratilgan</TableHead>
                <TableHead>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses?.map((expense: ExpenseTypes, index: number) => (
              <TableRow key={index} className="hover:bg-sky-200 transition-colors">
                <TableCell className="font-semibold text-xl">{expense.name}</TableCell>
                <TableCell className="text-lg">{expense.amount}</TableCell>
                <TableCell className="text-lg">{expense.date?.slice(0, 10)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical size={20} className="text-zinc-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleDeleteExpense(expense._id)}
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
            <TableFooter className="bg-zinc-800 text-white  font-semibold">
            <TableRow>
              <TableCell className="p-2 text-right" colSpan={1}>Umumiy xarajat:</TableCell>
              <TableCell className="p-2">{totalAmount.toLocaleString()} so'm</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}
