import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const email = form.get("email");
    const password = form.get("password");

    try {
      const user = await login(email, password); // ✅ ONLY THIS

      toast.success("Login successful 🎉");

      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.message || "Login failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
            />

            <Button className="w-full">Login</Button>

            <p className="text-sm text-center text-slate-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-medium"
              >
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
