
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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("meus-orcamentos");
  const navigate = useNavigate();

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

  const handleDownloadPDF = async (budgetId: string, clientName: string) => {
    try {
      // Navigate to the budget view page first to ensure it's rendered
      navigate(`/budget/${budgetId}`);
      
      // Wait for the page to load
      setTimeout(async () => {
        // Generate PDF
        const result = await generatePDF('budget-preview', `orcamento-${clientName.replace(/\s+/g, '-').toLowerCase()}`);
        
        if (result) {
          toast.success("PDF gerado com sucesso!");
        } else {
          toast.error("Erro ao gerar o PDF.");
        }
        
        // Navigate back to dashboard
        navigate('/dashboard');
      }, 1000);
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
                                onClick={() => handleDownloadPDF(budget.id, budget.client_name)}
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
