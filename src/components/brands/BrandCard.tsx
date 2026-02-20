import { Brand } from '@/types';
import { cn } from '@/lib/utils';

interface BrandCardProps {
  brand: Brand;
  onClick: () => void;
  isSelected?: boolean;
}

const BrandCard = ({ brand, onClick, isSelected }: BrandCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full flex flex-col items-center justify-center p-4 focus:outline-none rounded-sm transition-all duration-300 relative",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
    >
      <img
        src={brand.logo_url}
        alt={brand.name}
        className={cn(
          "w-full h-auto max-h-24 md:max-h-32 object-contain transition-all duration-300",
          isSelected ? "opacity-100 scale-105" : "opacity-80 group-hover:opacity-100 group-hover:scale-105"
        )}
      />
    </button>
  );
};

export default BrandCard;
