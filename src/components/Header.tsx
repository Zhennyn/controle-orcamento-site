
import React from "react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-budget-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Orçamentos Personalizados</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button size="sm" className="bg-budget-blue hover:bg-blue-700 text-white">
            Cadastre-se
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
