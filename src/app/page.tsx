'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Wand2, FolderKanban, Calendar, BookOpen,
  Plus, Trash2, Edit3, Copy, Heart, Star, ChevronRight,
  Search, Download, RefreshCw, Sparkles,
  Menu, ArrowRight, ArrowLeft, Files
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import {
  PRODUCTS, NICHES, DESIGN_STYLES, AI_TOOLS, COLOR_PALETTES,
  PRODUCT_FONT_MAP, DEFAULT_FONTS, getFontsForProductNiche, generatePromptText
} from '@/lib/data';

// ============================================================
// TYPES
// ============================================================
type Tab = 'dashboard' | 'generator' | 'projects' | 'calendar' | 'prompts';

interface ProjectData {
  id: string; name: string; description: string; niche: string; color: string;
  createdAt: string; updatedAt: string;
  _count?: { prompts: number; sessions: number };
}

interface SessionData {
  id: string; name: string; projectId: string; createdAt: string; updatedAt: string;
  _count?: { prompts: number }; project?: { name: string };
}

interface PromptData {
  id: string; title: string; content: string; product: string; niche: string;
  theme: string; fontFamily: string; fontAccent: string; fontSecondary: string;
  colorPalette: string; style: string; aiTool: string; isFavorite: boolean;
  createdAt: string; updatedAt: string; projectId: string | null; sessionId: string | null;
  project?: { name: string };
}

interface CalendarEventData {
  id: string; name: string; date: string; type: string; niche: string;
  description: string; country: string; year: number;
}

