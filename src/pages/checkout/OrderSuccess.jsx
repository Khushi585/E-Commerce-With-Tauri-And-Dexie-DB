import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold text-green-600">
        🎉 Order Placed Successfully
      </h1>

      <p className="text-slate-500">
        Thank you for shopping with us
      </p>

      <Button onClick={() => navigate("/products")}>
        Continue Shopping
      </Button>
    </div>
  );
}
