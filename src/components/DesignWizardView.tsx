'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PRODUCT_CATEGORIES, DESIGN_STYLES, ProductDef, DesignStyle, Palette } from '@/lib/designData';
import { PRODUCT_PROMPT_CONFIG, selectChromaColor } from '@/lib/data';
import { ArrowRight, ArrowLeft, Wand2, CheckCircle2, Paintbrush, Info, Save } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

export function DesignWizardView({ aiEngine }: { aiEngine: 'gemini' | 'zai' }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  // Selections
  const [selectedProduct, setSelectedProduct] = useState<ProductDef | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);
  const [niche, setNiche] = useState('');
  
  // Results
  const [generating, setGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  
  // Save States
  const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('new');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [promptTitle, setPromptTitle] = useState<string>('');
  const [savingPrompt, setSavingPrompt] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) { console.error(err); }
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  // --- STEP 1: Select Product ---
  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground">1. ¿Qué vas a diseñar hoy?</h3>
        <p className="text-muted-foreground">Elige el tipo de producto. Esto ayudará a la IA a definir las proporciones y la vibra del arte.</p>
      </div>

      <div className="space-y-8">
        {PRODUCT_CATEGORIES.map(category => (
          <div key={category.id} className="space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="text-xl">{category.icon}</span>
              <h4 className="font-semibold text-foreground">{category.name}</h4>
              <span className="text-xs text-muted-foreground ml-2 hidden md:inline">- {category.description}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {category.products.map(product => (
                <button
                  key={product.id}
                  onClick={() => { setSelectedProduct(product); setSelectedStyle(null); setSelectedPalette(null); handleNext(); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                    selectedProduct?.id === product.id 
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-500/10 shadow-sm' 
                      : 'border-border hover:border-indigo-300 bg-card'
                  }`}
                >
                  <div className="text-3xl mb-2">{product.icon}</div>
                  <div className="font-medium text-foreground">{product.name}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- STEP 2: Select Style ---
  const renderStep2 = () => {
    if (!selectedProduct) return null;
    
    // Get recommended styles objects
    const recommended = selectedProduct.recommendedStyles
      .map(styleId => DESIGN_STYLES[styleId])
      .filter(Boolean);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            2. Dirección de Arte <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-1 rounded-full font-normal">Para {selectedProduct.name} {selectedProduct.icon}</span>
          </h3>
          <p className="text-muted-foreground">Hemos filtrado los estilos que estadísticamente mejor convierten para este producto.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended.map(style => (
            <Card 
              key={style.id} 
              className={`cursor-pointer transition-all border-2 ${selectedStyle?.id === style.id ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-500/5 ring-2 ring-indigo-500/20' : 'border-border hover:border-indigo-300'}`}
              onClick={() => { setSelectedStyle(style); setSelectedPalette(null); }}
            >
              <CardContent className="p-5 relative h-full flex flex-col">
                {/* Selection Badge */}
                {selectedStyle?.id === style.id && (
                  <div className="absolute top-3 right-3 text-indigo-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-foreground pr-6">{style.name}</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground hover:text-indigo-500 z-10" onClick={(e) => e.stopPropagation()}>
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-sm">
                        <p>{style.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <p className="text-xs text-muted-foreground mb-4 flex-1">{style.description}</p>
                
                <div className="mt-auto bg-muted/50 p-2 rounded-lg border border-border">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Nichos Recomendados:</span>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{style.recommendedNiches}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between pt-6 border-t border-border mt-8">
          <Button variant="outline" onClick={handleBack}><ArrowLeft className="w-4 h-4 mr-2" /> Volver</Button>
          <Button 
            onClick={handleNext} 
            disabled={!selectedStyle}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Siguiente Paso <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // --- STEP 3: Palette & Prompt ---
  const renderStep3 = () => {
    if (!selectedStyle) return null;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground">3. Toque Final: Paleta y Nicho</h3>
          <p className="text-muted-foreground">Cierra tu idea para que la IA arme el Prompt Maestro.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Palettes */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2"><Paintbrush className="w-4 h-4" /> Paletas de Color para "{selectedStyle.name}"</h4>
            <div className="space-y-3">
              {selectedStyle.palettes.map(palette => (
                <div 
                  key={palette.name}
                  onClick={() => setSelectedPalette(palette)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPalette?.name === palette.name ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-500/10' : 'border-border hover:border-gray-300'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-sm text-foreground">{palette.name}</span>
                    {selectedPalette?.name === palette.name && <CheckCircle2 className="h-4 w-4 text-indigo-500" />}
                  </div>
                  <div className="flex gap-2 h-10 w-full rounded-lg overflow-hidden border border-border shadow-sm">
                    {palette.colors.map(color => (
                      <div 
                        key={color.name} 
                        className="flex-1 h-full group relative"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold transition-opacity">
                          {color.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Niche and Summary */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-semibold text-foreground text-sm">¿Cuál es el nicho o temática de tu diseño?</label>
              <Input 
                placeholder="Ej. Club de Lectura de los Sábados" 
                value={niche}
                onChange={e => setNiche(e.target.value)}
                className="h-12 border-border focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="text-xs text-muted-foreground">Te sugerimos: {selectedStyle.recommendedNiches}</p>
            </div>

            <Card className="bg-muted/30 border-border shadow-inner">
              <CardContent className="p-4 space-y-3">
                <h5 className="font-bold text-foreground text-sm border-b border-border pb-2">Resumen de Instrucción</h5>
                <div className="text-sm space-y-2">
                  <p><span className="text-muted-foreground">Producto:</span> <span className="font-semibold">{selectedProduct?.name}</span></p>
                  <p><span className="text-muted-foreground">Estilo:</span> <span className="font-semibold">{selectedStyle?.name}</span></p>
                  <p><span className="text-muted-foreground">Paleta:</span> <span className="font-semibold">{selectedPalette?.name || '(Selecciona una)'}</span></p>
                  <p><span className="text-muted-foreground">Nicho:</span> <span className="font-semibold italic">{niche || '(Escribe tu nicho)'}</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-border mt-8">
          <Button variant="outline" onClick={handleBack}><ArrowLeft className="w-4 h-4 mr-2" /> Volver</Button>
          <Button 
            onClick={() => handleGeneratePrompt()} 
            disabled={!selectedPalette || !niche || generating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            {generating ? 'Construyendo...' : '🪄 Crear Prompt Maestro'}
          </Button>
        </div>
      </div>
    );
  };

  const handleGeneratePrompt = async () => {
    setGenerating(true);
    // Simulating API generation logic for now to construct the massive prompt
    setTimeout(() => {
      const paletteDetails = selectedPalette?.colors.map(c => `${c.name} (${c.hex})`).join(', ');
      
      const config = PRODUCT_PROMPT_CONFIG[selectedProduct?.promptName || "T-Shirt"] || PRODUCT_PROMPT_CONFIG["T-Shirt"];
      const paletteHexes = selectedPalette?.colors.map(c => c.hex) || [];
      const chromaColor = config.chromaColor.includes("{chromaColor}") 
        ? selectChromaColor(paletteHexes)
        : config.chromaColor;
      const backgroundSpec = config.backgroundSpec.replace("{chromaColor}", chromaColor);

      const prompt = `Create a high-quality FLAT 2D Print-on-Demand graphic design intended to be printed on a ${selectedProduct?.promptName || selectedProduct?.name}.

CRITICAL MANDATORY RULE: You must generate ONLY the flat 2D artwork itself. DO NOT generate a mockup. DO NOT draw the physical ${selectedProduct?.promptName || selectedProduct?.name} or garment. DO NOT include any 3D product renders, people wearing the product, or physical context. This is a flat graphic design file.

STYLE INSTRUCTIONS:
Focus purely on the "${selectedStyle?.name}" aesthetic.
Description: ${selectedStyle?.description}
Ensure the design does not look generic. It must look human-made, deliberate, and fitting for 2026 POD trends.

THEME / NICHE:
"${niche}"

COLOR PALETTE STRICT LIMITATIONS:
You must STRICTLY adhere to this color palette: ${paletteDetails}.
Do not use any other colors outside of this requested palette. Ensure the design relies heavily on this specific mood.

FORMATTING:
Composition: ${config.compositionSpec}
Background: ${backgroundSpec}
Quality: ${config.qualityMarkers}

NEGATIVE PROMPT / RESTRICTIONS:
DO NOT include color swatches, color codes, or palette boxes in the image.
DO NOT write the names of the colors, fonts, or styles as text in the image.
DO NOT draw the physical product, clothing, mugs, or human models.
GENERATE ONLY THE FLAT 2D GRAPHIC DESIGN itself, with no UI elements, legends, mockups or explanatory text.`;
      
      const finalPrompt = `${prompt}\n\nREQUIRED ASPECT RATIO: ${config.aspectRatio}.\n--ar ${config.aspectRatio}`;
      
      setGeneratedPrompt(finalPrompt);
      setGenerating(false);
      setStep(4);
    }, 1500);
  };

  const handleSavePrompt = async () => {
    if (!promptTitle) {
      toast({ title: 'Error', description: 'Por favor, ingresa un título para el prompt.', variant: 'destructive' });
      return;
    }
    
    setSavingPrompt(true);
    let targetProjectId = selectedProjectId;

    try {
      // Create new project if selected
      if (selectedProjectId === 'new') {
        if (!newProjectName) {
          toast({ title: 'Error', description: 'Por favor, ingresa un nombre para el nuevo proyecto.', variant: 'destructive' });
          setSavingPrompt(false);
          return;
        }
        
        const projRes = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newProjectName, niche: niche })
        });
        
        if (projRes.ok) {
          const newProj = await projRes.json();
          targetProjectId = newProj.id;
          setProjects([...projects, newProj]);
          setSelectedProjectId(targetProjectId);
        } else {
          throw new Error('Error al crear proyecto');
        }
      }

      // Save Prompt
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: promptTitle,
          content: generatedPrompt,
          product: selectedProduct?.name || '',
          niche: niche,
          theme: selectedStyle?.name || '',
          colorPalette: JSON.stringify(selectedPalette?.colors || []),
          style: selectedStyle?.name || '',
          aiTool: aiEngine,
          projectId: targetProjectId,
        }),
      });

      if (res.ok) {
        toast({ title: 'Éxito', description: 'Prompt guardado correctamente en tu proyecto.' });
        setPromptTitle('');
      } else {
        throw new Error('Error al guardar prompt');
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Ocurrió un error al guardar.', variant: 'destructive' });
    } finally {
      setSavingPrompt(false);
    }
  };

  // --- STEP 4: Result ---
  const renderStep4 = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">¡Tu Prompt Maestro está listo!</h3>
        <p className="text-muted-foreground">Copia este texto y úsalo en Midjourney, DALL-E 3 o Ideogram para obtener tu diseño perfecto.</p>
      </div>

      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="p-6 relative">
          <textarea 
            readOnly
            className="w-full h-64 p-4 bg-background border border-border rounded-xl text-sm font-mono text-foreground focus:ring-emerald-500 focus:border-emerald-500"
            value={generatedPrompt}
          />
          <Button 
            className="absolute top-8 right-8 bg-green-600 hover:bg-green-700"
            onClick={() => { navigator.clipboard.writeText(generatedPrompt); toast({ title: '¡Copiado!', description: 'Prompt copiado al portapapeles' }); }}
          >
            Copiar Prompt
          </Button>
        </CardContent>
      </Card>

      {/* Panel para Guardar Prompt */}
      <Card className="mt-8 border-border bg-card shadow-sm">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <Save className="h-5 w-5 text-indigo-500" /> Guardar en tus Proyectos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Título del Prompt</label>
              <Input 
                placeholder="Ej. Taza Gatos Kawaii"
                value={promptTitle}
                onChange={e => setPromptTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Seleccionar Proyecto</label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
              >
                <option value="new">+ Crear Nuevo Proyecto</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {selectedProjectId === 'new' && (
            <div className="space-y-2 pt-2">
              <label className="text-sm font-semibold text-foreground">Nombre del Nuevo Proyecto</label>
              <Input 
                placeholder="Ej. Colección Alienígenas"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
              />
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button 
              onClick={handleSavePrompt} 
              disabled={savingPrompt || !promptTitle || (selectedProjectId === 'new' && !newProjectName)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {savingPrompt ? 'Guardando...' : 'Guardar Prompt'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-6">
        <Button variant="outline" onClick={() => { setStep(1); setSelectedProduct(null); setSelectedStyle(null); setSelectedPalette(null); setNiche(''); setGeneratedPrompt(''); }}>
          Crear otro diseño
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="mb-10 max-w-md mx-auto">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 dark:bg-indigo-400 transition-all duration-500 z-0" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= num ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-muted text-muted-foreground'
            }`}>
              {num === 4 && step === 4 ? <CheckCircle2 className="w-4 h-4" /> : num}
            </div>
          ))}
        </div>
      </div>

      {/* Render Current Step */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
}
