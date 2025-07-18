import { Fetch } from "../middlewares/Fetch";
import { AdminTypes } from "../types/RootTypes";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { AddAdmin } from "@/modules/AddAdmin";
import useSWR from "swr";
import { fetcher } from "@/middlewares/Fetcher";
import { toast } from "sonner";

export default function Admins() {
  const {data, error, isLoading,mutate} = useSWR("/admin", fetcher);

  const handleDeleteAdmin = async (id: string) => {
    try {
      (await Fetch.delete(`admin/${id}`)).data;
      mutate();
      toast.success("Admin muvaffaqiyatli o'chirildi!");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="h-16 w-16 border-[6px] border-dotted border-sky-600 animate-spin rounded-full"></span>
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
        <h1 className="text-2xl font-bold">Adminlar</h1>
        <Sheet>
          <AddAdmin />
        </Sheet>
      </div>

      {data?.length <= 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium text-sky-400">
            Adminlar mavjud emas. 
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.map((admin: AdminTypes) => (
            <div
              key={admin._id}
              className="bg-[#202020] rounded-lg p-4 flex flex-col gap-3 relative"
            >
              <DropdownMenu>
                <DropdownMenuTrigger className="absolute top-2 right-2">
                  <EllipsisVertical size={24} className="text-zinc-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-none">
                  <DropdownMenuItem
                    onClick={() => handleDeleteAdmin(admin._id)}
                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                  >
                    <Trash size={20} /> O'chirish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <h2 className="text-lg font-semibold truncate text-white">
                {admin.firstName} {admin.lastName}
              </h2>
              <p className="text-gray-300 text-sm">
                Raqami: {admin.phoneNumber}
              </p>
              <p className="text-gray-300 text-sm">
                Qo'shilgan: {admin.createdAt.slice(0, 10)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
