
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientFormProps {
  clientData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  setClientData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      address: string;
    }>
  >;
}

const ClientForm: React.FC<ClientFormProps> = ({ clientData, setClientData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              name="name"
              placeholder="Nome completo"
              value={clientData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email</Label>
            <Input
              id="clientEmail"
              name="email"
              type="email"
              placeholder="email@exemplo.com"
              value={clientData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientPhone">Telefone</Label>
            <Input
              id="clientPhone"
              name="phone"
              placeholder="(00) 00000-0000"
              value={clientData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientAddress">Endereço</Label>
            <Input
              id="clientAddress"
              name="address"
              placeholder="Endereço completo"
              value={clientData.address}
              onChange={handleChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientForm;
