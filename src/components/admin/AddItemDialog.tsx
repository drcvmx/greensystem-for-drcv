import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  brand_id: string;
}

type ItemType = "brand" | "category" | "variant";

interface AddItemDialogProps {
  type: ItemType;
  brands?: Brand[];
  categories?: Category[];
  selectedBrandId?: string;
  selectedCategoryId?: string;
  onAdd: (name: string, parentId?: string) => Promise<void>;
  triggerClassName?: string;
}

export const AddItemDialog = ({
  type,
  brands = [],
  categories = [],
  selectedBrandId,
  selectedCategoryId,
  onAdd,
  triggerClassName,
}: AddItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(selectedBrandId || selectedCategoryId || "");
  const [loading, setLoading] = useState(false);

  const labels = {
    brand: { title: "Agregar Marca", placeholder: "Nombre de la marca" },
    category: { title: "Agregar Categoría", placeholder: "Nombre de la categoría" },
    variant: { title: "Agregar Sabor", placeholder: "Nombre del sabor" },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await onAdd(name.trim().toUpperCase(), parentId || undefined);
      setName("");
      setParentId("");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories by selected brand for variant dialog
  const filteredCategories = selectedBrandId 
    ? categories.filter(c => c.brand_id === selectedBrandId)
    : categories;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={triggerClassName}>
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>{labels[type].title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "category" && (
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Seleccionar marca" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {type === "variant" && !selectedCategoryId && (
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Input
            placeholder={labels[type].placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-input border-border"
            autoFocus
          />
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Agregando..." : "Agregar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
