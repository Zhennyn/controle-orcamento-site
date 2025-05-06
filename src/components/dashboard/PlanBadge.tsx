
import React from "react";

interface PlanBadgeProps {
  isFree: boolean;
}

const PlanBadge: React.FC<PlanBadgeProps> = ({ isFree }) => {
  if (!isFree) {
    return null;
  }

  return (
    <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-md text-sm">
      Plano Gratuito - PDFs incluem marca d'água
    </div>
  );
};

export default PlanBadge;
