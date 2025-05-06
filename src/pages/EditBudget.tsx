
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientForm from "@/components/ClientForm";
import CompanyForm from "@/components/CompanyForm";
import BudgetItems, { BudgetItem } from "@/components/BudgetItems";
import BudgetSummary from "@/components/BudgetSummary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EditBudget: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  
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

  // Fetch budget data on load
  useEffect(() => {
    const fetchBudget = async () => {
      if (!id || !user) return;

      try {
        // Fetch budget data
        const { data: budgetData, error: budgetError } = await supabase
          .from("budgets")
          .select("*")
          .eq("id", id)
          .single();

        if (budgetError) throw budgetError;
        
        // Check if user owns this budget
        if (budgetData.user_id !== user.id) {
          toast.error("Você não tem permissão para editar este orçamento");
          navigate("/dashboard");
          return;
        }

        // Populate client data
        setClientData({
          name: budgetData.client_name || "",
          email: "",  // These fields might not exist in your schema
          phone: "",  // Add them if needed
          address: "",
        });

        // Populate company data
        setCompanyData({
          name: budgetData.service_description || "",
          email: "",  // These fields might not exist in your schema
          phone: "",  // Add them if needed
          address: "",
          logo: null,
        });

        // Fetch budget items
        const { data: itemsData, error: itemsError } = await supabase
          .from("budget_items")
          .select("*")
          .eq("budget_id", id);

        if (itemsError) throw itemsError;

        // Map budget items to the format expected by BudgetItems component
        const mappedItems: BudgetItem[] = itemsData.map((item) => ({
          id: item.id,
          description: item.item_name,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unit_price),
        }));

        setItems(mappedItems);
      } catch (error: any) {
        toast.error("Erro ao carregar orçamento: " + error.message);
        console.error("Error fetching budget:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [id, user, navigate]);

  const handleSaveBudget = async () => {
    if (!user || !id) {
      toast.error("Erro ao identificar usuário ou orçamento");
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

    setSaving(true);

    try {
      // Update budget
      const { error: budgetError } = await supabase
        .from("budgets")
        .update({
          client_name: clientData.name,
          service_description: companyData.name,
          updated_at: new Date(),
        })
        .eq("id", id);

      if (budgetError) throw budgetError;

      // Delete existing items
      const { error: deleteError } = await supabase
        .from("budget_items")
        .delete()
        .eq("budget_id", id);

      if (deleteError) throw deleteError;

      // Insert updated items
      const budgetItems = items.map(item => ({
        budget_id: id,
        item_name: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));

      const { error: itemsError } = await supabase
        .from("budget_items")
        .insert(budgetItems);

      if (itemsError) throw itemsError;

      toast.success("Orçamento atualizado com sucesso!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      toast.error("Erro ao atualizar orçamento: " + error.message);
      console.error("Error updating budget:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-budget-blue mx-auto mb-4" />
            <p className="text-gray-600">Carregando orçamento...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Editar Orçamento
          </h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto">
            Faça alterações no seu orçamento e salve as modificações.
          </p>
        </section>

        <div className="max-w-5xl mx-auto">
          <Tabs 
            defaultValue="form" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="form" className="text-lg py-3">Editar Orçamento</TabsTrigger>
              <TabsTrigger value="preview" className="text-lg py-3">Visualizar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="space-y-6 animate-fade-in">
              <ClientForm clientData={clientData} setClientData={setClientData} />
              <CompanyForm companyData={companyData} setCompanyData={setCompanyData} />
              <BudgetItems items={items} setItems={setItems} />
              
              <div className="flex justify-end pt-6 space-x-3">
                <Button 
                  onClick={() => navigate("/dashboard")} 
                  variant="outline"
                  size="lg"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => setActiveTab("preview")} 
                  variant="outline"
                  size="lg"
                >
                  Pré-visualizar
                </Button>
                <Button 
                  onClick={handleSaveBudget} 
                  size="lg"
                  className="bg-budget-green hover:bg-green-600 text-white"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="animate-fade-in">
              <BudgetSummary 
                clientData={clientData} 
                companyData={companyData} 
                items={items}
                onBackToEdit={() => setActiveTab("form")} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditBudget;
