
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BudgetItem } from "./BudgetItems";
import { useAuth } from "@/contexts/AuthContext";
import BudgetPreview from "./budget/BudgetPreview";
import DownloadPDFButton from "./budget/DownloadPDFButton";
import PremiumUpgradeButton from "./budget/PremiumUpgradeButton";

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
  const { userPlan, checkSubscription } = useAuth();
  const isFree = userPlan === "free";

  useEffect(() => {
    // Verifica o status da assinatura ao carregar o componente
    checkSubscription();
  }, [checkSubscription]);

  // Generate a budget number based on date
  const budgetNumber = `ORC-${new Date().getFullYear()}${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}-${Math.floor(
    Math.random() * 1000
  )
    .toString()
    .padStart(3, "0")}`;

  const formattedDate = new Date().toLocaleDateString("pt-BR");

  return (
    <Card className="bg-budget-gray">
      <CardHeader>
        <CardTitle>Visualização do Orçamento</CardTitle>
      </CardHeader>
      <CardContent>
        <BudgetPreview 
          budgetNumber={budgetNumber}
          formattedDate={formattedDate}
          clientData={clientData}
          companyData={companyData}
          items={items}
          isFree={isFree}
        />

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
          
          <DownloadPDFButton 
            budgetNumber={budgetNumber}
            isFree={isFree}
            checkSubscription={checkSubscription}
          />
          
          {isFree && <PremiumUpgradeButton />}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
