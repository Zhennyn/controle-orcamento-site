
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from "sonner";

// Import our new components
import BudgetsList from "@/components/dashboard/BudgetsList";
import CreateBudgetCard from "@/components/dashboard/CreateBudgetCard";
import PlanBadge from "@/components/dashboard/PlanBadge";

interface Budget {
  id: string;
  client_name: string;
  service_description: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, userPlan } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("meus-orcamentos");
  const navigate = useNavigate();
  const isFree = userPlan === "free";

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const { data, error } = await supabase
          .from("budgets")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setBudgets(data || []);
      } catch (error: any) {
        toast.error("Erro ao carregar orçamentos: " + error.message);
        console.error("Error fetching budgets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBudgets();
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <PlanBadge isFree={isFree} />
        </div>

        <Tabs defaultValue="meus-orcamentos" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="meus-orcamentos" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Meus Orçamentos
            </TabsTrigger>
            <TabsTrigger value="criar-orcamento" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Criar Orçamento
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="meus-orcamentos">
            <Card>
              <CardHeader>
                <CardTitle>Seus Orçamentos</CardTitle>
                <CardDescription>
                  Gerencie todos os seus orçamentos em um só lugar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetsList 
                  budgets={budgets} 
                  isLoading={isLoading} 
                  isFree={isFree} 
                  onSetActiveTab={setActiveTab}
                  onBudgetsChange={setBudgets}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="criar-orcamento">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Novo Orçamento</CardTitle>
                <CardDescription>
                  Crie um novo orçamento personalizado para seu cliente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CreateBudgetCard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