interface StatsData {
  totalPrompts: number; totalProjects: number; totalSessions: number;
  favoriteCount: number; promptsThisWeek: number; promptsThisMonth: number;
  recentPrompts: PromptData[];
  promptsByProduct: { name: string; count: number }[];
  promptsByNiche: { name: string; count: number }[];
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'generator', label: 'Prompt Generator', icon: <Wand2 className="h-5 w-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="h-5 w-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="h-5 w-5" /> },
    { id: 'prompts', label: 'My Prompts', icon: <BookOpen className="h-5 w-5" /> },
  ];

  const handleNavClick = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">PromptForge</h1>
                <p className="text-xs text-gray-400">AI Prompt Generator</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <Button
              onClick={() => handleNavClick('generator')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> New Prompt
            </Button>
          </div>
        </aside>

        {/* Mobile Header + Sheet */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">PromptForge</h1>
            </div>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-gray-900 text-white border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold">PromptForge</h1>
                      <p className="text-xs text-gray-400">AI Prompt Generator</p>
                    </div>
                  </div>
                </div>
                <nav className="p-4 space-y-1">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === item.id
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </header>

          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around z-50">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                  activeTab === item.id ? 'text-emerald-600' : 'text-gray-500'
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
            {activeTab === 'generator' && <PromptGeneratorView />}
            {activeTab === 'projects' && <ProjectsView />}
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'prompts' && <MyPromptsView />}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ============================================================
// DASHBOARD VIEW
// ============================================================
function DashboardView({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse"><CardContent className="p-6"><div className="h-16 bg-gray-200 rounded" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Prompts', value: stats?.totalPrompts || 0, icon: <Wand2 className="h-5 w-5" />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: <FolderKanban className="h-5 w-5" />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Sessions', value: stats?.totalSessions || 0, icon: <BookOpen className="h-5 w-5" />, color: 'bg-teal-50 text-teal-600' },
    { label: 'Favorites', value: stats?.favoriteCount || 0, icon: <Heart className="h-5 w-5" />, color: 'bg-rose-50 text-rose-600' },
    { label: 'This Week', value: stats?.promptsThisWeek || 0, icon: <Calendar className="h-5 w-5" />, color: 'bg-violet-50 text-violet-600' },
    { label: 'This Month', value: stats?.promptsThisMonth || 0, icon: <Star className="h-5 w-5" />, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex gap-2">
          <Button onClick={() => onNavigate('generator')} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="h-4 w-4 mr-2" /> New Prompt
          </Button>
          <Button onClick={() => onNavigate('projects')} variant="outline">
            <FolderKanban className="h-4 w-4 mr-2" /> New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(card => (
          <Card key={card.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prompts by Product Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prompts by Product</CardTitle>
          </CardHeader>
          <CardContent>
            {(stats?.promptsByProduct?.length || 0) === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Wand2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No prompts yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.promptsByProduct?.slice(0, 8).map((item, i) => {
                  const maxCount = stats?.promptsByProduct?.[0]?.count || 1;
                  const percentage = (item.count / maxCount) * 100;
                  const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-orange-500', 'bg-cyan-500', 'bg-lime-500'];
                  return (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-600 w-28 truncate">{item.name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div className={`${colors[i % colors.length]} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                          style={{ width: `${Math.max(percentage, 15)}%` }}>
                          <span className="text-[10px] font-bold text-white">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prompts by Niche Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prompts by Niche</CardTitle>
          </CardHeader>
          <CardContent>
            {(stats?.promptsByNiche?.length || 0) === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No niche data yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {stats?.promptsByNiche?.slice(0, 10).map((item, i) => {
                  const colors = ['bg-emerald-100 text-emerald-700', 'bg-teal-100 text-teal-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-violet-100 text-violet-700', 'bg-orange-100 text-orange-700', 'bg-cyan-100 text-cyan-700', 'bg-lime-100 text-lime-700', 'bg-pink-100 text-pink-700', 'bg-sky-100 text-sky-700'];
                  return (
                    <div key={item.name} className={`rounded-lg p-2 text-center ${colors[i % colors.length]}`}>
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <p className="text-lg font-bold">{item.count}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Prompts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Prompts</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('prompts')}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(stats?.recentPrompts?.length || 0) === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">No prompts yet. Start generating!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentPrompts?.map(prompt => (
                <div key={prompt.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{prompt.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">{prompt.product}</Badge>
                      <Badge variant="outline" className="text-[10px]">{prompt.niche}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {prompt.isFavorite && <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />}
                    <span className="text-xs text-gray-400">{new Date(prompt.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// PROMPT GENERATOR VIEW
// ============================================================
function PromptGeneratorView() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiGeneratedPrompt, setAiGeneratedPrompt] = useState('');
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const [formData, setFormData] = useState({
    product: '',
    niche: '',
    style: '',
    paletteName: '',
    primaryText: '',
    secondaryText: '',
    accentText: '',
    aiTool: 'Midjourney',
    fontFamilyOverride: '',
    fontSecondaryOverride: '',
    fontAccentOverride: '',
    projectId: '',
  });

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setProjects).catch(() => {});
  }, []);

  const fonts = getFontsForProductNiche(formData.product, formData.niche);
  const effectiveFonts = {
    principal: formData.fontFamilyOverride || fonts.principal,
    secundaria: formData.fontSecondaryOverride || fonts.secundaria,
    acento: formData.fontAccentOverride || fonts.acento,
  };
  const palette = COLOR_PALETTES[formData.paletteName] || [];

  const totalSteps = 5;
  const progressPercent = (step / totalSteps) * 100;

  const canGoNext = () => {
    switch (step) {
      case 1: return !!formData.product;
      case 2: return !!formData.niche;
      case 3: return !!formData.style && !!formData.paletteName && !!formData.primaryText;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const generatedPrompt = step === 5 ? generatePromptText({
    product: formData.product,
    niche: formData.niche,
    style: formData.style,
    primaryText: formData.primaryText,
    secondaryText: formData.secondaryText,
    accentText: formData.accentText,
    fonts: effectiveFonts,
    colorPalette: palette,
    paletteName: formData.paletteName,
    aiTool: formData.aiTool,
  }) : '';

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Prompt copied to clipboard' });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${formData.product} - ${formData.niche} - ${formData.primaryText}`,
          content: aiGeneratedPrompt || generatedPrompt,
          product: formData.product,
          niche: formData.niche,
          theme: formData.style,
          fontFamily: effectiveFonts.principal,
          fontSecondary: effectiveFonts.secundaria,
          fontAccent: effectiveFonts.acento,
          colorPalette: palette,
          style: formData.style,
          aiTool: formData.aiTool,
          projectId: formData.projectId || null,
        }),
      });
      if (res.ok) {
        toast({ title: 'Saved!', description: 'Prompt saved successfully' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save prompt', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleAiRegenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: formData.product,
          niche: formData.niche,
          style: formData.style,
          primaryText: formData.primaryText,
          secondaryText: formData.secondaryText,
          accentText: formData.accentText,
          fonts: effectiveFonts,
          colors: palette,
          aiTool: formData.aiTool,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiGeneratedPrompt(data.prompt);
        toast({ title: 'AI Generated!', description: 'New prompt generated with AI' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to generate AI prompt', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      product: '', niche: '', style: '', paletteName: '',
      primaryText: '', secondaryText: '', accentText: '',
      aiTool: 'Midjourney', fontFamilyOverride: '', fontSecondaryOverride: '',
      fontAccentOverride: '', projectId: '',
    });
    setAiGeneratedPrompt('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Prompt Generator</h2>
        <Badge variant="outline" className="text-sm">Step {step} of {totalSteps}</Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progressPercent} className="h-2" />
        <div className="flex justify-between">
          {['Product', 'Niche', 'Design', 'Fonts', 'Generate'].map((label, i) => (
            <span key={label} className={`text-xs ${step > i + 1 ? 'text-emerald-600 font-medium' : step === i + 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Step 1: Product Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select Product Type</h3>
                <p className="text-sm text-gray-500">Choose the product you want to design for</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {PRODUCTS.map(product => (
                  <button
                    key={product.name}
                    onClick={() => setFormData(prev => ({ ...prev, product: product.name }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md ${
                      formData.product === product.name
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-2xl block mb-2">{product.icon}</span>
                    <span className="text-xs font-medium text-gray-700 block">{product.name}</span>
                    <span className="text-[10px] text-gray-400 block mt-1">{product.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Niche Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select Niche</h3>
                <p className="text-sm text-gray-500">Choose your target niche for {formData.product}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {NICHES.map(niche => (
                  <button
                    key={niche}
                    onClick={() => setFormData(prev => ({ ...prev, niche }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md ${
                      formData.niche === niche
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700">{niche}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Design Customization */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Design Customization</h3>
                <p className="text-sm text-gray-500">Customize the design style, colors, and text</p>
              </div>

              {/* Style Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Design Theme/Style</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {DESIGN_STYLES.map(style => (
                    <button
                      key={style}
                      onClick={() => setFormData(prev => ({ ...prev, style }))}
                      className={`p-3 rounded-lg border text-sm transition-all ${
                        formData.style === style
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                          : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color Palette</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
                    <button
                      key={name}
                      onClick={() => setFormData(prev => ({ ...prev, paletteName: name }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.paletteName === name
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <p className="text-xs font-medium text-gray-700 mb-2">{name}</p>
                      <div className="flex gap-1">
                        {colors.map((color, i) => (
                          <div key={i} className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Inputs */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Primary Text *</Label>
                  <Input
                    placeholder="Main message"
                    value={formData.primaryText}
                    onChange={e => setFormData(prev => ({ ...prev, primaryText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Secondary Text</Label>
                  <Input
                    placeholder="Subtitle/tagline"
                    value={formData.secondaryText}
                    onChange={e => setFormData(prev => ({ ...prev, secondaryText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Accent Text</Label>
                  <Input
                    placeholder="Date/name/detail"
                    value={formData.accentText}
                    onChange={e => setFormData(prev => ({ ...prev, accentText: e.target.value }))}
                  />
                </div>
              </div>

              {/* AI Tool */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">AI Tool</Label>
                <div className="flex flex-wrap gap-2">
                  {AI_TOOLS.map(tool => (
                    <button
                      key={tool}
                      onClick={() => setFormData(prev => ({ ...prev, aiTool: tool }))}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        formData.aiTool === tool
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                          : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Font Selection */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Font Selection</h3>
                <p className="text-sm text-gray-500">Recommended fonts for {formData.product} + {formData.niche}</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="border-2 border-emerald-200 bg-emerald-50/50">
                  <CardContent className="p-4 space-y-3">
                    <Label className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Fuente Principal</Label>
                    <p className="text-lg font-bold text-gray-900">{fonts.principal}</p>
                    <Input
                      placeholder="Override font..."
                      value={formData.fontFamilyOverride}
                      onChange={e => setFormData(prev => ({ ...prev, fontFamilyOverride: e.target.value }))}
                      className="text-sm"
                    />
                  </CardContent>
                </Card>
                <Card className="border-2 border-teal-200 bg-teal-50/50">
                  <CardContent className="p-4 space-y-3">
                    <Label className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Fuente Secundaria</Label>
                    <p className="text-lg font-bold text-gray-900">{fonts.secundaria}</p>
                    <Input
                      placeholder="Override font..."
                      value={formData.fontSecondaryOverride}
                      onChange={e => setFormData(prev => ({ ...prev, fontSecondaryOverride: e.target.value }))}
                      className="text-sm"
                    />
                  </CardContent>
                </Card>
                <Card className="border-2 border-amber-200 bg-amber-50/50">
                  <CardContent className="p-4 space-y-3">
                    <Label className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Fuente de Acento</Label>
                    <p className="text-lg font-bold text-gray-900">{fonts.acento}</p>
                    <Input
                      placeholder="Override font..."
                      value={formData.fontAccentOverride}
                      onChange={e => setFormData(prev => ({ ...prev, fontAccentOverride: e.target.value }))}
                      className="text-sm"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Save to Project */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Save to Project (optional)</Label>
                <Select value={formData.projectId} onValueChange={v => setFormData(prev => ({ ...prev, projectId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select a project..." /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 5: Generate Prompt */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your Generated Prompt</h3>
                <p className="text-sm text-gray-500">Review, copy, or enhance your prompt</p>
              </div>

              {/* Summary of selections */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-emerald-100 text-emerald-700">{formData.product}</Badge>
                <Badge className="bg-teal-100 text-teal-700">{formData.niche}</Badge>
                <Badge className="bg-amber-100 text-amber-700">{formData.style}</Badge>
                <Badge className="bg-violet-100 text-violet-700">{formData.aiTool}</Badge>
                {palette.length > 0 && (
                  <Badge className="bg-gray-100 text-gray-700 flex items-center gap-1">
                    {formData.paletteName}
                    <span className="flex gap-0.5 ml-1">
                      {palette.map((c, i) => <span key={i} className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c }} />)}
                    </span>
                  </Badge>
                )}
              </div>

              {/* Prompt Display */}
              <div className="space-y-4">
                <div className="relative">
                  <Label className="text-sm font-medium">Template Prompt</Label>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg border text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {generatedPrompt}
                  </div>
                  <Button
                    variant="ghost" size="sm"
                    className="absolute top-8 right-2"
                    onClick={() => handleCopy(generatedPrompt)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {aiGeneratedPrompt && (
                  <div className="relative">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-500" /> AI-Enhanced Prompt
                    </Label>
                    <div className="mt-1 p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {aiGeneratedPrompt}
                    </div>
                    <Button
                      variant="ghost" size="sm"
                      className="absolute top-8 right-2"
                      onClick={() => handleCopy(aiGeneratedPrompt)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => handleCopy(aiGeneratedPrompt || generatedPrompt)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Copy className="h-4 w-4 mr-2" /> Copy Prompt
                </Button>
                <Button onClick={handleSave} disabled={saving} variant="outline">
                  <Star className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save to Project'}
                </Button>
                <Button onClick={handleAiRegenerate} disabled={generating} variant="outline" className="border-violet-300 text-violet-600 hover:bg-violet-50">
                  <Sparkles className="h-4 w-4 mr-2" /> {generating ? 'Generating...' : 'Regenerate with AI'}
                </Button>
                <Button onClick={handleReset} variant="ghost">
                  <RefreshCw className="h-4 w-4 mr-2" /> Generate Another
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(prev => prev + 1)}
                disabled={!canGoNext()}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// PROJECTS VIEW
// ============================================================
function ProjectsView() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectData & { prompts: PromptData[]; sessions: SessionData[] } | null>(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [editingSession, setEditingSession] = useState<SessionData | null>(null);
  const [form, setForm] = useState({ name: '', description: '', niche: '', color: '#10B981' });
  const [sessionForm, setSessionForm] = useState({ name: '' });

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) setProjects(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openNewProjectDialog = () => {
    setEditingProject(null);
    setForm({ name: '', description: '', niche: '', color: '#10B981' });
    setShowProjectDialog(true);
  };

  const openEditProjectDialog = (project: ProjectData) => {
    setEditingProject(project);
    setForm({ name: project.name, description: project.description, niche: project.niche, color: project.color });
    setShowProjectDialog(true);
  };

  const handleSaveProject = async () => {
    try {
      if (editingProject) {
        await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
        });
        toast({ title: 'Updated!', description: 'Project updated successfully' });
      } else {
        await fetch('/api/projects', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
        });
        toast({ title: 'Created!', description: 'Project created successfully' });
      }
      setShowProjectDialog(false);
      fetchProjects();
    } catch {
      toast({ title: 'Error', description: 'Failed to save project', variant: 'destructive' });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      toast({ title: 'Deleted!', description: 'Project deleted' });
      fetchProjects();
      if (selectedProject?.id === id) setSelectedProject(null);
    } catch {
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' });
    }
  };

  const handleViewProject = async (project: ProjectData) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`);
      if (res.ok) setSelectedProject(await res.json());
    } catch { /* ignore */ }
  };

  const handleSaveSession = async () => {
    if (!selectedProject) return;
    try {
      if (editingSession) {
        await fetch(`/api/sessions/${editingSession.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: sessionForm.name }),
        });
        toast({ title: 'Updated!', description: 'Session updated' });
      } else {
        await fetch('/api/sessions', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: sessionForm.name, projectId: selectedProject.id }),
        });
        toast({ title: 'Created!', description: 'Session created' });
      }
      setShowSessionDialog(false);
      handleViewProject(selectedProject);
    } catch {
      toast({ title: 'Error', description: 'Failed to save session', variant: 'destructive' });
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!selectedProject) return;
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      toast({ title: 'Deleted!', description: 'Session deleted' });
      handleViewProject(selectedProject);
    } catch {
      toast({ title: 'Error', description: 'Failed to delete session', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}</div></div>;
  }

  // Project Detail View
  if (selectedProject) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setSelectedProject(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedProject.color }} />
          <h2 className="text-xl font-bold text-gray-900">{selectedProject.name}</h2>
        </div>

        {selectedProject.description && <p className="text-gray-500">{selectedProject.description}</p>}

        {/* Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Sessions</CardTitle>
            <Button size="sm" onClick={() => { setEditingSession(null); setSessionForm({ name: '' }); setShowSessionDialog(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Session
            </Button>
          </CardHeader>
          <CardContent>
            {selectedProject.sessions?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No sessions yet</p>
            ) : (
              <div className="space-y-2">
                {selectedProject.sessions?.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="text-sm font-medium">{session.name}</p>
                      <p className="text-xs text-gray-400">{session._count?.prompts || 0} prompts</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingSession(session); setSessionForm({ name: session.name }); setShowSessionDialog(true); }}>
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete Session?</AlertDialogTitle>
                            <AlertDialogDescription>This will delete &quot;{session.name}&quot; and all its prompts.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteSession(session.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Prompts */}
        <Card>
          <CardHeader><CardTitle className="text-base">Prompts ({selectedProject.prompts?.length || 0})</CardTitle></CardHeader>
          <CardContent>
            {selectedProject.prompts?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No prompts in this project</p>
            ) : (
              <div className="space-y-2">
                {selectedProject.prompts?.map(prompt => (
                  <div key={prompt.id} className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">{prompt.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prompt.content}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">{prompt.product}</Badge>
                      <Badge variant="outline" className="text-[10px]">{prompt.niche}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Dialog */}
        <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSession ? 'Edit Session' : 'New Session'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Session Name</Label>
                <Input value={sessionForm.name} onChange={e => setSessionForm({ name: e.target.value })} placeholder="Session name..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSessionDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveSession} disabled={!sessionForm.name} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                {editingSession ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Project List View
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <Button onClick={openNewProjectDialog} className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FolderKanban className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No projects yet</h3>
            <p className="text-sm text-gray-400 mt-1">Create your first project to organize your prompts</p>
            <Button onClick={openNewProjectDialog} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="h-4 w-4 mr-2" /> Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <Card key={project.id} className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => handleViewProject(project)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: project.color + '20' }}>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      {project.niche && <Badge variant="outline" className="text-[10px] mt-1">{project.niche}</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditProjectDialog(project)}><Edit3 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent>Edit</TooltipContent></Tooltip>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Delete Project?</AlertDialogTitle><AlertDialogDescription>This will delete &quot;{project.name}&quot; and all its data.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteProject(project.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {project.description && <p className="text-sm text-gray-500 mt-3 line-clamp-2">{project.description}</p>}
                <div className="flex gap-4 mt-3 text-xs text-gray-400">
                  <span>{project._count?.prompts || 0} prompts</span>
                  <span>{project._count?.sessions || 0} sessions</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Project Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'New Project'}</DialogTitle>
            <DialogDescription>{editingProject ? 'Update project details' : 'Create a new project to organize your prompts'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Project Name *</Label>
              <Input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="My project..." />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Project description..." />
            </div>
            <div className="space-y-2">
              <Label>Niche</Label>
              <Select value={form.niche} onValueChange={v => setForm(prev => ({ ...prev, niche: v }))}>
                <SelectTrigger><SelectValue placeholder="Select niche..." /></SelectTrigger>
                <SelectContent>
                  {NICHES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#84CC16'].map(c => (
                  <button key={c} className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? 'border-gray-900 scale-110' : 'border-gray-200'}`}
                    style={{ backgroundColor: c }} onClick={() => setForm(prev => ({ ...prev, color: c }))} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProjectDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProject} disabled={!form.name} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// CALENDAR VIEW
// ============================================================
function CalendarView() {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [filterType, setFilterType] = useState<string>('all');
  const [filterNiche, setFilterNiche] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventData | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Try to seed first
      await fetch('/api/calendar/seed', { method: 'POST' });
      const res = await fetch('/api/calendar');
      if (res.ok) setEvents(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const filteredEvents = events.filter(e => {
    const eventMonth = parseInt(e.date.split('-')[1]) - 1;
    if (eventMonth !== selectedMonth) return false;
    if (filterType !== 'all' && e.type !== filterType) return false;
    if (filterNiche !== 'all' && e.niche !== filterNiche) return false;
    return true;
  });

  const typeColors: Record<string, string> = {
    holiday: 'bg-red-100 text-red-700 border-red-200',
    seasonal: 'bg-green-100 text-green-700 border-green-200',
    awareness: 'bg-purple-100 text-purple-700 border-purple-200',
    commercial: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  const typeDots: Record<string, string> = {
    holiday: 'bg-red-500',
    seasonal: 'bg-green-500',
    awareness: 'bg-purple-500',
    commercial: 'bg-orange-500',
  };

  const handleGenerateForEvent = (event: CalendarEventData) => {
    const prompt = `${event.name} themed design for print-on-demand products, ${event.niche} niche, celebrating ${event.description}, festive and eye-catching, high resolution, print-ready quality`;
    navigator.clipboard.writeText(prompt);
    toast({ title: 'Prompt Generated!', description: `Prompt for "${event.name}" copied to clipboard` });
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}</div></div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Special Dates Calendar</h2>
        <Badge variant="outline" className="text-sm">2026</Badge>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {months.map((month, i) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedMonth === i
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="holiday">Holiday</SelectItem>
            <SelectItem value="seasonal">Seasonal</SelectItem>
            <SelectItem value="awareness">Awareness</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterNiche} onValueChange={setFilterNiche}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Niche" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Niches</SelectItem>
            {NICHES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {Object.entries(typeColors).map(([type, colorClass]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${typeDots[type]}`} />
            <span className="text-gray-600 capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400">No events found for this filter</p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map(event => (
            <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEvent(event)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`px-2 py-1 rounded-md text-xs font-bold ${typeColors[event.type] || 'bg-gray-100 text-gray-700'}`}>
                      {event.date.split('-')[2]}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] capitalize">{event.type}</Badge>
                        <Badge variant="outline" className="text-[10px]">{event.niche}</Badge>
                        {event.country !== 'global' && <Badge variant="outline" className="text-[10px]">{event.country}</Badge>}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={(e) => { e.stopPropagation(); handleGenerateForEvent(event); }}
                  >
                    <Wand2 className="h-3.5 w-3.5 mr-1" /> Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.name}</DialogTitle>
                <DialogDescription>{selectedEvent.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="flex gap-2">
                  <Badge className={typeColors[selectedEvent.type]}>{selectedEvent.type}</Badge>
                  <Badge variant="outline">{selectedEvent.niche}</Badge>
                  <Badge variant="outline">{selectedEvent.date}</Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Suggested Prompt:</p>
                  <p className="text-sm text-gray-800">
                    {selectedEvent.name} themed design for print-on-demand products, {selectedEvent.niche} niche, celebrating {selectedEvent.description}, festive and eye-catching, high resolution, print-ready quality
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>Close</Button>
                <Button onClick={() => handleGenerateForEvent(selectedEvent)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Copy className="h-4 w-4 mr-2" /> Copy Prompt
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// MY PROMPTS VIEW
// ============================================================
function MyPromptsView() {
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [filterNiche, setFilterNiche] = useState('all');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingPrompt, setEditingPrompt] = useState<PromptData | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterProduct !== 'all') params.set('product', filterProduct);
      if (filterNiche !== 'all') params.set('niche', filterNiche);
      if (filterFavorite) params.set('favorite', 'true');
      params.set('sortBy', sortBy);
      const res = await fetch(`/api/prompts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPrompts(data.prompts);
        setTotal(data.total);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [search, filterProduct, filterNiche, filterFavorite, sortBy]);

  useEffect(() => { fetchPrompts(); }, [fetchPrompts]);

  const handleToggleFavorite = async (prompt: PromptData) => {
    try {
      await fetch(`/api/prompts/${prompt.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !prompt.isFavorite }),
      });
      fetchPrompts();
    } catch { /* ignore */ }
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast({ title: 'Copied!', description: 'Prompt copied to clipboard' });
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      toast({ title: 'Deleted!', description: 'Prompt deleted' });
      fetchPrompts();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await fetch('/api/prompts/copy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
      });
      toast({ title: 'Duplicated!', description: 'Prompt duplicated' });
      fetchPrompts();
    } catch {
      toast({ title: 'Error', description: 'Failed to duplicate', variant: 'destructive' });
    }
  };

  const handleEdit = async () => {
    if (!editingPrompt) return;
    try {
      await fetch(`/api/prompts/${editingPrompt.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      toast({ title: 'Updated!', description: 'Prompt updated' });
      setEditingPrompt(null);
      fetchPrompts();
    } catch {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const handleBulkExport = async (format: string) => {
    try {
      const res = await fetch('/api/prompts/export', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), format }),
      });
      if (format === 'txt') {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'prompts.txt'; a.click();
        URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'prompts.json'; a.click();
        URL.revokeObjectURL(url);
      }
      toast({ title: 'Exported!', description: `${selectedIds.size} prompts exported` });
      setSelectedIds(new Set());
    } catch {
      toast({ title: 'Error', description: 'Failed to export', variant: 'destructive' });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => fetch(`/api/prompts/${id}`, { method: 'DELETE' })));
      toast({ title: 'Deleted!', description: `${selectedIds.size} prompts deleted` });
      setSelectedIds(new Set());
      fetchPrompts();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === prompts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(prompts.map(p => p.id)));
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Prompts</h2>
        <span className="text-sm text-gray-400">{total} total</span>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search prompts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterProduct} onValueChange={setFilterProduct}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Product" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {PRODUCTS.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterNiche} onValueChange={setFilterNiche}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Niche" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Niches</SelectItem>
            {NICHES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button
          variant={filterFavorite ? 'default' : 'outline'}
          onClick={() => setFilterFavorite(!filterFavorite)}
          className={filterFavorite ? 'bg-rose-500 hover:bg-rose-600 text-white' : ''}
        >
          <Heart className={`h-4 w-4 mr-1 ${filterFavorite ? 'fill-white' : ''}`} /> Favorites
        </Button>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest First</SelectItem>
            <SelectItem value="product">By Product</SelectItem>
            <SelectItem value="niche">By Niche</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <span className="text-sm font-medium text-emerald-700">{selectedIds.size} selected</span>
          <Button size="sm" variant="outline" onClick={() => handleBulkExport('json')}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export JSON
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkExport('txt')}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export TXT
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-rose-600 border-rose-300 hover:bg-rose-50">
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Delete {selectedIds.size} prompts?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Prompts List */}
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      ) : prompts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No prompts found</h3>
            <p className="text-sm text-gray-400 mt-1">Start generating prompts or adjust your filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Select All */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              checked={selectedIds.size === prompts.length && prompts.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-gray-300"
            />
            <span className="text-xs text-gray-500">Select All</span>
          </div>

          {prompts.map(prompt => (
            <Card key={prompt.id} className={`transition-all ${selectedIds.has(prompt.id) ? 'ring-2 ring-emerald-500' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(prompt.id)}
                    onChange={() => toggleSelect(prompt.id)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{prompt.title}</h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{prompt.content}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleFavorite(prompt)}>
                          <Heart className={`h-4 w-4 ${prompt.isFavorite ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                        </Button></TooltipTrigger><TooltipContent>{prompt.isFavorite ? 'Unfavorite' : 'Favorite'}</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(prompt.content)}>
                          <Copy className="h-4 w-4 text-gray-400" />
                        </Button></TooltipTrigger><TooltipContent>Copy</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDuplicate(prompt.id)}>
                          <Files className="h-4 w-4 text-gray-400" />
                        </Button></TooltipTrigger><TooltipContent>Duplicate</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingPrompt(prompt); setEditForm({ title: prompt.title, content: prompt.content }); }}>
                          <Edit3 className="h-4 w-4 text-gray-400" />
                        </Button></TooltipTrigger><TooltipContent>Edit</TooltipContent></Tooltip>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4 text-rose-400" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Delete Prompt?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(prompt.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">{prompt.product}</Badge>
                      <Badge variant="outline" className="text-[10px]">{prompt.niche}</Badge>
                      {prompt.style && <Badge variant="outline" className="text-[10px]">{prompt.style}</Badge>}
                      <Badge variant="outline" className="text-[10px]">{prompt.aiTool}</Badge>
                      {prompt.project && <Badge variant="outline" className="text-[10px]">{prompt.project.name}</Badge>}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">{new Date(prompt.createdAt).toLocaleDateString()} · {new Date(prompt.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Prompt Dialog */}
      <Dialog open={!!editingPrompt} onOpenChange={() => setEditingPrompt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editForm.title} onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={editForm.content} onChange={e => setEditForm(prev => ({ ...prev, content: e.target.value }))} rows={8} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPrompt(null)}>Cancel</Button>
            <Button onClick={handleEdit} className="bg-emerald-500 hover:bg-emerald-600 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
