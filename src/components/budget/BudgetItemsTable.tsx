
import React from "react";
import { BudgetItem } from "../BudgetItems";

interface BudgetItemsTableProps {
  items: BudgetItem[];
}

const BudgetItemsTable: React.FC<BudgetItemsTableProps> = ({ items }) => {
  const calculateTotal = (item: BudgetItem) => {
    return item.quantity * item.unitPrice;
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + calculateTotal(item), 0);
  };

  return (
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
  );
};

export default BudgetItemsTable;
