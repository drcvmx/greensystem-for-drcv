import { useState } from 'react';
import { Link } from 'react-router-dom';
import greenAlchemyLogo from '@/assets/green-alchemy-logo.png';
import GlobalSearch from './GlobalSearch';
import CartDrawer, { CartButton } from '@/components/cart/CartDrawer';

interface NavbarProps {
  onSelectBrand?: (brandId: string) => void;
}

const Navbar = ({ onSelectBrand }: NavbarProps) => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Search - Left */}
            <GlobalSearch onSelectBrand={onSelectBrand} />
            
            {/* Logo centered */}
            <Link to="/" className="flex items-center group">
              <img 
                src={greenAlchemyLogo} 
                alt="Green Alchemy Logo" 
                className="h-12 md:h-14 w-auto transition-all duration-500 group-hover:opacity-80"
              />
            </Link>
            
            {/* Cart - Right */}
            <CartButton onClick={() => setCartOpen(true)} />
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
