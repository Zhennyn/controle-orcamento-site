
import React from "react";

interface CompanyInfoProps {
  companyData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string | null;
  };
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ companyData }) => {
  return (
    <div>
      {companyData.logo ? (
        <img
          src={companyData.logo}
          alt="Logo da Empresa"
          className="h-16 object-contain mb-2"
          crossOrigin="anonymous"
        />
      ) : (
        <div className="h-16 w-16 bg-budget-blue rounded-md flex items-center justify-center mb-2">
          <span className="text-white font-bold text-xl">
            {companyData.name.charAt(0)}
          </span>
        </div>
      )}
      <h2 className="font-bold text-lg">{companyData.name || "Sua Empresa"}</h2>
      <p className="text-sm text-gray-600">{companyData.email || "contato@empresa.com"}</p>
      <p className="text-sm text-gray-600">{companyData.phone || "(00) 00000-0000"}</p>
      <p className="text-sm text-gray-600">{companyData.address || "Endereço da empresa"}</p>
    </div>
  );
};

export default CompanyInfo;
