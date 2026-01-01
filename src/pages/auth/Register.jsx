import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerUser } from "@/services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [role, setRole] = useState("user"); // ✅ NEW

 const submit = async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);

  // ❗ Country required ONLY for user
  if (role === "user" && !country) {
    alert("Please select a country");
    return;
  }

  await registerUser({
    name: form.get("name"),
    email: form.get("email"),
    password: form.get("password"),
    country: role === "admin" ? null : country, // 👈 IMPORTANT
    role,
  });

  navigate("/login");
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create account
          </CardTitle>
          <p className="text-sm text-slate-500">
            Join us and start shopping
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input name="name" placeholder="Full name" required />

            <Input
              name="email"
              placeholder="Email address"
              type="email"
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
            />

            {/* COUNTRY */}
            <Select onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">India</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
              </SelectContent>
            </Select>

            {/* ✅ ROLE SELECT */}
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full h-11">
              Create account
            </Button>

            <p className="text-sm text-center text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-black hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
