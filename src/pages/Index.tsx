
import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientForm from "@/components/ClientForm";
import CompanyForm from "@/components/CompanyForm";
import BudgetItems, { BudgetItem } from "@/components/BudgetItems";
import BudgetSummary from "@/components/BudgetSummary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { generatePDF } from "@/utils/pdfGenerator";

const Index: React.FC = () => {
  // Client data state
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Company data state
  const [companyData, setCompanyData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: null as string | null,
  });

  // Budget items state
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [activeTab, setActiveTab] = useState("form");
  const budgetRef = useRef<HTMLDivElement>(null);

  // Generate PDF and download budget
  const handleGenerateBudget = async () => {
    // If viewing the form, switch to the preview first
    if (activeTab === "form") {
      setActiveTab("preview");
      // Give time for the preview to render before generating PDF
      toast.info("Visualizando orçamento. Clique em 'Baixar PDF' para salvar.");
      return;
    }
    
    // Generate the PDF
    const budgetNumber = `ORC-${new Date().getFullYear()}${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}-${Math.floor(
      Math.random() * 1000
    ).toString().padStart(3, "0")}`;
    
    const result = await generatePDF("budget-preview", `${budgetNumber}.pdf`);
    
    if (result) {
      toast.success("PDF gerado com sucesso!");
    } else {
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleBackToEdit = () => {
    setActiveTab("form");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Gerador de Orçamentos Personalizados
          </h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto">
            Crie orçamentos profissionais em segundos! Preencha as informações abaixo para gerar um orçamento personalizado.
          </p>
        </section>

        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="form" className="text-lg py-3">Criar Orçamento</TabsTrigger>
              <TabsTrigger value="preview" className="text-lg py-3">Visualizar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="space-y-6 animate-fade-in">
              <ClientForm clientData={clientData} setClientData={setClientData} />
              <CompanyForm companyData={companyData} setCompanyData={setCompanyData} />
              <BudgetItems items={items} setItems={setItems} />
              
              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleGenerateBudget} 
                  size="lg"
                  className="bg-budget-green hover:bg-green-600 text-white"
                >
                  Visualizar Orçamento
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="animate-fade-in">
              <div id="budget-preview" ref={budgetRef}>
                <BudgetSummary 
                  clientData={clientData} 
                  companyData={companyData} 
                  items={items} 
                />
              </div>
              <div className="flex justify-center mt-8 space-x-4">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={handleBackToEdit}
                >
                  Voltar para Edição
                </Button>
                <Button 
                  onClick={handleGenerateBudget} 
                  size="lg"
                  className="bg-budget-green hover:bg-green-600 text-white"
                >
                  Baixar PDF
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
