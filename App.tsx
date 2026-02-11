
import React, { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Leaf, 
  Download, 
  Loader2, 
  ArrowRight,
  Globe,
  TrendingUp,
  Package,
  Calendar,
  Layers,
  ShieldCheck,
  DollarSign,
  Activity,
  CheckCircle,
  FileText
} from 'lucide-react';
import { generateLufaBusinessPlan } from './services/geminiService.ts';
import { BusinessPlan, GenerationStatus } from './types.ts';

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
      setError("No se pudo conectar con el servicio de IA. Verifique su conexión.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  const downloadPDF = useCallback(() => {
    if (!plan) return;

    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    let cursorY = 20;

    const addText = (text: string, size: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      
      if (cursorY + (lines.length * 7) > 280) {
        doc.addPage();
        cursorY = 20;
      }
      
      doc.text(lines, margin, cursorY);
      cursorY += (lines.length * 7) + 5;
    };

    // Header PDF Pro
    doc.setFillColor(15, 23, 42); // Navy Dark
    doc.rect(0, 0, pageWidth, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("LUFA EXPORT MASTER PLAN", margin, 25);
    doc.setFontSize(12);
    doc.text(plan.title, margin, 35);
    cursorY = 55;

    const sections = [
      { title: "RESUMEN EJECUTIVO", content: plan.executiveSummary },
      { title: "MERCADO CANADIENSE", content: plan.marketAnalysis },
      { title: "ESPECIFICACIONES PRODUCTO (SENIOR CARE)", content: plan.productSpecifications },
      { title: "PROYECCIONES FINANCIERAS", content: plan.financialProjections },
    ];

    sections.forEach(s => {
      addText(s.title, 14, true, [16, 185, 129]);
      addText(s.content, 10, false, [51, 65, 85]);
      cursorY += 5;
    });

    addText("ANÁLISIS DE COSTOS", 14, true, [16, 185, 129]);
    plan.costAnalysis.forEach(c => {
      addText(`• ${c.concept}: ${c.estimatedCost}`, 9, false, [71, 85, 105]);
    });

    doc.save(`Lufa_Export_Plan_${new Date().toLocaleDateString()}.pdf`);
  }, [plan]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar Superior */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg shadow-sm">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-32 bg-emerald-600 rounded-sm"></div>
            </div>
          </div>
          {status === GenerationStatus.COMPLETED && (
            <button 
              onClick={downloadPDF} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md text-sm"
            >
              <Download size={16} /> Descargar PDF
            </button>
          )}
        </div>
      </nav>

      <main className="flex-grow">
        {status === GenerationStatus.IDLE && (
          <div className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
            <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Proyecto Lufa: <span className="text-emerald-600">Cultivo y Transformación</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Diseñamos el plan técnico para la exportación de productos de lufa de alta gama hacia el mercado canadiense.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
               <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <Package className="text-emerald-600 mb-4 w-10 h-10" />
                  <h3 className="font-bold text-lg mb-2">Transformación Premium</h3>
                  <p className="text-sm text-slate-500">Chanclas ergonómicas y sets de SPA de lujo.</p>
               </div>
               <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <Globe className="text-blue-600 mb-4 w-10 h-10" />
                  <h3 className="font-bold text-lg mb-2">Canales de Exportación</h3>
                  <p className="text-sm text-slate-500">Logística directa hacia Ontario, Quebec y BC.</p>
               </div>
               <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <ShieldCheck className="text-amber-600 mb-4 w-10 h-10" />
                  <h3 className="font-bold text-lg mb-2">Senior Care Standard</h3>
                  <p className="text-sm text-slate-500">Seguridad certificada para el adulto mayor.</p>
               </div>
            </div>
            <button 
              onClick={handleGenerate}
              className="bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 shadow-xl flex items-center gap-3 mx-auto"
            >
              Iniciar Generación de Plan
              <ArrowRight />
            </button>
          </div>
        )}

        {status === GenerationStatus.GENERATING && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative mb-8">
              <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Generando Plan Maestro...</h2>
            <p className="text-slate-500 mt-2">Calculando aranceles, logística y flujogramas técnicos.</p>
          </div>
        )}

        {status === GenerationStatus.ERROR && (
          <div className="max-w-md mx-auto mt-20 p-8 bg-red-50 border border-red-200 rounded-3xl text-center">
            <p className="text-red-700 font-bold mb-4">{error}</p>
            <button onClick={handleGenerate} className="bg-red-600 text-white px-6 py-2 rounded-full font-bold">Reintentar</button>
          </div>
        )}

        {status === GenerationStatus.COMPLETED && plan && (
          <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cabecera del Plan */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
                  <CheckCircle size={12}/> Proyecto Verificado
                </div>
                <h1 className="text-4xl font-black text-slate-900">{plan.title}</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Estado</p>
                  <p className="text-sm font-bold text-emerald-600">Plan de Exportación Listo</p>
                </div>
              </div>
            </div>

            {/* Dashboard de Datos */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="space-y-8">
                <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-lg">
                  <h3 className="flex items-center gap-2 text-xl font-bold mb-8 text-emerald-400">
                    <Layers size={20} /> Flujograma Operativo
                  </h3>
                  <div className="space-y-6">
                    {plan.flowchart.map((step, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-xs text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            {step.step}
                          </div>
                          {idx < plan.flowchart.length - 1 && (
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-slate-800"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 text-sm">{step.activity}</p>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="flex items-center gap-2 text-xl font-bold mb-6 text-slate-800">
                    <DollarSign className="text-emerald-500" size={20}/> Análisis de Inversión
                  </h3>
                  <div className="space-y-4">
                    {plan.costAnalysis.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-500 font-medium">{item.concept}</span>
                        <span className="text-sm font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{item.estimatedCost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <FileText className="text-emerald-600" /> Detalle Estratégico
                  </h3>
                  
                  <div className="space-y-10">
                    <section>
                      <h4 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-4 mb-3 uppercase tracking-wide">Resumen Ejecutivo</h4>
                      <p className="text-slate-600 leading-relaxed">{plan.executiveSummary}</p>
                    </section>

                    <section className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                      <h4 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-600" /> Especialidad: Senior Care & Ergonomía
                      </h4>
                      <p className="text-emerald-800/80 leading-relaxed text-sm whitespace-pre-wrap">{plan.productSpecifications}</p>
                    </section>

                    <section>
                      <h4 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-4 mb-6 uppercase tracking-wide">Cronograma de Ejecución</h4>
                      <div className="space-y-3">
                        {plan.timeline.map((t, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all group">
                            <div className="w-20 font-black text-emerald-600 text-xs group-hover:scale-110 transition-transform">{t.period}</div>
                            <div className="flex-grow">
                              <p className="font-bold text-sm text-slate-900">{t.phase}</p>
                              <p className="text-xs text-slate-500 italic">{t.milestones}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="conclusion-card p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
                       <h4 className="text-2xl font-bold text-white mb-6">Conclusión Estratégica</h4>
                       <p className="text-slate-300 leading-relaxed">
                          {plan.conclusion}
                       </p>
                    </section>

                    <div className="flex justify-center pt-4">
                      <button 
                        onClick={downloadPDF}
                        className="bg-[#0f172a] hover:bg-black text-white px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl"
                      >
                        <Download size={22} /> Descargar Documento Completo (PDF)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm font-medium">
            © 2024 LufaExport AI. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
