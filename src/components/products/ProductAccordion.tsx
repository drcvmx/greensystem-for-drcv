import { Product } from "@/types";
import { useCartContext } from "@/context/CartContext";
import { useCartNotificationContext } from "@/context/CartNotificationContext";
import { Plus, ChevronDown } from "lucide-react";
import { useIsMobile, useIsDesktop } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ProductAccordionProps {
  products: Product[];
  brandName: string;
  loading?: boolean;
  defaultExpanded?: boolean;
  openCategory?: string | null; // Control which category to open from parent
}

// Group products by category with price
const groupByCategory = (products: Product[]) => {
  return products.reduce(
    (acc, product) => {
      const category = product.category || "Sin categoría";
      if (!acc[category]) {
        acc[category] = { products: [], price: product.price };
      }
      acc[category].products.push(product);
      // Use the first product's price for the category (they should all be the same)
      if (!acc[category].price && product.price) {
        acc[category].price = product.price;
      }
      return acc;
    },
    {} as Record<string, { products: Product[]; price: number }>,
  );
};

const ProductAccordion = ({ products, brandName, loading, defaultExpanded, openCategory }: ProductAccordionProps) => {
  const { addItem } = useCartContext();
  const { showNotification } = useCartNotificationContext();
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const groupedProducts = groupByCategory(products);
  const categories = Object.keys(groupedProducts).sort();

  // Set initial open state
  useEffect(() => {
    if (openCategory) {
      // When a specific category is selected, only open that one
      setOpenItems([openCategory]);
    } else if (isDesktop && categories.length > 0) {
      // Only on desktop (>1024px) with no selection, open the first category
      setOpenItems([categories[0]]);
    } else {
      // Mobile & Tablet: keep closed
      setOpenItems([]);
    }
  }, [openCategory, isDesktop, categories.length]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      brandId: product.brand_id,
      brandName: brandName,
      flavorName: product.name,
    });
    showNotification(product.name);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-14 bg-section-light-border/30 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <Accordion
      type="multiple"
      value={openItems}
      onValueChange={setOpenItems}
      className="w-full space-y-1.5 md:space-y-2"
    >
      {categories.map((category, catIndex) => {
        const categoryData = groupedProducts[category];
        const categoryPrice = categoryData.price;
        
        return (
          <AccordionItem
            key={category}
            value={category}
            className="border border-border rounded-md md:rounded-lg bg-card overflow-hidden opacity-0 animate-fade-in"
            style={{ animationDelay: `${catIndex * 0.1}s`, animationFillMode: "forwards" }}
          >
            <AccordionTrigger className="px-2 md:px-4 py-2 md:py-3 hover:no-underline hover:bg-muted/50 transition-colors [&[data-state=open]>div>svg]:rotate-180">
              <div className="flex items-center justify-between w-full pr-1 md:pr-2">
                <div className="flex items-center gap-1.5 md:gap-3">
                  <span className="font-medium text-foreground text-xs md:text-base leading-tight">{category}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground bg-muted px-1.5 md:px-2 py-0.5 rounded-full">
                    {categoryData.products.length}
                  </span>
                </div>
                {categoryPrice > 0 && (
                  <span className="text-xs md:text-sm font-semibold text-whatsapp bg-whatsapp/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-whatsapp/20">
                    ${categoryPrice} MXN
                  </span>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-2 md:px-4 pb-2 md:pb-4">
              <div className={isMobile ? "max-h-[200px] overflow-y-auto scrollbar-thin" : ""}>
                <div className="flex flex-col gap-1 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-2">
                  {categoryData.products.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={(e) => {
                        // Micro-animation on click
                        const btn = e.currentTarget;
                        btn.classList.add("scale-95");
                        setTimeout(() => btn.classList.remove("scale-95"), 150);
                        handleAddToCart(product);
                      }}
                      className="group flex items-center justify-between gap-1.5 md:gap-2 px-2 py-1.5 md:p-3 bg-muted/30 hover:bg-whatsapp/10 active:scale-95 rounded-md md:rounded-lg transition-all duration-150 text-left opacity-0 animate-scale-in border border-transparent hover:border-whatsapp/30"
                      style={{ animationDelay: `${index * 0.02}s`, animationFillMode: "forwards" }}
                    >
                      <span className="text-[11px] md:text-sm text-foreground font-medium leading-tight flex-1">
                        {product.name}
                      </span>
                      <Plus className="w-3 h-3 md:w-4 md:h-4 text-whatsapp group-hover:text-whatsapp-light group-active:scale-125 transition-all duration-150 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ProductAccordion;
