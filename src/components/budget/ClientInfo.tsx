
import React from "react";

interface ClientInfoProps {
  clientData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

const ClientInfo: React.FC<ClientInfoProps> = ({ clientData }) => {
  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-2">PARA:</h3>
      <p className="font-medium">{clientData.name || "Nome do Cliente"}</p>
      <p className="text-sm text-gray-600">{clientData.email || "cliente@email.com"}</p>
      <p className="text-sm text-gray-600">{clientData.phone || "(00) 00000-0000"}</p>
      <p className="text-sm text-gray-600">{clientData.address || "Endereço do cliente"}</p>
    </div>
  );
};

export default ClientInfo;
