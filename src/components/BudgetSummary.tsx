import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BudgetItem } from "./BudgetItems";
import { generatePDF } from "@/utils/pdfUtils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface BudgetSummaryProps {
  clientData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  companyData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string | null;
  };
  items: BudgetItem[];
  onBackToEdit?: () => void;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  clientData,
  companyData,
  items,
  onBackToEdit,
}) => {
  const budgetRef = useRef<HTMLDivElement>(null);
  const { userPlan, checkSubscription } = useAuth();
  const isFree = userPlan === "free";

  useEffect(() => {
    // Verifica o status da assinatura ao carregar o componente
    checkSubscription();
  }, [checkSubscription]);

  const calculateTotal = (item: BudgetItem) => {
    return item.quantity * item.unitPrice;
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + calculateTotal(item), 0);
  };

  // Generate a budget number based on date
  const budgetNumber = `ORC-${new Date().getFullYear()}${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}-${Math.floor(
    Math.random() * 1000
  )
    .toString()
    .padStart(3, "0")}`;

  const formattedDate = new Date().toLocaleDateString("pt-BR");

  const handleDownloadPDF = async () => {
    // Verificar novamente o status da assinatura antes de gerar o PDF
    await checkSubscription();
    
    const success = await generatePDF("budget-pdf", `Orcamento-${budgetNumber}`, isFree);
    
    if (success) {
      toast.success("PDF gerado com sucesso!");
      if (isFree) {
        toast("Você está usando a versão gratuita com marca d'água", {
          description: "Faça upgrade para a versão premium para remover marcas d'água"
        });
      }
    } else {
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    }
  };

  const handleUpgrade = async () => {
    try {
      toast.loading("Iniciando o checkout...");
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {},
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não encontrada");
      }
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao iniciar o checkout: " + error.message);
    }
  };

  return (
    <Card className="bg-budget-gray">
      <CardHeader>
        <CardTitle>Visualização do Orçamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="budget-pdf" ref={budgetRef} className="bg-white p-6 rounded-md shadow-sm">
          <div className="flex flex-col md:flex-row justify-between pb-6 border-b">
            <div className="mb-4 md:mb-0">
              {companyData.logo ? (
                <img
                  src={companyData.logo}
                  alt="Logo da Empresa"
                  className="h-16 object-contain mb-2"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="h-16 w-16 bg-budget-blue rounded-md flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-xl">
                    {companyData.name.charAt(0)}
                  </span>
                </div>
              )}
              <h2 className="font-bold text-lg">{companyData.name || "Sua Empresa"}</h2>
              <p className="text-sm text-gray-600">{companyData.email || "contato@empresa.com"}</p>
              <p className="text-sm text-gray-600">{companyData.phone || "(00) 00000-0000"}</p>
              <p className="text-sm text-gray-600">{companyData.address || "Endereço da empresa"}</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-budget-blue">ORÇAMENTO</h2>
              <p className="text-sm text-gray-600 mb-2">Número: {budgetNumber}</p>
              <p className="text-sm text-gray-600">Data: {formattedDate}</p>
              <p className="text-sm font-medium mt-4">Válido por: 15 dias</p>
            </div>
          </div>

          {isFree && (
            <div className="py-2 px-4 bg-gray-100 text-gray-600 text-sm text-center my-3 rounded">
              Versão gratuita - O PDF incluirá marca d'água
            </div>
          )}

          <div className="py-6 border-b">
            <h3 className="font-semibold text-gray-700 mb-2">PARA:</h3>
            <p className="font-medium">{clientData.name || "Nome do Cliente"}</p>
            <p className="text-sm text-gray-600">{clientData.email || "cliente@email.com"}</p>
            <p className="text-sm text-gray-600">{clientData.phone || "(00) 00000-0000"}</p>
            <p className="text-sm text-gray-600">{clientData.address || "Endereço do cliente"}</p>
          </div>

          <div className="py-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">Descrição</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-700">Qtde</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-700">Preço Unit.</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-3 text-sm">{item.description || "Descrição do item"}</td>
                      <td className="py-3 text-sm text-right">{item.quantity}</td>
                      <td className="py-3 text-sm text-right">R$ {item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 text-sm text-right font-medium">
                        R$ {calculateTotal(item).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500 italic">
                      Nenhum item adicionado ao orçamento
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={3} className="py-4 text-right font-bold">
                    Total
                  </td>
                  <td className="py-4 text-right font-bold">
                    R$ {calculateGrandTotal().toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="pt-6 border-t text-center">
            <p className="font-medium text-budget-blue">
              Obrigado pela oportunidade de apresentar este orçamento.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Para aprovar, responda este e-mail ou entre em contato.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
          {onBackToEdit && (
            <Button 
              variant="outline"
              size="lg"
              onClick={onBackToEdit}
            >
              Voltar para Edição
            </Button>
          )}
          
          <Button 
            onClick={handleDownloadPDF} 
            size="lg"
            className="bg-budget-green hover:bg-green-600 text-white"
          >
            Baixar PDF
          </Button>
          
          {isFree && (
            <Button 
              onClick={handleUpgrade} 
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Remover Marca D'água (R$20/mês)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
