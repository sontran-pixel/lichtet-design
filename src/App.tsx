import React, { useState } from 'react';
import { Archive, Check, Save, Sparkles, BookOpen, Layers } from 'lucide-react';
import type {
  CalendarDesign,
  CalendarType,
  MonthSheetConfig,
  PrintOrderItem,
  WizardStep,
} from './types/calendar';
import { createDefaultDesign } from './data/calendarCatalog';
import {
  deleteProjectFromStorage,
  loadPrintOrders,
  loadSavedProjects,
  savePrintOrder,
  saveProjectToStorage,
} from './utils/storage';
import { Button, ErrorBoundary } from './components/ui';
import { Step1TypeSelect } from './components/Step1TypeSelect';
import { Step2StyleLayout } from './components/Step2StyleLayout';
import { Step3Customize } from './components/Step3Customize';
import { Step4SaveAndOrder } from './components/Step4SaveAndOrder';
import { SavedProjectsModal } from './components/SavedProjectsModal';

const STEPS: Array<{ step: WizardStep; title: string; shortLabel: string; subtitle: string }> = [
  { step: 1, title: '1. Chọn loại lịch', shortLabel: '1. Loại lịch', subtitle: 'Để bàn hoặc treo tường' },
  { step: 2, title: '2. Kiểu & bố cục', shortLabel: '2. Kiểu & bố cục', subtitle: 'Mỹ thuật Tết & cỡ ngày' },
  { step: 3, title: '3. Tải ảnh & tùy chỉnh', shortLabel: '3. Tùy chỉnh', subtitle: 'Ảnh 12 tháng & lịch Âm' },
  { step: 4, title: '4. Lưu & đặt in', shortLabel: '4. Lưu & đặt in', subtitle: 'Xuất file PNG & báo giá' },
];

