
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientForm from "@/components/ClientForm";
import CompanyForm from "@/components/CompanyForm";
import BudgetItems, { BudgetItem } from "@/components/BudgetItems";
import BudgetSummary from "@/components/BudgetSummary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
  
  // Tab state
  const [activeTab, setActiveTab] = useState("form");

  // Save budget to database
  const handleSaveBudget = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar orçamentos");
      navigate("/login");
      return;
    }

    if (clientData.name.trim() === "") {
      toast.error("Por favor, preencha o nome do cliente");
      return;
    }

    if (items.length === 0) {
      toast.error("Por favor, adicione pelo menos um item ao orçamento");
      return;
    }

    try {
      // First, insert the budget
      const { data: budgetData, error: budgetError } = await supabase
        .from("budgets")
        .insert({
          user_id: user.id,
          client_name: clientData.name,
          service_description: companyData.name, // Using company name as service description for now
          observations: "",
        })
        .select()
        .single();

      if (budgetError) {
        throw budgetError;
      }

      // Then, insert all budget items
      const budgetItems = items.map(item => ({
        budget_id: budgetData.id,
        item_name: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));

      const { error: itemsError } = await supabase
        .from("budget_items")
        .insert(budgetItems);

      if (itemsError) {
        throw itemsError;
      }

      toast.success("Orçamento salvo com sucesso!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      toast.error("Erro ao salvar orçamento: " + error.message);
      console.error("Error saving budget:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
          <Tabs 
            defaultValue="form" 
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="form" className="text-lg py-3">Criar Orçamento</TabsTrigger>
              <TabsTrigger value="preview" className="text-lg py-3">Visualizar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="space-y-6 animate-fade-in">
              <ClientForm clientData={clientData} setClientData={setClientData} />
              <CompanyForm companyData={companyData} setCompanyData={setCompanyData} />
              <BudgetItems items={items} setItems={setItems} />
              
              <div className="flex justify-end pt-6 space-x-3">
                <Button 
                  onClick={() => handleTabChange("preview")} 
                  variant="outline"
                  size="lg"
                >
                  Pré-visualizar
                </Button>
                <Button 
                  onClick={handleSaveBudget} 
                  size="lg"
                  className="bg-budget-green hover:bg-green-600 text-white"
                >
                  Salvar Orçamento
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="animate-fade-in">
              <BudgetSummary 
                clientData={clientData} 
                companyData={companyData} 
                items={items}
                onBackToEdit={() => handleTabChange("form")} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
