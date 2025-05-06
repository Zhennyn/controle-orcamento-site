
import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PremiumUpgradeButton: React.FC = () => {
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
    <Button 
      onClick={handleUpgrade} 
      size="lg"
      className="bg-amber-500 hover:bg-amber-600 text-white"
    >
      Remover Marca D'água (R$20/mês)
    </Button>
  );
};

export default PremiumUpgradeButton;
