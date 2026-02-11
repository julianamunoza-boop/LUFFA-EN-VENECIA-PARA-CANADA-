
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessPlan } from "../types";

export const generateLufaBusinessPlan = async (): Promise<BusinessPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Genera un plan de negocios detallado y profesional para el cultivo, transformación y exportación de Lufa (Luffa aegyptiaca) desde América Latina hacia el mercado de Canadá. 
  El mercado canadiense valora la sostenibilidad, los productos eco-friendly y los accesorios de spa de lujo.
  
  Enfócate en productos de alta rentabilidad como:
  1. Esponjas de spa tratadas con aceites esenciales.
  2. Discos exfoliantes faciales de alta calidad.
  3. Filtros industriales biodegradables.
  4. Empaques compostables basados en fibra de lufa.

  El documento debe estar en español y seguir esta estructura:
  - Título del Proyecto
  - Resumen Ejecutivo
  - Análisis del Mercado de Canadá (demanda de productos naturales, regulaciones de importación).
  - Proceso de Producción (cultivo orgánico, cosecha, secado).
  - Transformación y Valor Agregado (diseño de productos premium).
  - Estrategia de Exportación y Logística.
  - Proyecciones Financieras (ROI, márgenes de ganancia).
  - Conclusión.`;

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
          transformationProducts: { type: Type.STRING },
          exportStrategy: { type: Type.STRING },
          financialProjections: { type: Type.STRING },
          conclusion: { type: Type.STRING }
        },
        required: ["title", "executiveSummary", "marketAnalysis", "productionProcess", "transformationProducts", "exportStrategy", "financialProjections", "conclusion"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No se pudo generar el contenido del plan de negocios.");
  }

  return JSON.parse(response.text.trim()) as BusinessPlan;
};
