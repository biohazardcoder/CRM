import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Error() {
  return <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800">
    <h1 className="text-2xl font-bold">Xatolik yuz berdi</h1>
    <p className="mt-2">Iltimos, qaytadan urinib ko‘ring.</p>
    <Link to="/" className="mt-4 inline-block">
      <Button>
        Bosh sahifaga qaytish
      </Button>
    </Link>
  </div>;
}

export default Error;
