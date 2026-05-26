'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Sparkles, Star, ChevronDown, ChevronUp, Palette, Type, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DESIGN_STYLES_ENRICHED, DesignStyleDef,
  COLOR_PALETTES_META, PaletteInfo,
  NICHE_TEXT_EXAMPLES,
  getRecommendedStylesForNiche,
} from '@/lib/data';

// ============================================================
// TYPES
// ============================================================
interface DesignCustomizationStepProps {
  product: string;
  niche: string;
  selectedStyle: string;
  selectedPalette: string;
  aiEngine: 'gemini' | 'zai';
  garmentTone?: 'dark' | 'light' | 'any';
  onStyleChange: (style: string) => void;
  onPaletteChange: (palette: string) => void;
  onGarmentToneChange?: (tone: 'dark' | 'light' | 'any') => void;
}

// ============================================================
// HELPER: Char-length hint for a product type
// ============================================================
const PRODUCT_LENGTH_HINT: Record<string, { max: number; label: string }> = {
  'T-Shirt': { max: 25, label: 'Camiseta' },
  'Hoodie': { max: 25, label: 'Hoodie' },
  'Sticker': { max: 15, label: 'Sticker' },
  'Pin/Badge': { max: 10, label: 'Pin' },
  'Cap/Gorra': { max: 12, label: 'Gorra' },
  'Mug/Taza': { max: 40, label: 'Taza' },
  'Tote Bag': { max: 30, label: 'Tote Bag' },
  'Poster/Lámina': { max: 60, label: 'Poster' },
  'Notebook/Agenda': { max: 40, label: 'Notebook' },
};

