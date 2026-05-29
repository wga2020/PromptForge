'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Wand2, Download, Maximize, PaintBucket, Camera, Info, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  mode: string;
  createdAt: Date;
}

export function ImageStudioView() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Error', description: 'Por favor, ingresa un prompt maestro para generar la imagen.', variant: 'destructive' });
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: 'vector' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en el servidor de imágenes');
      
      const newImg: GeneratedImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        prompt: prompt,
        mode: 'vector',
        createdAt: new Date(),
      };

      setCurrentImage(newImg);
      setHistory(prev => [newImg, ...prev]);
      toast({ title: '¡Éxito!', description: 'Imagen generada correctamente.' });
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Error', description: error.message || 'No se pudo generar la imagen.', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateSpecific = async (specificPrompt: string) => {
    if (!specificPrompt) return;
    setPrompt(specificPrompt); // Update text box as well
    setGenerating(true);

    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: specificPrompt, mode: 'vector' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en el servidor de imágenes');
      
      const newImg: GeneratedImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        prompt: specificPrompt,
        mode: 'vector',
        createdAt: new Date(),
      };

      setCurrentImage(newImg);
      setHistory(prev => [newImg, ...prev]);
      toast({ title: '¡Éxito!', description: 'Nueva versión generada correctamente.' });
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Error', description: error.message || 'No se pudo generar la imagen.', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const deleteImage = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(img => img.id !== id));
    if (currentImage?.id === id) {
      setCurrentImage(null);
    }
  };

  const handleDownload = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    downloadImage(url);
  };

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `promptforge-vector-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo descargar la imagen.', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-indigo-600" /> Image Studio
          </h2>
          <p className="text-muted-foreground mt-1">Genera arte digital comercial de alta calidad directamente desde tus Prompts Maestros.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">Configuración de Generación</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">

              {/* Prompt Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">1. Ingresa tu Prompt Maestro</label>
                <textarea 
                  className="w-full h-40 p-4 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm font-mono"
                  placeholder="Pega aquí tu prompt (Ej: Create a high-quality commercial Print-on-Demand design...)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleGenerate} 
                  disabled={generating || !prompt.trim()}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-md font-bold text-white"
                >
                  {generating ? (
                    <span className="flex items-center gap-2"><Wand2 className="w-5 h-5 animate-pulse" /> Sintetizando Píxeles...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Wand2 className="w-5 h-5" /> Generar Imagen</span>
                  )}
                </Button>
                
                <Button 
                  onClick={() => {
                    setPrompt('');
                    setCurrentImage(null);
                  }} 
                  variant="outline"
                  disabled={generating || (!prompt && !currentImage)}
                  className="w-full h-12 text-md font-bold text-muted-foreground hover:text-foreground border-border"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Nueva Imagen (Limpiar)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Result Canvas */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <Card className="flex-1 border-border bg-muted/20 overflow-hidden flex flex-col relative min-h-[500px]">
            {currentImage ? (
              <>
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="secondary" size="icon" className="bg-card/90 backdrop-blur-sm hover:bg-card text-indigo-600 dark:text-indigo-400 border-border" onClick={() => handleRegenerateSpecific(currentImage.prompt)}>
                          <RefreshCw className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Regenerar con el mismo prompt</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="secondary" size="icon" className="bg-card/90 backdrop-blur-sm hover:bg-card text-foreground" onClick={() => downloadImage(currentImage.url)}>
                    <Download className="w-5 h-5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="bg-card/80 backdrop-blur-sm hover:bg-card text-foreground" onClick={() => window.open(currentImage.url, '_blank')}>
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={currentImage.url} 
                  alt="Generado" 
                  className="w-full h-full object-contain p-4 animate-in fade-in duration-700"
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center h-full">
                {generating ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-semibold text-foreground">Creando arte con IA...</p>
                    <p className="text-xs text-muted-foreground mt-2">Aplicando filtros de diseño plano y trazados</p>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-20 h-20 text-muted-foreground/55 mb-4" />
                    <h3 className="text-xl font-medium text-foreground">Lienzo en Blanco</h3>
                    <p className="text-sm mt-2 max-w-sm">Pega un Prompt Maestro en el panel izquierdo para comenzar a crear Arte Digital espectacular.</p>
                  </>
                )}
              </div>
            )}
          </Card>

          {/* History Strip */}
          {history.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Generaciones Recientes</h4>
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {history.map((img, idx) => (
                  <div 
                    key={img.id} 
                    className={`relative group shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${currentImage?.id === img.id ? 'border-indigo-500' : 'border-transparent hover:border-border'}`}
                    onClick={() => setCurrentImage(img)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={`Historial ${idx}`} className="w-full h-full object-cover" />
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button 
                        onClick={(e) => handleDownload(e, img.url)}
                        className="p-1.5 bg-white/90 hover:bg-white rounded-md text-gray-700 transition-colors"
                        title="Descargar"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => deleteImage(e, img.id)}
                        className="p-1.5 bg-red-500/90 hover:bg-red-500 rounded-md text-white transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
