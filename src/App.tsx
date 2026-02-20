import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ZoneCatalog from "./pages/ZoneCatalog";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import ScrollToTopOnNavigate from "./components/shared/ScrollToTopOnNavigate";
import { CartProvider } from "./context/CartContext";
import { CartNotificationProvider } from "./context/CartNotificationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <CartNotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTopOnNavigate />
            <Routes>
              {/* Auth routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Zone-based catalogs */}
              <Route path="/catalog/:zone" element={<ZoneCatalog />} />
              {/* Default redirect to login for DRCV-Flow */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartNotificationProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
