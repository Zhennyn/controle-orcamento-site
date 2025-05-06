
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

const PremiumUpgradeButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpgrade = async () => {
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

  return (
    <Button 
      onClick={handleUpgrade} 
      size="lg"
      disabled={isLoading}
      className="bg-amber-500 hover:bg-amber-600 text-white"
    >
      <CreditCard className="h-4 w-4 mr-2" />
      {isLoading ? "Processando..." : "Remover Marca D'água (R$20/mês)"}
    </Button>
  );
};

export default PremiumUpgradeButton;