function CalendarStudioApp() {
  const [step, setStep] = useState<WizardStep>(1);
  const [design, setDesign] = useState<CalendarDesign>(() => createDefaultDesign('desk'));
  const [activeSheet, setActiveSheet] = useState<number>(1);
  const [savedProjects, setSavedProjects] = useState<CalendarDesign[]>(() => loadSavedProjects());
  const [orders, setOrders] = useState<PrintOrderItem[]>(() => loadPrintOrders());
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [headerNotice, setHeaderNotice] = useState<string>('');

  const handleSelectTypeAndVariant = (calendarType: CalendarType, variantId: string) => {
    setDesign((prev) => {
      const typeChanged = prev.calendarType !== calendarType;
      return {
        ...prev,
        calendarType,
        variantId,
        layoutId: typeChanged
          ? calendarType === 'desk'
            ? 'desk-split-curve'
            : 'wall-top-photo-grid'
          : prev.layoutId,
        styleId: typeChanged
          ? calendarType === 'desk'
            ? 'son-mai-dinh-mui'
            : 'ca-phe-toi-gian'
          : prev.styleId,
      };
    });
  };

  const handleUpdateDesign = (patch: Partial<CalendarDesign>) => {
    setDesign((prev) => ({ ...prev, ...patch }));
  };

  const handleUpdateSheet = (sheetIndex: number, patch: Partial<MonthSheetConfig>) => {
    setDesign((prev) => ({
      ...prev,
      sheets: prev.sheets.map((s) =>
        s.sheetIndex === sheetIndex ? { ...s, ...patch } : s
      ),
    }));
  };

  const handleQuickSave = () => {
    const res = saveProjectToStorage(design);
    setSavedProjects(res.projects);
    if (res.ok) {
      setHeaderNotice('Đã lưu thiết kế vào kho của bạn');
      window.setTimeout(() => setHeaderNotice(''), 2800);
    } else if (res.error) {
      setHeaderNotice(res.error);
    }
    return { ok: res.ok, error: res.error };
  };

  const handleSubmitOrder = (order: PrintOrderItem) => {
    const res = savePrintOrder(order);
    setOrders(res.orders);
  };

  const handleLoadProject = (proj: CalendarDesign) => {
    setDesign(proj);
    setStep(3);
    setActiveSheet(1);
  };

  const handleDeleteProject = (id: string) => {
    setSavedProjects(deleteProjectFromStorage(id));
  };

  const handleStartNew = () => {
    setDesign(createDefaultDesign(design.calendarType));
    setStep(1);
    setActiveSheet(1);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      {/* Top Artisan Brand Header */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-[92rem] mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Logo with traditional Vietnamese red seal emblem */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-2.5 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-primary group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm bg-primary text-primary-foreground flex flex-col items-center justify-center font-bold font-display shadow-xs border border-primary/40 group-hover:brightness-105 transition-all">
              <span className="text-[10px] leading-tight tracking-widest uppercase">XUÂN</span>
              <span className="text-xs sm:text-sm leading-none tabular-nums font-sans">2027</span>
            </div>
            <div className="min-w-0">
              <div className="font-display text-base sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <span>Xưởng Lịch Tết Việt Nam</span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold bg-accent/20 text-accent-foreground border border-accent/40">
                  Âm Lịch UTC+7
                </span>
              </div>
              <p className="text-[11px] text-muted hidden md:block">
                Lịch để bàn chữ A &amp; lịch treo tường ép kim
              </p>
            </div>
          </button>

          {/* 4-Step Progress Navigation (Desktop) */}
          <nav aria-label="Các bước thiết kế lịch Tết" className="hidden lg:flex items-center gap-1.5">
            {STEPS.map((item) => {
              const isCurrent = step === item.step;
              const isPassed = step > item.step;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setStep(item.step)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`inline-flex items-center gap-2 min-h-10 px-3.5 rounded-control text-sm font-semibold whitespace-nowrap cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-primary ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : isPassed
                      ? 'bg-primary/10 text-primary hover:bg-primary/15'
                      : 'text-muted hover:text-foreground hover:bg-background'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold tabular-nums shrink-0 ${
                      isCurrent
                        ? 'bg-white text-primary'
                        : isPassed
                        ? 'bg-primary text-white'
                        : 'border border-border text-muted'
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : item.step}
                  </span>
                  <span>{item.title.replace(/^\d+\.\s*/, '')}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {headerNotice && (
              <span role="status" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-control border border-success/20">
                <Check className="w-3.5 h-3.5" />
                <span>{headerNotice}</span>
              </span>
            )}
            <Button tone="quiet" size="sm" onClick={handleQuickSave} title="Lưu thiết kế hiện tại">
              <Save className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Lưu mẫu</span>
            </Button>
            <Button
              tone="quiet"
              size="sm"
              onClick={() => setIsSavedModalOpen(true)}
              title="Xem danh sách mẫu và đơn hàng"
            >
              <Archive className="w-4 h-4 text-primary" />
              <span>Đã lưu ({savedProjects.length})</span>
            </Button>
          </div>
        </div>

        {/* Mobile 4-Step Row */}
        <nav
          aria-label="Các bước thiết kế trên di động"
          className="lg:hidden border-t border-border/80 px-3 py-2 flex items-center justify-between gap-1 overflow-x-auto bg-surface"
        >
          {STEPS.map((item) => {
            const isCurrent = step === item.step;
            const isPassed = step > item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setStep(item.step)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`min-h-8 px-2.5 rounded-control text-xs font-bold whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isPassed
                    ? 'text-primary bg-primary/10'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 w-full max-w-[92rem] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {step === 1 && (
          <Step1TypeSelect
            design={design}
            onSelectTypeAndVariant={handleSelectTypeAndVariant}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2StyleLayout
            design={design}
            activeSheet={activeSheet}
            onChangeSheet={setActiveSheet}
            onUpdateDesign={handleUpdateDesign}
            onPrev={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3Customize
            design={design}
            activeSheet={activeSheet}
            onChangeSheet={setActiveSheet}
            onUpdateDesign={handleUpdateDesign}
            onUpdateSheet={handleUpdateSheet}
            onPrev={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <Step4SaveAndOrder
            design={design}
            activeSheet={activeSheet}
            onChangeSheet={setActiveSheet}
            onSaveProject={handleQuickSave}
            onSubmitOrder={handleSubmitOrder}
            onPrev={() => setStep(3)}
            onStartNew={handleStartNew}
          />
        )}
      </main>

      {/* Footer Branding Notes */}
      <footer className="border-t border-border/80 bg-surface/60 py-4 px-4 sm:px-6 mt-auto">
        <div className="max-w-[92rem] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Xưởng Lịch Tết Việt Nam</span>
            <span>·</span>
            <span>Chuẩn Âm Dương Lịch Hồ Ngọc Đức (UTC+7)</span>
          </div>
          <div className="flex items-center gap-3">
            <span>In Offset 4 Màu · Ép Kim Nhũ Vàng · Giấy Mỹ Thuật</span>
          </div>
        </div>
      </footer>

      {/* Saved Projects & Order History Modal */}
      <SavedProjectsModal
        open={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedProjects={savedProjects}
        orders={orders}
        onLoadProject={handleLoadProject}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <CalendarStudioApp />
    </ErrorBoundary>
  );
}
