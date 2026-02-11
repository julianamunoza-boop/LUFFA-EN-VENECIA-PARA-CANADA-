
import React, { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Leaf, 
  FileText, 
  Download, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  TrendingUp,
  Package
} from 'lucide-react';
import { generateLufaBusinessPlan } from './services/geminiService';
import { BusinessPlan, GenerationStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setStatus(GenerationStatus.GENERATING);
      setError(null);
      const generatedPlan = await generateLufaBusinessPlan();
      setPlan(generatedPlan);
      setStatus(GenerationStatus.COMPLETED);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al generar el plan. Por favor, intenta de nuevo.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  const downloadPDF = useCallback(() => {
    if (!plan) return;

    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    let cursorY = 20;

    const addText = (text: string, size: number, isBold: boolean = false) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      
      if (cursorY + (lines.length * 7) > 280) {
        doc.addPage();
        cursorY = 20;
      }
      
      doc.text(lines, margin, cursorY);
      cursorY += (lines.length * 7) + 5;
    };

    // Header
    doc.setFillColor(34, 197, 94); // Green 500
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(plan.title.toUpperCase(), margin, 25);
    doc.setTextColor(0, 0, 0);
    cursorY = 55;

    // Sections
    const sections = [
      { title: "Resumen Ejecutivo", content: plan.executiveSummary },
      { title: "Análisis de Mercado: Canadá", content: plan.marketAnalysis },
      { title: "Proceso de Producción", content: plan.productionProcess },
      { title: "Transformación y Productos de Valor", content: plan.transformationProducts },
      { title: "Estrategia de Exportación", content: plan.exportStrategy },
      { title: "Proyecciones Financieras", content: plan.financialProjections },
      { title: "Conclusión", content: plan.conclusion },
    ];

    sections.forEach(s => {
      addText(s.title, 16, true);
      addText(s.content, 11, false);
      cursorY += 5;
    });

    doc.save(`Proyecto_Exportacion_Lufa_Canada.pdf`);
  }, [plan]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-600 w-8 h-8" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              LufaExport Canada
            </h1>
          </div>
          {status === GenerationStatus.COMPLETED && (
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
            >
              <Download size={18} />
              Descargar PDF
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {status === GenerationStatus.IDLE && (
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="inline-flex p-4 rounded-full bg-green-50 mb-6">
              <Package className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              Lleva la Lufa al Mercado Premium Canadiense
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Genera un plan estratégico completo para cultivar, transformar y exportar productos de lufa de alta gama. 
              Utilizamos Inteligencia Artificial para analizar el mercado de Canadá y optimizar tu rentabilidad.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <Globe className="text-blue-500 mb-3" />
                <h3 className="font-bold text-gray-800">Enfoque Global</h3>
                <p className="text-sm text-gray-500">Regulaciones y logística específica para Norteamérica.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <TrendingUp className="text-green-500 mb-3" />
                <h3 className="font-bold text-gray-800">Alta Rentabilidad</h3>
                <p className="text-sm text-gray-500">Transformación en productos de spa y belleza de lujo.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="text-emerald-500 mb-3" />
                <h3 className="font-bold text-gray-800">100% Sostenible</h3>
                <p className="text-sm text-gray-500">Alineado con las tendencias Eco-Friendly de 2024.</p>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              Comenzar Proyecto
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {status === GenerationStatus.GENERATING && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
              <Leaf className="w-6 h-6 text-green-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="mt-8 text-2xl font-bold text-gray-800">Analizando el mercado...</h3>
            <p className="text-gray-500 mt-2 animate-pulse">
              Redactando el plan de exportación hacia Toronto, Vancouver y Montreal.
            </p>
          </div>
        )}

        {status === GenerationStatus.ERROR && (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 p-6 rounded-xl text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={handleGenerate}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {status === GenerationStatus.COMPLETED && plan && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-green-600 w-8 h-8" />
                <h2 className="text-3xl font-bold text-gray-900">{plan.title}</h2>
              </div>
              
              <div className="grid gap-12 text-gray-700">
                <section>
                  <h3 className="text-xl font-bold text-green-800 mb-3 border-b pb-2">1. Resumen Ejecutivo</h3>
                  <p className="leading-relaxed whitespace-pre-wrap">{plan.executiveSummary}</p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-green-800 mb-3 border-b pb-2">2. Análisis de Mercado (Canadá)</h3>
                  <p className="leading-relaxed whitespace-pre-wrap">{plan.marketAnalysis}</p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-green-800 mb-3 border-b pb-2">3. Producción y Transformación</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Proceso Agrícola</h4>
                      <p className="text-sm">{plan.productionProcess}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Valor Agregado</h4>
                      <p className="text-sm">{plan.transformationProducts}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-green-800 mb-3 border-b pb-2">4. Estrategia Logística y Financiera</h3>
                  <p className="leading-relaxed whitespace-pre-wrap mb-4">{plan.exportStrategy}</p>
                  <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                    <h4 className="flex items-center gap-2 font-bold text-green-900 mb-3">
                      <TrendingUp size={20} />
                      Proyecciones de Rentabilidad
                    </h4>
                    <p className="text-green-800 italic">{plan.financialProjections}</p>
                  </div>
                </section>

                <section className="bg-gray-900 text-white p-8 rounded-2xl">
                  <h3 className="text-xl font-bold mb-3">Conclusión Estratégica</h3>
                  <p className="opacity-90 leading-relaxed">{plan.conclusion}</p>
                </section>
              </div>
            </div>

            <div className="flex justify-center pb-12">
               <button
                  onClick={downloadPDF}
                  className="flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl"
                >
                  <Download size={24} />
                  Descargar Documento Completo (PDF)
                </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 LufaExport AI. Todos los derechos reservados.</p>
          <p className="mt-2">Basado en datos de comercio exterior Canadá - América Latina.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
