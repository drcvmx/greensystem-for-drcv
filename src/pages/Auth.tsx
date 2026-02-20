import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LogIn, UserCircle } from "lucide-react";
import { demoStorage } from "@/lib/demoStorage";
import { initialUsers } from "@/lib/demoData";
import greenAlchemyLoginLogo from "@/assets/green-alchemy-login-logo.png";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleLogin = (user: any) => {
    setLoading(true);
    // Simulate slight delay for "login" feel
    setTimeout(() => {
      demoStorage.setCurrentUser(user);
      toast({
        title: "¡Bienvenido!",
        description: `Acceso exitoso como ${user.name}`,
      });
      navigate("/dashboard");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-premium rounded-lg p-8">
          <div className="text-center mb-8">
            <img
              src={greenAlchemyLoginLogo}
              alt="Green Alchemy Logo"
              className="h-24 md:h-28 w-auto mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold metallic-text">GREEN ALCHEMY</h1>
            <p className="text-muted-foreground mt-2">Versión Demo — Acceso Rápido</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-center text-muted-foreground mb-4">
              Selecciona un rol para explorar el sistema:
            </p>

            <div className="grid grid-cols-1 gap-2">
              {initialUsers.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  className="w-full justify-start h-12 border-border hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => handleRoleLogin(user)}
                  disabled={loading}
                >
                  <UserCircle className="mr-2 h-5 w-5 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{user.role.replace('_', ' ')}</span>
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-md">
              <p className="text-[10px] text-center text-primary/70 leading-relaxed uppercase">
                Esta es una versión de demostración. Los datos se guardan localmente en su navegador y no se requiere contraseña para acceder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
