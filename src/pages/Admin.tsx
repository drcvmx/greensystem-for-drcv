import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { demoStorage } from "@/lib/demoStorage";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LogOut, ChevronDown, ChevronRight, Search, X, DollarSign, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddItemDialog } from "@/components/admin/AddItemDialog";
import { EditItemDialog } from "@/components/admin/EditItemDialog";

// Component for price input with local state and blur/enter save
const PriceInput = ({
  categoryId,
  initialPrice,
  onSave
}: {
  categoryId: string;
  initialPrice: number | null;
  onSave: (categoryId: string, price: number | null) => void;
}) => {
  const [localValue, setLocalValue] = useState<string>(initialPrice?.toString() ?? "");
  const [hasChanges, setHasChanges] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local value when prop changes (after save)
  useEffect(() => {
    const newValue = initialPrice?.toString() ?? "";
    if (!inputRef.current || document.activeElement !== inputRef.current) {
      setLocalValue(newValue);
      setHasChanges(false);
    }
  }, [initialPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    setHasChanges(val !== (initialPrice?.toString() ?? ""));
  };

  const handleSave = () => {
    if (hasChanges) {
      onSave(categoryId, localValue ? parseFloat(localValue) : null);
      setHasChanges(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
      <DollarSign className="h-3 w-3 text-[hsl(142,70%,45%)] shrink-0" />
      <Input
        ref={inputRef}
        type="number"
        placeholder="0"
        value={localValue}
        onChange={handleChange}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-12 sm:w-16 h-6 sm:h-8 text-xs sm:text-sm bg-[hsl(142,70%,45%)]/10 border-[hsl(142,70%,45%)]/30 text-[hsl(142,70%,45%)] placeholder:text-[hsl(142,70%,45%)]/50 focus:border-[hsl(142,70%,45%)] px-1 sm:px-2"
      />
      {hasChanges && (
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)]/20"
          onClick={handleSave}
        >
          <Check className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

interface Zone {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  is_active: boolean;
  zone_id: string;
}

interface Category {
  id: string;
  name: string;
  brand_id: string;
  is_active: boolean;
  price: number | null;
}

interface Variant {
  id: string;
  name: string;
  category_id: string;
  is_active: boolean;
}

const Admin = () => {
  const { user, userRole, loading, signOut, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (userRole || !loading) {
      fetchZones();
    }
  }, [userRole, loading]);

  useEffect(() => {
    if (selectedZone) {
      fetchInventory();
    }
  }, [selectedZone]);

  const fetchZones = () => {
    const data = demoStorage.getAll("zones").filter((z: any) => z.is_active);
    setZones(data);
    if (userRole?.zone_id) {
      setSelectedZone(userRole.zone_id);
    } else if (data.length > 0) {
      setSelectedZone(data[0].id);
    }
  };

  const fetchInventory = () => {
    const brandsData = demoStorage.getAll("brands").filter((b: any) => b.zone_id === selectedZone);
    setBrands(brandsData);

    const brandIds = brandsData.map((b: any) => b.id);
    const categoriesData = demoStorage.getAll("categories").filter((c: any) => brandIds.includes(c.brand_id));
    setCategories(categoriesData);

    const categoryIds = categoriesData.map((c: any) => c.id);
    const variantsData = demoStorage.getAll("variants").filter((v: any) => categoryIds.includes(v.category_id));
    setVariants(variantsData);
  };

  useEffect(() => {
    if (searchQuery) {
      const matchingBrandIds = new Set<string>();
      const matchingCategoryIds = new Set<string>();
      const query = searchQuery.toLowerCase();

      variants.forEach(v => {
        if (v.name.toLowerCase().includes(query)) {
          const category = categories.find(c => c.id === v.category_id);
          if (category) {
            matchingCategoryIds.add(category.id);
            matchingBrandIds.add(category.brand_id);
          }
        }
      });

      categories.forEach(c => {
        if (c.name.toLowerCase().includes(query)) {
          matchingBrandIds.add(c.brand_id);
          matchingCategoryIds.add(c.id);
        }
      });

      brands.forEach(b => {
        if (b.name.toLowerCase().includes(query)) {
          matchingBrandIds.add(b.id);
        }
      });

      setExpandedBrands(matchingBrandIds);
      setExpandedCategories(matchingCategoryIds);
    }
  }, [searchQuery, brands, categories, variants]);

  const filterByStatus = <T extends { is_active: boolean }>(items: T[]): T[] => {
    if (filterStatus === "all") return items;
    return items.filter(item => filterStatus === "active" ? item.is_active : !item.is_active);
  };

  const matchesSearch = (name: string) => {
    if (!searchQuery) return false;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const brandHasMatchingChildren = (brandId: string) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const brandCategories = categories.filter(c => c.brand_id === brandId);
    const hasMatchingCategory = brandCategories.some(c => c.name.toLowerCase().includes(query));
    const categoryIds = brandCategories.map(c => c.id);
    const hasMatchingVariant = variants.some(v =>
      categoryIds.includes(v.category_id) && v.name.toLowerCase().includes(query)
    );
    return hasMatchingCategory || hasMatchingVariant;
  };

  const categoryHasMatchingChildren = (categoryId: string) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return variants.some(v => v.category_id === categoryId && v.name.toLowerCase().includes(query));
  };

  const addBrand = async (name: string) => {
    demoStorage.insert("brands", { name, zone_id: selectedZone, is_active: true });
    toast({ title: "Marca agregada", description: name });
    fetchInventory();
  };

  const addCategory = async (name: string, brandId?: string) => {
    if (!brandId) return;
    demoStorage.insert("categories", { name, brand_id: brandId, is_active: true, price: 0 });
    toast({ title: "Categoría agregada", description: name });
    fetchInventory();
  };

  const addVariant = async (name: string, categoryId?: string) => {
    if (!categoryId) return;
    demoStorage.insert("variants", { name, category_id: categoryId, is_active: true });
    toast({ title: "Sabor agregado", description: name });
    fetchInventory();
  };

  const editBrand = async (brandId: string, newName: string) => {
    demoStorage.update("brands", brandId, { name: newName });
    toast({ title: "Marca actualizada", description: newName });
    fetchInventory();
  };

  const editCategory = async (categoryId: string, newName: string) => {
    demoStorage.update("categories", categoryId, { name: newName });
    toast({ title: "Categoría actualizada", description: newName });
    fetchInventory();
  };

  const updateCategoryPrice = async (categoryId: string, price: number | null) => {
    demoStorage.update("categories", categoryId, { price });
    toast({ title: "Precio actualizado", description: price ? `$${price} MXN` : "Sin precio" });
    fetchInventory();
  };

  const editVariant = async (variantId: string, newName: string) => {
    demoStorage.update("variants", variantId, { name: newName });
    toast({ title: "Sabor actualizado", description: newName });
    fetchInventory();
  };

  const toggleBrand = async (brand: Brand) => {
    const newActive = !brand.is_active;
    demoStorage.update("brands", brand.id, { is_active: newActive });

    // Cascading toggle for demo
    const brandCategories = categories.filter(c => c.brand_id === brand.id);
    brandCategories.forEach(c => {
      demoStorage.update("categories", c.id, { is_active: newActive });
      variants.filter(v => v.category_id === c.id).forEach(v => {
        demoStorage.update("variants", v.id, { is_active: newActive });
      });
    });

    toast({ title: newActive ? "Marca activada" : "Marca desactivada" });
    fetchInventory();
  };

  const toggleCategory = async (category: Category) => {
    const newActive = !category.is_active;
    demoStorage.update("categories", category.id, { is_active: newActive });
    variants.filter(v => v.category_id === category.id).forEach(v => {
      demoStorage.update("variants", v.id, { is_active: newActive });
    });
    toast({ title: newActive ? "Categoría activada" : "Categoría desactivada" });
    fetchInventory();
  };

  const toggleVariant = async (variant: Variant) => {
    const newActive = !variant.is_active;
    demoStorage.update("variants", variant.id, { is_active: newActive });
    toast({ title: newActive ? "Variante activada" : "Variante desactivada" });
    fetchInventory();
  };

  const toggleExpandBrand = (brandId: string) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brandId)) {
      newExpanded.delete(brandId);
    } else {
      newExpanded.add(brandId);
    }
    setExpandedBrands(newExpanded);
  };

  const toggleExpandCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Cargando...</div>
      </div>
    );
  }

  const currentZone = zones.find(z => z.id === selectedZone);
  const filteredBrands = filterByStatus<Brand>(brands).filter(b => matchesSearch(b.name) || brandHasMatchingChildren(b.id));
  const activeBrands = brands.filter(b => b.is_active).length;
  const activeCategories = categories.filter(c => c.is_active).length;
  const activeVariants = variants.filter(v => v.is_active).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <h1 className="text-lg sm:text-2xl font-bold metallic-text">Panel Admin</h1>
              {isSuperAdmin && zones.length > 0 && (
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-32 sm:w-48 bg-input border-border text-sm">
                    <SelectValue placeholder="Zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {!isSuperAdmin && currentZone && (
                <span className="text-sm text-muted-foreground">{currentZone.name}</span>
              )}
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="shrink-0">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="card-premium rounded-lg p-2 sm:p-4 text-center">
            <div className="text-xl sm:text-3xl font-bold text-primary">{activeBrands}</div>
            <div className="text-[10px] sm:text-sm text-muted-foreground">Marcas</div>
          </div>
          <div className="card-premium rounded-lg p-2 sm:p-4 text-center">
            <div className="text-xl sm:text-3xl font-bold text-primary">{activeCategories}</div>
            <div className="text-[10px] sm:text-sm text-muted-foreground">Categorías</div>
          </div>
          <div className="card-premium rounded-lg p-2 sm:p-4 text-center">
            <div className="text-xl sm:text-3xl font-bold text-primary">{activeVariants}</div>
            <div className="text-[10px] sm:text-sm text-muted-foreground">Variantes</div>
          </div>
        </div>

        <div className="card-premium rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-sm"
              />
              {searchQuery && (
                <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => setSearchQuery("")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
              <SelectTrigger className="w-full sm:w-40 bg-input border-border text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="card-premium rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Inventario</h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <AddItemDialog type="brand" onAdd={addBrand} triggerClassName="text-xs" />
            </div>
          </div>

          <div className="space-y-2">
            {filteredBrands.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {searchQuery ? "No se encontraron resultados" : "No hay marcas"}
              </div>
            ) : (
              filteredBrands.map((brand) => {
                const brandCategories = filterByStatus<Category>(categories.filter(c => c.brand_id === brand.id))
                  .filter(c => !searchQuery || matchesSearch(c.name) || categoryHasMatchingChildren(c.id));
                const isExpanded = expandedBrands.has(brand.id);

                return (
                  <div key={brand.id} className="border border-border rounded-lg overflow-hidden">
                    <div
                      className={`group flex items-center justify-between p-2 sm:p-3 cursor-pointer hover:bg-muted/50 transition-colors ${!brand.is_active ? 'opacity-50' : ''
                        } ${matchesSearch(brand.name) ? 'bg-primary/10' : ''}`}
                      onClick={() => toggleExpandBrand(brand.id)}
                    >
                      <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-1">
                        {isExpanded ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />}
                        <span className="font-semibold text-sm sm:text-lg truncate">{brand.name}</span>
                        <EditItemDialog currentName={brand.name} itemType="marca" onSave={(newName) => editBrand(brand.id, newName)} />
                        <span className="text-[10px] sm:text-sm text-muted-foreground shrink-0 hidden xs:inline">
                          ({categories.filter(c => c.brand_id === brand.id && c.is_active).length})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <AddItemDialog type="category" brands={[brand]} selectedBrandId={brand.id} onAdd={(name) => addCategory(name, brand.id)} triggerClassName="opacity-60 hover:opacity-100 h-6 w-6 sm:h-8 sm:w-8" />
                        <Switch checked={brand.is_active} onCheckedChange={() => toggleBrand(brand)} onClick={(e) => e.stopPropagation()} className="scale-75 sm:scale-100" />
                      </div>
                    </div>

                    {isExpanded && brandCategories.length > 0 && (
                      <div className="border-t border-border bg-muted/20">
                        {brandCategories.map((category) => {
                          const categoryVariants = filterByStatus<Variant>(variants.filter(v => v.category_id === category.id))
                            .filter(v => !searchQuery || matchesSearch(v.name));
                          const isCatExpanded = expandedCategories.has(category.id);

                          return (
                            <div key={category.id}>
                              <div
                                className={`group flex items-center justify-between p-2 sm:p-3 pl-6 sm:pl-10 cursor-pointer hover:bg-muted/50 transition-colors ${!category.is_active ? 'opacity-50' : ''
                                  } ${matchesSearch(category.name) ? 'bg-primary/10' : ''}`}
                                onClick={() => toggleExpandCategory(category.id)}
                              >
                                <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-1">
                                  {isCatExpanded ? <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />}
                                  <span className="font-medium text-xs sm:text-base truncate">{category.name}</span>
                                  <EditItemDialog currentName={category.name} itemType="categoría" onSave={(newName) => editCategory(category.id, newName)} />
                                  <span className="text-[10px] sm:text-sm text-muted-foreground shrink-0 hidden xs:inline">
                                    ({variants.filter(v => v.category_id === category.id && v.is_active).length})
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <PriceInput categoryId={category.id} initialPrice={category.price} onSave={updateCategoryPrice} />
                                  <AddItemDialog type="variant" categories={[category]} selectedCategoryId={category.id} onAdd={(name) => addVariant(name, category.id)} triggerClassName="opacity-60 hover:opacity-100 h-5 w-5 sm:h-7 sm:w-7" />
                                  <Switch checked={category.is_active} onCheckedChange={() => toggleCategory(category)} onClick={(e) => e.stopPropagation()} disabled={!brand.is_active} className="scale-75 sm:scale-100" />
                                </div>
                              </div>

                              {isCatExpanded && categoryVariants.length > 0 && (
                                <div className="border-t border-border/50 bg-muted/30">
                                  {categoryVariants.map((variant) => (
                                    <div key={variant.id} className={`group flex items-center justify-between p-1.5 sm:p-2 pl-10 sm:pl-16 hover:bg-muted/50 transition-colors ${!variant.is_active ? 'opacity-50' : ''} ${matchesSearch(variant.name) ? 'bg-primary/10' : ''}`}>
                                      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                                        <span className="text-xs sm:text-sm truncate">{variant.name}</span>
                                        <EditItemDialog currentName={variant.name} itemType="sabor" onSave={(newName) => editVariant(variant.id, newName)} />
                                      </div>
                                      <Switch checked={variant.is_active} onCheckedChange={() => toggleVariant(variant)} disabled={!category.is_active || !brand.is_active} className="scale-[0.6] sm:scale-75 shrink-0" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
