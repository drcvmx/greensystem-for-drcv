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
import { Pencil } from "lucide-react";

interface EditItemDialogProps {
  currentName: string;
  itemType: "marca" | "categoría" | "sabor";
  onSave: (newName: string) => Promise<void>;
}

export const EditItemDialog = ({ currentName, itemType, onSave }: EditItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === currentName) return;
    
    setLoading(true);
    try {
      await onSave(name.trim().toUpperCase());
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setName(currentName);
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-60 hover:!opacity-100 h-6 w-6 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Editar {itemType}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder={`Nombre de la ${itemType}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-input border-border"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !name.trim() || name.trim() === currentName}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
