interface CatalogPageIndicatorProps {
  currentPage: number;
  totalPages: number;
}

const CatalogPageIndicator = ({ currentPage, totalPages }: CatalogPageIndicatorProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 bg-pure-black/90 backdrop-blur-sm border border-primary/20 px-4 py-2 rounded-sm shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Pág</span>
        <span className="font-sans font-bold text-xl text-foreground tracking-wide">
          {currentPage}
        </span>
        <span className="text-muted-foreground/60">/</span>
        <span className="text-sm text-muted-foreground">
          {totalPages}
        </span>
      </div>
    </div>
  );
};

export default CatalogPageIndicator;
