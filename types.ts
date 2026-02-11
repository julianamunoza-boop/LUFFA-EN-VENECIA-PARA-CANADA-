
export interface ProjectSection {
  title: string;
  content: string;
}

export interface BusinessPlan {
  title: string;
  executiveSummary: string;
  marketAnalysis: string;
  productionProcess: string;
  transformationProducts: string;
  exportStrategy: string;
  financialProjections: string;
  conclusion: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
