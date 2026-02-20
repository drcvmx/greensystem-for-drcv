import greenAlchemyLogo from '@/assets/green-alchemy-logo.png';
import { MapPin, Clock, Phone } from 'lucide-react';
import { ZoneInfo } from '@/config/zones';

interface FooterProps {
  zoneInfo?: ZoneInfo;
}

const Footer = ({ zoneInfo }: FooterProps) => {
  return (
    <footer className="bg-card border-t border-border/30 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-8">
          <img 
            src={greenAlchemyLogo} 
            alt="Green Alchemy" 
            className="h-16 w-auto opacity-80"
          />
          
          {zoneInfo ? (
            <>
              <h3 className="font-sans font-bold text-xl tracking-[0.15em] text-pure-white/90 uppercase">
                {zoneInfo.storeName}
              </h3>
              
              <div className="max-w-md space-y-4 text-sm">
                <p className="text-muted-foreground">
                  {zoneInfo.description}
                </p>
                
                <div className="flex flex-col items-center gap-3 pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground/80">
                    <MapPin className="w-4 h-4 text-primary/70" />
                    <span>{zoneInfo.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground/80">
                    <Clock className="w-4 h-4 text-primary/70" />
                    <span>{zoneInfo.hours}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground/80">
                    <Phone className="w-4 h-4 text-primary/70" />
                    <span>{zoneInfo.phone}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-sans font-bold text-lg tracking-[0.25em] text-pure-white/80 uppercase">
                Green Alchemy
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Catálogo exclusivo de productos premium. 
                Calidad y sofisticación en cada detalle.
              </p>
            </>
          )}
          
          <div className="flex items-center gap-8 text-muted-foreground/60 text-xs tracking-wider">
            <span>Catálogo 2026</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>Premium Collection</span>
          </div>
          
          <div className="pt-6 border-t border-border/20 w-full max-w-xs">
            <p className="text-muted-foreground/50 text-xs">
              © {new Date().getFullYear()} Green Alchemy. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
