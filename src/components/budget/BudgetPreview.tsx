
import React, { useRef } from "react";
import CompanyInfo from "./CompanyInfo";
import ClientInfo from "./ClientInfo";
import BudgetItemsTable from "./BudgetItemsTable";
import { BudgetItem } from "../BudgetItems";

interface BudgetPreviewProps {
  budgetNumber: string;
  formattedDate: string;
  clientData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  companyData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string | null;
  };
  items: BudgetItem[];
  isFree: boolean;
}

const BudgetPreview: React.FC<BudgetPreviewProps> = ({
  budgetNumber,
  formattedDate,
  clientData,
  companyData,
  items,
  isFree,
}) => {
  const budgetRef = useRef<HTMLDivElement>(null);

  return (
    <div id="budget-pdf" ref={budgetRef} className="bg-white p-6 rounded-md shadow-sm">
      <div className="flex flex-col md:flex-row justify-between pb-6 border-b">
        <div className="mb-4 md:mb-0">
          <CompanyInfo companyData={companyData} />
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-budget-blue">ORÇAMENTO</h2>
          <p className="text-sm text-gray-600 mb-2">Número: {budgetNumber}</p>
          <p className="text-sm text-gray-600">Data: {formattedDate}</p>
          <p className="text-sm font-medium mt-4">Válido por: 15 dias</p>
        </div>
      </div>

      {isFree && (
        <div className="py-2 px-4 bg-gray-100 text-gray-600 text-sm text-center my-3 rounded">
          Versão gratuita - O PDF incluirá marca d'água
        </div>
      )}

      <div className="py-6 border-b">
        <ClientInfo clientData={clientData} />
      </div>

      <div className="py-6">
        <BudgetItemsTable items={items} />
      </div>

      <div className="pt-6 border-t text-center">
        <p className="font-medium text-budget-blue">
          Obrigado pela oportunidade de apresentar este orçamento.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Para aprovar, responda este e-mail ou entre em contato.
        </p>
      </div>
    </div>
  );
};

export default BudgetPreview;
