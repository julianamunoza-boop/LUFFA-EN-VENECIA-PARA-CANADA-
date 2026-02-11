
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessPlan } from "../types";

export const generateLufaBusinessPlan = async (): Promise<BusinessPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Genera un plan de negocios técnico y financiero para el cultivo y exportación de Lufa hacia Canadá, centrado en productos de ALTA GAMA para el sector Salud/Wellness y Adultos Mayores.

  REQUERIMIENTOS ESPECÍFICOS:
  1. PRODUCTOS: Chanclas de lufa ergonómicas con estándares de descanso y seguridad anti-caídas (suela antideslizante, soporte de arco) para personas con discapacidad o adultos mayores. Además, sets de SPA premium.
  2. FLUJOGRAMA: Pasos exactos desde cultivo -> cosecha -> transformación (diseño ergonómico) -> control de calidad -> empaque -> exportación.
  3. SISTEMA DE COSTOS: Lista detallada de costos estimados de producción, transformación y logística.
  4. CRONOLOGÍA: Proyección en tiempo real desde la siembra hasta la entrega final al cliente en Canadá.

  ESTRUCTURA JSON REQUERIDA:
  {
    "title": "Nombre profesional del proyecto",
    "executiveSummary": "Resumen ejecutivo",
    "marketAnalysis": "Análisis mercado Canadá",
    "productionProcess": "Detalles del cultivo orgánico",
    "productSpecifications": "Detalle técnico de las chanclas ergonómicas y productos de SPA",
    "exportStrategy": "Logística y aranceles",
    "flowchart": [{"step": 1, "activity": "Actividad", "description": "Detalle"}],
    "costAnalysis": [{"concept": "Concepto", "unit": "Unidad", "estimatedCost": "Precio USD"}],
    "timeline": [{"period": "Mes X", "phase": "Fase", "milestones": "Hitos"}],
    "financialProjections": "Análisis de rentabilidad",
    "conclusion": "Conclusión"
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          executiveSummary: { type: Type.STRING },
          marketAnalysis: { type: Type.STRING },
          productionProcess: { type: Type.STRING },
          productSpecifications: { type: Type.STRING },
          exportStrategy: { type: Type.STRING },
          flowchart: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.NUMBER },
                activity: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          costAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                concept: { type: Type.STRING },
                unit: { type: Type.STRING },
                estimatedCost: { type: Type.STRING }
              }
            }
          },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                period: { type: Type.STRING },
                phase: { type: Type.STRING },
                milestones: { type: Type.STRING }
              }
            }
          },
          financialProjections: { type: Type.STRING },
          conclusion: { type: Type.STRING }
        },
        required: ["title", "executiveSummary", "flowchart", "costAnalysis", "timeline", "productSpecifications"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Error en la respuesta de la IA.");
  }

  return JSON.parse(response.text.trim()) as BusinessPlan;
};
