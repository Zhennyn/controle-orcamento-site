
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface BudgetItemsProps {
  items: BudgetItem[];
  setItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
}

const BudgetItems: React.FC<BudgetItemsProps> = ({ items, setItems }) => {
  const addItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const calculateTotal = (item: BudgetItem) => {
    return item.quantity * item.unitPrice;
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + calculateTotal(item), 0);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Itens do Orçamento</CardTitle>
        <Button 
          onClick={addItem}
          className="bg-budget-blue hover:bg-blue-700 text-white"
        >
          Adicionar Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 items-end border-b pb-4">
              <div className="col-span-12 md:col-span-5 space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Descrição do serviço ou produto"
                  className="resize-none"
                  rows={2}
                />
              </div>
              <div className="col-span-4 md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Quantidade</label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                  min="1"
                  step="1"
                />
              </div>
              <div className="col-span-4 md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Preço Unit.</label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-span-2 md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Total</label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-background flex items-center text-sm">
                  R$ {calculateTotal(item).toFixed(2)}
                </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => removeItem(item.id)} 
                  className="h-10 w-10 text-red-500"
                >
                  X
                </Button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum item adicionado. Clique em "Adicionar Item" para começar.
            </div>
          )}

          {items.length > 0 && (
            <div className="flex justify-end pt-4">
              <div className="space-y-2 w-48">
                <div className="text-sm font-medium">Total do Orçamento</div>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-gray-100 flex items-center font-bold text-right">
                  R$ {calculateGrandTotal().toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetItems;
