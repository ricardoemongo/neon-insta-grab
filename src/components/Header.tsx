import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isLoggedIn?: boolean;
  userEmail?: string;
  userBalance?: number;
  onLogout?: () => void;
}

export const Header = ({ isLoggedIn = false, userEmail, userBalance = 0, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-background border-b border-primary/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="text-2xl font-bold text-primary cursor-pointer hover:text-primary-glow transition-colors"
            onClick={() => handleNavigation('/')}
          >
            AUTOLEADX
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavigation('/')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Início
            </button>
            <button 
              onClick={() => handleNavigation('/api-docs')}
              className="text-foreground hover:text-primary transition-colors"
            >
              API
            </button>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Saldo: </span>
                  <span className="text-primary font-bold">R$ {userBalance.toFixed(2)}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNavigation('/dashboard')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavigation('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="neon"
                  onClick={() => handleNavigation('/register')}
                >
                  Criar Conta
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-primary/20 pt-4">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Início
              </button>
              <button 
                onClick={() => handleNavigation('/api-docs')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                API
              </button>
              
              {isLoggedIn ? (
                <>
                  <div className="text-sm py-2">
                    <span className="text-muted-foreground">Saldo: </span>
                    <span className="text-primary font-bold">R$ {userBalance.toFixed(2)}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleNavigation('/dashboard')}
                    className="justify-start"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onLogout}
                    className="justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleNavigation('/login')}
                    className="justify-start"
                  >
                    Login
                  </Button>
                  <Button 
                    variant="neon"
                    onClick={() => handleNavigation('/register')}
                    className="justify-start"
                  >
                    Criar Conta
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};