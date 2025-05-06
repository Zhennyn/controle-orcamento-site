
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FilePen, FileText, Plus } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from "sonner";
import { generatePDF } from "@/utils/pdfUtils";

interface Budget {
  id: string;
  client_name: string;
  service_description: string;
  created_at: string;
}

interface BudgetItem {
  id: string;
  budget_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
}

const Dashboard: React.FC = () => {
  const { user, userPlan } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("meus-orcamentos");
  const navigate = useNavigate();
  const isFree = userPlan === "free";

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const { data, error } = await supabase
          .from("budgets")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setBudgets(data || []);
      } catch (error: any) {
        toast.error("Erro ao carregar orçamentos: " + error.message);
        console.error("Error fetching budgets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este orçamento?")) {
      try {
        const { error } = await supabase
          .from("budgets")
          .delete()
          .eq("id", id);

        if (error) {
          throw error;
        }

        setBudgets(budgets.filter(budget => budget.id !== id));
        toast.success("Orçamento excluído com sucesso");
      } catch (error: any) {
        toast.error("Erro ao excluir orçamento: " + error.message);
        console.error("Error deleting budget:", error);
      }
    }
  };

  const handleDownloadPDF = async (budgetId: string) => {
    try {
      // First, we need to fetch the budget details
      const { data: budgetData, error: budgetError } = await supabase
        .from("budgets")
        .select("*")
        .eq("id", budgetId)
        .single();
      
      if (budgetError) throw budgetError;
      
      // Then, fetch the budget items
      const { data: itemsData, error: itemsError } = await supabase
        .from("budget_items")
        .select("*")
        .eq("budget_id", budgetId);
      
      if (itemsError) throw itemsError;
      
      // Prepare client and company data
      const clientData = {
        name: budgetData.client_name || "",
        email: "",
        phone: "",
        address: "",
      };
      
      const companyData = {
        name: budgetData.service_description || "",
        email: "",
        phone: "",
        address: "",
        logo: null,
      };
      
      // Map budget items
      const budgetItems = itemsData.map((item: BudgetItem) => ({
        id: item.id,
        description: item.item_name,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unit_price),
      }));
      
      // Create a temporary container for the budget to render it for PDF
      const container = document.createElement('div');
      container.id = 'temp-budget-container';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);
      
      // Create the budget content
      const budgetHtml = `
        <div id="budget-pdf" class="bg-white p-6" style="width: 800px; font-family: Arial, sans-serif;">
          <div style="display: flex; justify-content: space-between; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
            <div>
              <div style="height: 64px; width: 64px; background-color: #3b82f6; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                <span style="color: white; font-weight: bold; font-size: 24px;">${companyData.name.charAt(0) || "E"}</span>
              </div>
              <h2 style="font-weight: bold; font-size: 18px;">${companyData.name || "Sua Empresa"}</h2>
              <p style="font-size: 14px; color: #6b7280;">${companyData.email || "contato@empresa.com"}</p>
              <p style="font-size: 14px; color: #6b7280;">${companyData.phone || "(00) 00000-0000"}</p>
              <p style="font-size: 14px; color: #6b7280;">${companyData.address || "Endereço da empresa"}</p>
            </div>
            <div style="text-align: right;">
              <h2 style="font-size: 24px; font-weight: bold; color: #3b82f6;">ORÇAMENTO</h2>
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Número: ORC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}</p>
              <p style="font-size: 14px; color: #6b7280;">Data: ${new Date(budgetData.created_at).toLocaleDateString("pt-BR")}</p>
              <p style="font-size: 14px; font-weight: 500; margin-top: 16px;">Válido por: 15 dias</p>
            </div>
          </div>
          
          <div style="padding: 24px 0; border-bottom: 1px solid #e5e7eb;">
            <h3 style="font-weight: 600; color: #4b5563; margin-bottom: 8px;">PARA:</h3>
            <p style="font-weight: 500;">${clientData.name || "Nome do Cliente"}</p>
            <p style="font-size: 14px; color: #6b7280;">${clientData.email || "cliente@email.com"}</p>
            <p style="font-size: 14px; color: #6b7280;">${clientData.phone || "(00) 00000-0000"}</p>
            <p style="font-size: 14px; color: #6b7280;">${clientData.address || "Endereço do cliente"}</p>
          </div>
          
          <div style="padding: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <th style="text-align: left; padding: 8px 0; font-size: 14px; font-weight: 600; color: #4b5563;">Descrição</th>
                  <th style="text-align: right; padding: 8px 0; font-size: 14px; font-weight: 600; color: #4b5563;">Qtde</th>
                  <th style="text-align: right; padding: 8px 0; font-size: 14px; font-weight: 600; color: #4b5563;">Preço Unit.</th>
                  <th style="text-align: right; padding: 8px 0; font-size: 14px; font-weight: 600; color: #4b5563;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${budgetItems.length > 0 ? 
                  budgetItems.map((item: any, index: number) => `
                    <tr style="${index % 2 === 0 ? 'background-color: #f9fafb;' : ''}">
                      <td style="padding: 12px 0; font-size: 14px;">${item.description || "Descrição do item"}</td>
                      <td style="padding: 12px 0; font-size: 14px; text-align: right;">${item.quantity}</td>
                      <td style="padding: 12px 0; font-size: 14px; text-align: right;">R$ ${item.unitPrice.toFixed(2)}</td>
                      <td style="padding: 12px 0; font-size: 14px; text-align: right; font-weight: 500;">
                        R$ ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  `).join('') : 
                  `<tr>
                    <td colspan="4" style="padding: 16px 0; text-align: center; color: #6b7280; font-style: italic;">
                      Nenhum item adicionado ao orçamento
                    </td>
                  </tr>`
                }
              </tbody>
              <tfoot>
                <tr style="border-top: 1px solid #e5e7eb;">
                  <td colspan="3" style="padding: 16px 0; text-align: right; font-weight: bold;">
                    Total
                  </td>
                  <td style="padding: 16px 0; text-align: right; font-weight: bold;">
                    R$ ${budgetItems.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div style="padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="font-weight: 500; color: #3b82f6;">
              Obrigado pela oportunidade de apresentar este orçamento.
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">
              Para aprovar, responda este e-mail ou entre em contato.
            </p>
          </div>
        </div>
      `;
      
      container.innerHTML = budgetHtml;
      
      // Generate PDF
      const fileName = `orcamento-${budgetData.client_name.toLowerCase().replace(/\s+/g, '-')}`;
      const result = await generatePDF('budget-pdf', fileName, isFree);
      
      // Remove temporary container
      document.body.removeChild(container);
      
      // Show result
      if (result) {
        toast.success("PDF gerado com sucesso!");
        if (isFree) {
          toast("Você está usando a versão gratuita com marca d'água", {
            description: "Faça upgrade para a versão premium para remover marcas d'água"
          });
        }
      } else {
        toast.error("Erro ao gerar o PDF.");
      }
    } catch (error: any) {
      toast.error("Erro ao gerar PDF: " + error.message);
      console.error("Error generating PDF:", error);
    }
  };

  const handleCreateNewBudget = () => {
    navigate('/create');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          {isFree && (
            <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-md text-sm">
              Plano Gratuito - PDFs incluem marca d'água
            </div>
          )}
        </div>

        <Tabs defaultValue="meus-orcamentos" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="meus-orcamentos" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Meus Orçamentos
            </TabsTrigger>
            <TabsTrigger value="criar-orcamento" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Criar Orçamento
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="meus-orcamentos">
            <Card>
              <CardHeader>
                <CardTitle>Seus Orçamentos</CardTitle>
                <CardDescription>
                  Gerencie todos os seus orçamentos em um só lugar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-10 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-budget-blue"></div>
                    <p className="mt-2 text-gray-600">Carregando orçamentos...</p>
                  </div>
                ) : budgets.length === 0 ? (
                  <div className="py-10 text-center border rounded-lg bg-gray-50">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">Você ainda não criou nenhum orçamento.</p>
                    <Button 
                      className="bg-budget-blue hover:bg-blue-700"
                      onClick={() => setActiveTab("criar-orcamento")}
                    >
                      Criar Primeiro Orçamento
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="py-3 px-4 font-semibold">Cliente</th>
                          <th className="py-3 px-4 font-semibold hidden md:table-cell">Descrição</th>
                          <th className="py-3 px-4 font-semibold hidden md:table-cell">Data</th>
                          <th className="py-3 px-4 font-semibold text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {budgets.map((budget) => (
                          <tr key={budget.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4">{budget.client_name}</td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              {budget.service_description?.substring(0, 50) || "Sem descrição"}
                              {budget.service_description?.length > 50 ? "..." : ""}
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              {new Date(budget.created_at).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-transparent text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white"
                                onClick={() => handleDownloadPDF(budget.id)}
                              >
                                PDF
                              </Button>
                              <Link to={`/edit-budget/${budget.id}`}>
                                <Button size="sm" variant="outline" className="bg-transparent text-budget-blue border-budget-blue hover:bg-budget-blue hover:text-white">
                                  <FilePen className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                              </Link>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-transparent text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                                onClick={() => handleDeleteBudget(budget.id)}
                              >
                                Excluir
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="criar-orcamento">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Novo Orçamento</CardTitle>
                <CardDescription>
                  Crie um novo orçamento personalizado para seu cliente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-10">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <FileText className="h-16 w-16 text-budget-blue" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Crie um orçamento profissional</h3>
                      <p className="text-gray-600 max-w-md mb-6">
                        Personalize todos os detalhes, adicione seus itens e serviços, 
                        e gere um PDF pronto para enviar ao seu cliente.
                      </p>
                    </div>
                    <Button 
                      className="bg-budget-green hover:bg-green-600 px-8 py-6 h-auto"
                      onClick={handleCreateNewBudget}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Criar Orçamento Agora
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
