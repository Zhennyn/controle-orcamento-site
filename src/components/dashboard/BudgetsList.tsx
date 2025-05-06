
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FilePen, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleRowClick = (budgetId: string) => {
    setSelectedBudgetId(budgetId === selectedBudgetId ? null : budgetId);
  };

  const handlePreviewBudget = () => {
    if (selectedBudgetId) {
      navigate(`/edit-budget/${selectedBudgetId}?view=preview`);
    } else {
      toast.error("Selecione um orçamento para visualizar");
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
    <div className="space-y-4">
      {selectedBudgetId && (
        <div className="flex justify-end">
          <Button 
            className="bg-budget-green hover:bg-green-600 text-white"
            onClick={handlePreviewBudget}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar Selecionado
          </Button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Descrição</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow 
                key={budget.id} 
                className={`cursor-pointer ${selectedBudgetId === budget.id ? 'bg-blue-50' : ''} hover:bg-gray-50`}
                onClick={() => handleRowClick(budget.id)}
              >
                <TableCell className="w-12">
                  <div className={`w-4 h-4 rounded-full border border-gray-400 ${selectedBudgetId === budget.id ? 'bg-budget-blue border-budget-blue' : 'bg-white'}`}></div>
                </TableCell>
                <TableCell>{budget.client_name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {budget.service_description?.substring(0, 50) || "Sem descrição"}
                  {budget.service_description?.length > 50 ? "..." : ""}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(budget.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link to={`/edit-budget/${budget.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" className="bg-transparent text-budget-blue border-budget-blue hover:bg-budget-blue hover:text-white">
                      <FilePen className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-transparent text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBudget(budget.id);
                    }}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BudgetsList;
