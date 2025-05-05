
import React from "react";
import { Link } from "react-router-dom";

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
            <Link to="/termos" className="text-gray-600 hover:text-budget-blue text-sm">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="text-gray-600 hover:text-budget-blue text-sm">
              Política de Privacidade
            </Link>
            <a href="mailto:contato@geradordeorcamentos.com.br" className="text-gray-600 hover:text-budget-blue text-sm">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
