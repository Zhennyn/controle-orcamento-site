
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <Link to="/new-budget">
            <Button className="bg-budget-green hover:bg-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Novo Orçamento
            </Button>
          </Link>
        </div>

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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 mb-4">Você ainda não criou nenhum orçamento.</p>
                <Link to="/new-budget">
                  <Button className="bg-budget-blue hover:bg-blue-700">
                    Criar Primeiro Orçamento
                  </Button>
                </Link>
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
                          <Link to={`/budget/${budget.id}`}>
                            <Button size="sm" variant="outline" className="bg-transparent text-budget-blue border-budget-blue hover:bg-budget-blue hover:text-white">
                              Visualizar
                            </Button>
                          </Link>
                          <Link to={`/edit-budget/${budget.id}`}>
                            <Button size="sm" variant="outline" className="bg-transparent text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white">
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
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