// ============================================================
// SMART GUIDE BANNER
// ============================================================
function SmartGuideBanner({ niche, product, sortedStyles }: {
  niche: string;
  product: string;
  sortedStyles: DesignStyleDef[];
}) {
  const topStyles = sortedStyles.filter(s => s.bestNiches.includes(niche)).slice(0, 3);
  const textExamples = NICHE_TEXT_EXAMPLES[niche] || NICHE_TEXT_EXAMPLES['Motivacional'];
  const topTexts = textExamples.primary.slice(0, 3);

  // Top palettes for this niche
  const topPalettes = Object.entries(COLOR_PALETTES_META)
    .filter(([, v]) => v.bestNiches.includes(niche))
    .slice(0, 3);

  if (!niche || !product) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50/40 p-5 mb-6 shadow-sm">
      {/* Decorative blob */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-indigo-200/30 blur-2xl pointer-events-none" />

      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-300">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-indigo-900">Guía inteligente para tu combinación</p>
          <p className="text-xs text-indigo-600/80 font-medium">
            {product} × {niche}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {/* Top styles */}
        <div className="bg-white/70 rounded-xl p-3 border border-indigo-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2 flex items-center gap-1">
            <Layers className="h-3 w-3" /> Estilos top
          </p>
          <div className="space-y-1">
            {topStyles.length > 0 ? topStyles.map(s => (
              <div key={s.id} className="flex items-center gap-1.5">
                <span className="text-sm">{s.emoji}</span>
                <span className="text-xs font-semibold text-gray-700">{s.name}</span>
              </div>
            )) : (
              <span className="text-xs text-gray-400">Todos los estilos funcionan</span>
            )}
          </div>
        </div>

        {/* Top palettes */}
        <div className="bg-white/70 rounded-xl p-3 border border-indigo-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2 flex items-center gap-1">
            <Palette className="h-3 w-3" /> Paletas recomendadas
          </p>
          <div className="space-y-1.5">
            {topPalettes.map(([name, info]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {info.colors.slice(0, 3).map(c => (
                    <div key={c} className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-600 truncate">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top texts */}
        <div className="bg-white/70 rounded-xl p-3 border border-indigo-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2 flex items-center gap-1">
            <Type className="h-3 w-3" /> Textos exitosos
          </p>
          <div className="space-y-1">
            {topTexts.map(text => (
              <p key={text} className="text-xs font-semibold text-gray-700 italic">"{text}"</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STYLE CARD
// ============================================================
function StyleCard({
  style,
  isSelected,
  isRecommended,
  onClick,
}: {
  style: DesignStyleDef;
  isSelected: boolean;
  isRecommended: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative p-0 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
        isSelected
          ? 'border-indigo-500 shadow-lg shadow-indigo-200/60 scale-[1.02]'
          : 'border-gray-200 hover:border-indigo-300 hover:shadow-md hover:scale-[1.01]'
      }`}
    >
      {/* Gradient header */}
      <div
        className="h-14 w-full flex items-center justify-between px-4 transition-all"
        style={{ background: style.previewGradient }}
      >
        <span className="text-2xl">{style.emoji}</span>
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-indigo-600" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 bg-white">
        <div className="flex items-start justify-between mb-1.5">
          <p className="text-sm font-bold text-gray-800 leading-tight">{style.name}</p>
          {style.popularPOD && (
            <span className="flex-shrink-0 ml-1 flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              Top POD
            </span>
          )}
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1 mb-2">
          {style.keywords.slice(0, 3).map(kw => (
            <span key={kw} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
              {kw}
            </span>
          ))}
        </div>

        {isRecommended && (
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-600">Recomendado para {style.bestNiches[0]}</span>
          </div>
        )}
      </div>
    </button>
  );
}

// ============================================================
// PALETTE CARD
// ============================================================
function PaletteCard({
  name,
  info,
  isSelected,
  selectedStyle,
  onClick,
}: {
  name: string;
  info: PaletteInfo;
  isSelected: boolean;
  selectedStyle: string;
  onClick: () => void;
}) {
  const compatible = selectedStyle ? info.bestStyles.includes(selectedStyle) : false;

  return (
    <TooltipProvider>
      <button
        onClick={onClick}
        className={`w-full p-3 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${
          isSelected
            ? 'border-indigo-500 bg-indigo-50/40 shadow-md shadow-indigo-200/50'
            : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-gray-800 leading-tight">{name}</p>
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-500" />}
            {compatible && !isSelected && (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                ✓ Combina
              </span>
            )}
          </div>
        </div>

        {/* Color bar */}
        <div className="flex rounded-lg overflow-hidden h-8 border border-gray-100 shadow-inner mb-2">
          {info.colors.map(color => (
            <Tooltip key={color}>
              <TooltipTrigger asChild>
                <div className="flex-1 h-full" style={{ backgroundColor: color }} />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <code>{color}</code>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <p className="text-[10px] text-gray-500 font-medium">{info.mood}</p>
      </button>
    </TooltipProvider>
  );
}

// ============================================================
// LIVE PREVIEW PANEL
// ============================================================
function LivePreviewPanel({
  product,
  niche,
  style,
  palette,
}: {
  product: string;
  niche: string;
  style: string;
  palette: string;
}) {
  const styleData = DESIGN_STYLES_ENRICHED.find(s => s.name === style);
  const paletteData = palette ? COLOR_PALETTES_META[palette] : null;
  const textExample = niche
    ? (NICHE_TEXT_EXAMPLES[niche]?.primary[0] || 'Your Text Here')
    : 'Your Text Here';

  return (
    <div className="sticky top-4 space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Preview header */}
        <div
          className="h-32 flex items-center justify-center relative overflow-hidden"
          style={{ background: styleData?.previewGradient || 'linear-gradient(135deg,#f3f4f6,#e5e7eb)' }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative text-center">
            <p
              className="text-lg font-black text-white drop-shadow-md leading-tight px-4 text-center"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
            >
              {textExample}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tu diseño en progreso</p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-500 text-xs">Producto</span>
              <span className="font-semibold text-gray-800 text-xs">{product || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-500 text-xs">Nicho</span>
              <span className="font-semibold text-gray-800 text-xs">{niche || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-500 text-xs">Estilo</span>
              <span className="font-semibold text-gray-800 text-xs flex items-center gap-1">
                {styleData?.emoji} {style || '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-500 text-xs">Paleta</span>
              <span className="font-semibold text-gray-800 text-xs">{palette || '—'}</span>
            </div>
          </div>

          {/* Palette strip */}
          {paletteData && (
            <div className="flex rounded-xl overflow-hidden h-6 border border-gray-100">
              {paletteData.colors.map(c => (
                <div key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
          )}

          {/* Completion indicator */}
          <div className="flex gap-1">
            {[product, niche, style, palette].map((val, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all ${val ? 'bg-emerald-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-[10px] text-gray-400 text-center">
            {[product, niche, style, palette].filter(Boolean).length}/4 seleccionados
          </p>
        </div>
      </div>

      {/* Pro tip */}
      {style && palette && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">💡 Pro Tip</p>
          <p className="text-xs text-amber-700">
            {DESIGN_STYLES_ENRICHED.find(s => s.name === style)?.keywords[0]} +{' '}
            {COLOR_PALETTES_META[palette]?.mood.split('·')[0].trim().toLowerCase()} =
            combinación con alta conversión en POD.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function DesignCustomizationStep({
  product,
  niche,
  selectedStyle,
  selectedPalette,
  garmentTone,
  aiEngine,
  onStyleChange,
  onPaletteChange,
  onGarmentToneChange,
}: DesignCustomizationStepProps) {
  const [showAllStyles, setShowAllStyles] = useState(false);
  const isApparel = ['T-Shirt', 'Hoodie', 'Tote Bag', 'Cap/Gorra'].includes(product);

  const sortedStyles = getRecommendedStylesForNiche(niche, product);
  const recommendedStyles = sortedStyles.filter(s =>
    s.bestNiches.includes(niche) || s.bestProducts.includes(product)
  );
  const otherStyles = sortedStyles.filter(s =>
    !s.bestNiches.includes(niche) && !s.bestProducts.includes(product)
  );
  const displayedStyles = showAllStyles ? sortedStyles : recommendedStyles.slice(0, 6);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 space-y-8 min-w-0">
        {/* Smart Guide Banner */}
        <SmartGuideBanner niche={niche} product={product} sortedStyles={sortedStyles} />

        {/* === GARMENT TONE SECTION === */}
        {isApparel && onGarmentToneChange && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div>
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                Color Base de la Prenda
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Para asegurar un buen contraste, indícanos si este diseño se imprimirá principalmente sobre tela oscura o clara.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onGarmentToneChange('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                  garmentTone === 'dark'
                    ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${garmentTone === 'dark' ? 'bg-white' : 'bg-gray-900'}`} />
                <span className="font-semibold text-sm">Prenda Oscura</span>
              </button>
              <button
                onClick={() => onGarmentToneChange('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                  garmentTone === 'light'
                    ? 'border-gray-300 bg-white text-gray-900 shadow-md ring-2 ring-indigo-500 ring-offset-2'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border border-gray-300 ${garmentTone === 'light' ? 'bg-gray-900' : 'bg-white'}`} />
                <span className="font-semibold text-sm">Prenda Clara</span>
              </button>
            </div>
          </div>
        )}

        {/* === STYLE SECTION === */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-500" />
                Estilo de Diseño
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Los estilos más arriba son los que mejor convierten para <strong>{niche}</strong> en <strong>{product}</strong>.
              </p>
            </div>
            {selectedStyle && (
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-xs">
                {selectedStyle}
              </Badge>
            )}
          </div>

          {/* Recommended styles */}
          {recommendedStyles.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Recomendados para {niche}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayedStyles
                  .filter(s => s.bestNiches.includes(niche) || s.bestProducts.includes(product))
                  .map(style => (
                    <StyleCard
                      key={style.id}
                      style={style}
                      isSelected={selectedStyle === style.name}
                      isRecommended={style.bestNiches.includes(niche)}
                      onClick={() => onStyleChange(style.name)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Other styles (collapsible) */}
          {otherStyles.length > 0 && (
            <div>
              <button
                onClick={() => setShowAllStyles(!showAllStyles)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors py-2"
              >
                {showAllStyles ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {showAllStyles ? 'Ocultar' : `Ver ${otherStyles.length} estilos más`}
              </button>

              {showAllStyles && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {otherStyles.map(style => (
                    <StyleCard
                      key={style.id}
                      style={style}
                      isSelected={selectedStyle === style.name}
                      isRecommended={false}
                      onClick={() => onStyleChange(style.name)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* === PALETTE SECTION === */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Palette className="h-4 w-4 text-indigo-500" />
                Paleta de Color
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedStyle
                  ? `Las paletas marcadas "✓ Combina" son compatibles con el estilo ${selectedStyle}.`
                  : 'Selecciona primero un estilo para ver la compatibilidad.'}
              </p>
            </div>
            {selectedPalette && (
              <div className="flex gap-1">
                {COLOR_PALETTES_META[selectedPalette]?.colors.map(c => (
                  <div key={c} className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(COLOR_PALETTES_META).map(([name, info]) => (
              <PaletteCard
                key={name}
                name={name}
                info={info}
                isSelected={selectedPalette === name}
                selectedStyle={selectedStyle}
                onClick={() => onPaletteChange(name)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Panel — desktop lateral, hidden on mobile */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <LivePreviewPanel
          product={product}
          niche={niche}
          style={selectedStyle}
          palette={selectedPalette}
        />
      </div>

      {/* Mobile mini-bar */}
      {(selectedStyle || selectedPalette) && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg px-4 py-3">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              {selectedStyle && (
                <div className="flex items-center gap-1.5">
                  <span className="text-base">
                    {DESIGN_STYLES_ENRICHED.find(s => s.name === selectedStyle)?.emoji}
                  </span>
                  <span className="text-xs font-semibold text-gray-700">{selectedStyle}</span>
                </div>
              )}
              {selectedPalette && (
                <div className="flex gap-0.5">
                  {COLOR_PALETTES_META[selectedPalette]?.colors.map(c => (
                    <div key={c} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              {[true, true, !!selectedStyle, !!selectedPalette].map((done, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${done ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
