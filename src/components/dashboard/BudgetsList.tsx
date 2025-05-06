
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FilePen, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Budget {
  id: string;
  client_name: string;
  service_description: string;
  created_at: string;
}

interface BudgetsListProps {
  budgets: Budget[];
  isLoading: boolean;
  isFree: boolean;
  onSetActiveTab: (tab: string) => void;
  onBudgetsChange: (budgets: Budget[]) => void;
}

const BudgetsList: React.FC<BudgetsListProps> = ({
  budgets,
  isLoading,
  isFree,
  onSetActiveTab,
  onBudgetsChange
}) => {
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

        onBudgetsChange(budgets.filter(budget => budget.id !== id));
        toast.success("Orçamento excluído com sucesso");
      } catch (error: any) {
        toast.error("Erro ao excluir orçamento: " + error.message);
        console.error("Error deleting budget:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-budget-blue"></div>
        <p className="mt-2 text-gray-600">Carregando orçamentos...</p>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="py-10 text-center border rounded-lg bg-gray-50">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">Você ainda não criou nenhum orçamento.</p>
        <Button 
          className="bg-budget-blue hover:bg-blue-700"
          onClick={() => onSetActiveTab("criar-orcamento")}
        >
          Criar Primeiro Orçamento
        </Button>
      </div>
    );
  }

  return (
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
  );
};

export default BudgetsList;
