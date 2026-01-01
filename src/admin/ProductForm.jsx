import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ProductForm({
  form,
  setForm,
  onSubmit,
  onClear,
}) {
  /* IMAGE UPLOAD */
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({
        ...prev,
        thumbnail: reader.result,
      }));
    reader.readAsDataURL(file);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid grid-cols-5 gap-3"
    >
      <Input
        placeholder="ID"
        value={form.id}
        onChange={(e) =>
          setForm({ ...form, id: e.target.value })
        }
        required
      />

      <Input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        required
      />

      <Input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        required
      />

      <Input
        placeholder="Category"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      />

      <Select
        value={form.country}
        onValueChange={(v) =>
          setForm({ ...form, country: v })
        }
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

      <div className="col-span-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {form.thumbnail && (
          <img
            src={form.thumbnail}
            className="h-20 w-20 mt-2 rounded object-cover"
          />
        )}
      </div>

      <div className="col-span-3 flex gap-2">
        <Button type="submit">
          {form.id ? "Update Product" : "Add Product"}
        </Button>

        <Button type="button" variant="ghost" onClick={onClear}>
          Clear
        </Button>
      </div>
    </form>
  );
}
