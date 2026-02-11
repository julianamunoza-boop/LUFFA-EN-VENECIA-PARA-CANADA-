
export interface FlowStep {
  step: number;
  activity: string;
  description: string;
}

export interface CostItem {
  concept: string;
  unit: string;
  estimatedCost: string;
}

export interface TimelinePhase {
  period: string;
  phase: string;
  milestones: string;
}

export interface BusinessPlan {
  title: string;
  executiveSummary: string;
  marketAnalysis: string;
  productionProcess: string;
  productSpecifications: string; // Enfoque en ergonomía y seguridad
  exportStrategy: string;
  flowchart: FlowStep[];
  costAnalysis: CostItem[];
  timeline: TimelinePhase[];
  financialProjections: string;
  conclusion: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
