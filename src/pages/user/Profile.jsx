import Navbar from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "ALL",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        country: user.country || "ALL",
        password: "",
      });
    }
  }, [user]);

  if (!user) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    const updates = {
      name: form.name,
      country: form.country,
    };

    if (form.password) updates.password = form.password;

    try {
      await updateProfile(updates);
      toast.success("Profile updated");
      setForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  }

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">My Profile 👤</h2>

        <Card>
          <CardContent className="space-y-4 p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
              <div className="text-sm text-slate-600">
                <strong>ID:</strong> {user.id}
              </div>

              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <Input
                placeholder="Email"
                value={form.email}
                readOnly
              />

              <Select
                value={form.country}
                onValueChange={(v) => setForm({ ...form, country: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="New Password (leave blank to keep)"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <Button variant="destructive" onClick={logout}>Logout</Button>
              </div>

              <div className="text-sm text-slate-600">
                <strong>Role:</strong> {user.role}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
