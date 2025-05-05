
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompanyFormProps {
  companyData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string | null;
  };
  setCompanyData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      address: string;
      logo: string | null;
    }>
  >;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ companyData, setCompanyData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyData((prev) => ({
          ...prev,
          logo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              name="name"
              placeholder="Nome da sua empresa"
              value={companyData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyEmail">Email</Label>
            <Input
              id="companyEmail"
              name="email"
              type="email"
              placeholder="contato@empresa.com"
              value={companyData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyPhone">Telefone</Label>
            <Input
              id="companyPhone"
              name="phone"
              placeholder="(00) 00000-0000"
              value={companyData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Endereço</Label>
            <Input
              id="companyAddress"
              name="address"
              placeholder="Endereço completo"
              value={companyData.address}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label htmlFor="companyLogo">Logo da Empresa</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                className="w-auto"
              >
                Selecionar Logo
              </Button>
              <Input
                ref={fileInputRef}
                id="companyLogo"
                name="logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              {companyData.logo && (
                <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                  <img
                    src={companyData.logo}
                    alt="Logo Preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;
