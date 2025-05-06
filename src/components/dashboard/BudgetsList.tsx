
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FilePen, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generatePDF } from "@/utils/pdfUtils";

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
      const budgetItems = itemsData.map((item: any) => ({
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
  );
};

export default BudgetsList;
