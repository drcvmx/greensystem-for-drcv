import { Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCartContext } from '@/context/CartContext';
import { getBrandById } from '@/services/brands';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { items, addItem } = useCartContext();
  const inCart = items.some((i) => i.productId === product.id);
  const brand = getBrandById(product.brand_id);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      brandId: product.brand_id,
      brandName: brand?.name || '',
      flavorName: product.name,
    });
  };

  return (
    <div className="group relative bg-pure-white border border-pure-black/10 rounded-sm p-4 hover:border-pure-black/30 transition-colors duration-300">
      <div className="flex items-center justify-between gap-3">
        {/* Flavor name */}
        <div className="flex-1 min-w-0">
          <h3 className="font-sans font-semibold text-sm md:text-base text-pure-black tracking-wide truncate">
            {product.name}
          </h3>
          <p className="text-xs text-pure-black/60 mt-0.5 tracking-wider uppercase">
            {product.category}
          </p>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAdd}
          aria-label={inCart ? 'Ya en el carrito' : 'Agregar al carrito'}
          className={cn(
            'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300',
            inCart
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
          )}
        >
          {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
