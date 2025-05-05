
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Orçamentos Personalizados. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-budget-blue text-sm">
              Termos de Uso
            </a>
            <a href="#" className="text-gray-600 hover:text-budget-blue text-sm">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-600 hover:text-budget-blue text-sm">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
