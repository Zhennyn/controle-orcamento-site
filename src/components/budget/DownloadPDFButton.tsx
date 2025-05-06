
import React from "react";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/utils/pdfUtils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface DownloadPDFButtonProps {
  budgetNumber: string;
  isFree: boolean;
  checkSubscription: () => Promise<void>;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ 
  budgetNumber,
  isFree,
  checkSubscription
}) => {
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

  return (
    <Button 
      onClick={handleDownloadPDF} 
      size="lg"
      className="bg-budget-green hover:bg-green-600 text-white"
    >
      Baixar PDF
    </Button>
  );
};

export default DownloadPDFButton;
