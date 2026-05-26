'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Star, RotateCcw, Type, MessageSquare, Hash, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NICHE_TEXT_EXAMPLES, COLOR_PALETTES_META } from '@/lib/data';

// ============================================================
// PRODUCT LENGTH HINTS
// ============================================================
const PRODUCT_LENGTH_HINT: Record<string, { max: number; ideal: number }> = {
  'T-Shirt': { max: 25, ideal: 15 },
  'Hoodie': { max: 30, ideal: 20 },
  'Sticker': { max: 12, ideal: 8 },
  'Pin/Badge': { max: 8, ideal: 5 },
  'Cap/Gorra': { max: 12, ideal: 8 },
  'Mug/Taza': { max: 45, ideal: 25 },
  'Tote Bag': { max: 35, ideal: 20 },
  'Poster/Lámina': { max: 80, ideal: 40 },
  'Notebook/Agenda': { max: 40, ideal: 20 },
  'Phone Case': { max: 20, ideal: 12 },
  'Blanket/Manta': { max: 50, ideal: 25 },
  'Cushion/Cojín': { max: 40, ideal: 20 },
  'Mousepad': { max: 25, ideal: 15 },
  'Card/Invitación': { max: 60, ideal: 30 },
  'Cover Ebook': { max: 50, ideal: 25 },
};

function getLengthStatus(text: string, product: string): {
  status: 'ideal' | 'ok' | 'long' | 'empty';
  label: string;
  color: string;
} {
  const len = text.length;
  const hint = PRODUCT_LENGTH_HINT[product] || { max: 30, ideal: 15 };
  if (len === 0) return { status: 'empty', label: 'Vacío', color: 'text-gray-400' };
  if (len <= hint.ideal) return { status: 'ideal', label: `✓ Ideal para ${product}`, color: 'text-emerald-600' };
  if (len <= hint.max) return { status: 'ok', label: `⚠ Largo, pero funciona`, color: 'text-amber-600' };
  return { status: 'long', label: `✗ Muy largo para ${product}`, color: 'text-red-500' };
}

// ============================================================
// TEXT SUGGESTION CHIP
// ============================================================
function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-400 text-xs font-semibold text-indigo-700 transition-all duration-150 hover:shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      {text}
    </button>
  );
}

// ============================================================
// TYPES
// ============================================================
interface TextInputsStepProps {
  product: string;
  niche: string;
  style: string;
  palette: string;
  primaryText: string;
  secondaryText: string;
  accentText: string;
  aiEngine: 'gemini' | 'zai';
  onPrimaryChange: (v: string) => void;
  onSecondaryChange: (v: string) => void;
  onAccentChange: (v: string) => void;
}

