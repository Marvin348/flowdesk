import type { DashboardAttentionRequiredDto } from "@shared/types/dto/dashboard/dashboardAttentionRequired.dto";
import { AlertCircle } from "lucide-react";
import AttentionRequiredCard from "@/features/dashboard/components/attentionRequired/AttentionRequiredCard";
import { ATTENTION_REQUIRED_CONFIG } from "@/features/dashboard/constants/AttentionRequiredConfig";
import DashboardCardHeader from "@/features/dashboard/components/DashboardCardHeader";

type AttentionRequiredProps = {
  attentionRequired: DashboardAttentionRequiredDto;
};

const AttentionRequired = ({ attentionRequired }: AttentionRequiredProps) => {
  const items = [
    {
      item: attentionRequired.mostOverdueProject,
      config: ATTENTION_REQUIRED_CONFIG.most_overdue,
    },
    {
      item: attentionRequired.deadlineRisk,
      config: ATTENTION_REQUIRED_CONFIG.deadline_risk,
    },
    {
      item: attentionRequired.lowProgressRisk,
      config: ATTENTION_REQUIRED_CONFIG.low_progress_risk,
    },
  ];

  return (
    <section className="flex h-full flex-col rounded-md border bg-card p-4">
      <DashboardCardHeader
        eyebrow="Kontrolle"
        title="Handlungsbedarf"
        icon={<AlertCircle className="size-5" />}
      />

      <div className="grid grid-cols-1 gap-6">
        {items.map(({ item, config }) => (
          <AttentionRequiredCard
            key={config.label}
            item={item}
            config={config}
          />
        ))}
      </div>
    </section>
  );
};
export default AttentionRequired;
