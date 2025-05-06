
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlanBadgeProps {
  isFree: boolean;
}

const PlanBadge: React.FC<PlanBadgeProps> = ({ isFree }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStartCheckout = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (!isFree) {
    return (
      <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-md text-sm flex items-center">
        <span className="font-medium">Plano Premium Ativo</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-md text-sm">
        Plano Gratuito - PDFs incluem marca d'água
      </div>
      <Button
        className="bg-budget-green hover:bg-green-600 text-white"
        size="sm"
        disabled={isLoading}
        onClick={handleStartCheckout}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {isLoading ? "Processando..." : "Upgrade p/ Premium"}
      </Button>
    </div>
  );
};

export default PlanBadge;