// ============================================================
// FONT PREVIEW MINI
// ============================================================
function FontPreview({ text, fontName }: { text: string; fontName: string }) {
  if (!text) return null;
  return (
    <div className="mt-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
      <p className="text-[10px] text-gray-400 font-medium mb-0.5">Preview · {fontName}</p>
      <p
        className="text-sm font-bold text-gray-800 truncate"
        style={{ fontFamily: `'${fontName}', sans-serif` }}
      >
        {text}
      </p>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function TextInputsStep({
  product,
  niche,
  style,
  palette,
  primaryText,
  secondaryText,
  accentText,
  aiEngine,
  onPrimaryChange,
  onSecondaryChange,
  onAccentChange,
}: TextInputsStepProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [secondarySuggestions, setSecondarySuggestions] = useState<string[]>([]);
  const [accentSuggestions, setAccentSuggestions] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiLoaded, setAiLoaded] = useState(false);
  const hasCalledAI = useRef(false);

  const fallback = NICHE_TEXT_EXAMPLES[niche] || NICHE_TEXT_EXAMPLES['Motivacional'];
  const paletteColors = palette ? COLOR_PALETTES_META[palette]?.colors || [] : [];

  // Show fallback immediately
  useEffect(() => {
    setSuggestions(fallback.primary.slice(0, 6));
    setSecondarySuggestions(fallback.secondary);
    setAccentSuggestions(fallback.accent);
    setAiLoaded(false);
    hasCalledAI.current = false;
  }, [niche]);

  // Then fetch AI suggestions in the background
  useEffect(() => {
    if (!product || !niche || hasCalledAI.current) return;
    hasCalledAI.current = true;

    const fetchSuggestions = async () => {
      setLoadingAI(true);
      try {
        const res = await fetch('/api/suggest-texts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product, niche, style, aiEngine }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.suggestions?.length) {
            setSuggestions(data.suggestions);
            setAiLoaded(true);
          }
        }
      } catch (err) {
        console.warn('AI suggestions failed, keeping fallback');
      } finally {
        setLoadingAI(false);
      }
    };

    fetchSuggestions();
  }, [product, niche, style, aiEngine]);

  const handleRefreshAI = async () => {
    setLoadingAI(true);
    hasCalledAI.current = false;
    setSuggestions(fallback.primary.slice(0, 6));
    setAiLoaded(false);
    try {
      const res = await fetch('/api/suggest-texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, niche, style, aiEngine }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.suggestions?.length) {
          setSuggestions(data.suggestions);
          setAiLoaded(true);
        }
      }
    } catch {
      /* keep fallback */
    } finally {
      setLoadingAI(false);
    }
  };

  const primaryStatus = getLengthStatus(primaryText, product);

  return (
    <TooltipProvider>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main inputs */}
        <div className="flex-1 space-y-6 min-w-0">

          {/* ── PRIMARY TEXT ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Star className="h-3 w-3 text-white fill-white" />
                </div>
                Texto Principal
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    El texto más grande y visible del diseño. Ej: "Coffee First", "Born to Run"
                  </TooltipContent>
                </Tooltip>
              </Label>
              {primaryText && (
                <span className={`text-[11px] font-semibold ${primaryStatus.color}`}>
                  {primaryStatus.label} ({primaryText.length} chars)
                </span>
              )}
            </div>

            <Input
              placeholder={`Ej. "${fallback.primary[0]}" — tu mensaje principal`}
              value={primaryText}
              onChange={e => onPrimaryChange(e.target.value)}
              className="h-12 text-base font-semibold border-2 border-gray-200 focus:border-indigo-400 focus:ring-indigo-200 rounded-xl"
            />

            {/* Length bar */}
            {primaryText && (
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    primaryStatus.status === 'ideal' ? 'bg-emerald-500' :
                    primaryStatus.status === 'ok' ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{
                    width: `${Math.min(100, (primaryText.length / (PRODUCT_LENGTH_HINT[product]?.max || 30)) * 100)}%`
                  }}
                />
              </div>
            )}

            {/* AI-powered suggestions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-gray-400">
                  {loadingAI ? (
                    <>
                      <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
                      IA generando sugerencias...
                    </>
                  ) : aiLoaded ? (
                    <>
                      <Sparkles className="h-3 w-3 text-indigo-500" />
                      Sugerencias IA · {niche}
                    </>
                  ) : (
                    <>
                      <Type className="h-3 w-3" />
                      Sugerencias rápidas · {niche}
                    </>
                  )}
                </p>
                <button
                  onClick={handleRefreshAI}
                  disabled={loadingAI}
                  className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-semibold disabled:opacity-40 transition-colors"
                >
                  <RotateCcw className={`h-3 w-3 ${loadingAI ? 'animate-spin' : ''}`} />
                  Nuevas ideas
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {loadingAI ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-7 w-24 bg-indigo-50 rounded-full animate-pulse" />
                  ))
                ) : (
                  suggestions.map(s => (
                    <SuggestionChip key={s} text={s} onClick={() => onPrimaryChange(s)} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-200" />

          {/* ── SECONDARY TEXT ── */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-3 w-3 text-white" />
              </div>
              Frase de Apoyo
              <span className="text-xs font-normal text-gray-400">(opcional)</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  Texto más pequeño que complementa el mensaje principal. Ej: "Every day is a chance"
                </TooltipContent>
              </Tooltip>
            </Label>

            <Input
              placeholder={fallback.secondary[0] || 'Frase de apoyo...'}
              value={secondaryText}
              onChange={e => onSecondaryChange(e.target.value)}
              className="h-10 border-2 border-gray-200 focus:border-indigo-300 rounded-xl"
            />

            <div className="flex flex-wrap gap-2">
              {secondarySuggestions.map(s => (
                <SuggestionChip key={s} text={s} onClick={() => onSecondaryChange(s)} />
              ))}
            </div>
          </div>

          {/* ── ACCENT TEXT ── */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Hash className="h-3 w-3 text-gray-500" />
              </div>
              Detalle / Acento
              <span className="text-xs font-normal text-gray-400">(opcional)</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  Elemento decorativo corto: hashtag, año, ciudad, lema breve. Ej: "Since 2024", "#Goals"
                </TooltipContent>
              </Tooltip>
            </Label>

            <Input
              placeholder={fallback.accent[0] || 'Detalle o acento...'}
              value={accentText}
              onChange={e => onAccentChange(e.target.value)}
              className="h-10 border-2 border-gray-200 focus:border-indigo-300 rounded-xl"
            />

            <div className="flex flex-wrap gap-2">
              {accentSuggestions.map(s => (
                <SuggestionChip key={s} text={s} onClick={() => onAccentChange(s)} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Text composition preview */}
        <div className="hidden lg:flex w-64 flex-shrink-0">
          <div className="sticky top-4 w-full space-y-4">
            {/* Visual composition preview */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {/* Palette background */}
              <div
                className="h-36 flex flex-col items-center justify-center p-4 relative"
                style={{
                  background: paletteColors.length >= 2
                    ? `linear-gradient(135deg, ${paletteColors[0]}22 0%, ${paletteColors[1]}22 100%)`
                    : '#f9fafb',
                  borderBottom: `3px solid ${paletteColors[0] || '#e5e7eb'}`,
                }}
              >
                {primaryText ? (
                  <p className="text-base font-black text-gray-900 text-center leading-tight mb-1 drop-shadow-sm">
                    {primaryText}
                  </p>
                ) : (
                  <p className="text-sm text-gray-300 font-medium">Texto principal</p>
                )}
                {secondaryText && (
                  <p className="text-[11px] font-medium text-gray-600 text-center mt-1">{secondaryText}</p>
                )}
                {accentText && (
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">{accentText}</p>
                )}
              </div>

              <div className="p-3 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Composición de texto</p>

                {/* Palette strip */}
                {paletteColors.length > 0 && (
                  <div className="flex rounded-lg overflow-hidden h-4">
                    {paletteColors.map(c => (
                      <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                )}

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${primaryText ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                    <span className="text-gray-600">Principal: <strong>{primaryText || '—'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${secondaryText ? 'bg-blue-400' : 'bg-gray-200'}`} />
                    <span className="text-gray-600">Apoyo: <strong>{secondaryText || '—'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${accentText ? 'bg-purple-400' : 'bg-gray-200'}`} />
                    <span className="text-gray-600">Acento: <strong>{accentText || '—'}</strong></span>
                  </div>
                </div>

                {/* Length hint */}
                {primaryText && (
                  <div className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${
                    primaryStatus.status === 'ideal' ? 'bg-emerald-50 text-emerald-700' :
                    primaryStatus.status === 'ok' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {primaryStatus.label}
                  </div>
                )}
              </div>
            </div>

            {/* Tip card */}
            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3">
              <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">💡 Consejo</p>
              <p className="text-xs text-indigo-700">
                El texto principal es lo primero que el comprador verá en la miniatura del producto. 
                Hazlo directo, emocional y fácil de leer de un vistazo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
