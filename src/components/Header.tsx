
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-budget-blue flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Controlorça
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="px-2 py-1 text-gray-700 hover:text-budget-blue transition-colors">Home</Link>
            {user && (
              <Link to="/dashboard" className="px-2 py-1 text-gray-700 hover:text-budget-blue transition-colors">Dashboard</Link>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <span className="hidden md:inline text-sm text-gray-600 mr-2">
                  Olá, {user.user_metadata.full_name?.split(' ')[0] || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-budget-green hover:bg-green-600">
                    Criar Conta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
