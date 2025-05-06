
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateBudgetCard: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateNewBudget = () => {
    navigate('/create');
  };

  return (
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
  );
};

export default CreateBudgetCard;
