import React from 'react';
import { ArrowLeft, ArrowRight, Check, Palette, Layout, Calendar } from 'lucide-react';
import type {
  AccentPaletteId,
  CalendarDesign,
  CalendarLayoutId,
  CalendarStyleId,
  CalendarYear,
} from '../types/calendar';
import { ACCENT_PALETTES, LAYOUTS, PRODUCT_VARIANTS, STYLES } from '../data/calendarCatalog';
import { getCanChiYear } from '../utils/lunarCalendar';
import { CalendarRenderer } from './CalendarRenderer';
import { Button, Surface } from './ui';

interface Step2StyleLayoutProps {
  design: CalendarDesign;
  activeSheet: number;
  onChangeSheet: (sheetIndex: number) => void;
  onUpdateDesign: (patch: Partial<CalendarDesign>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step2StyleLayout: React.FC<Step2StyleLayoutProps> = ({
  design,
  activeSheet,
  onChangeSheet,
  onUpdateDesign,
  onPrev,
  onNext,
}) => {
  const availableLayouts = LAYOUTS.filter((l) => l.calendarType === design.calendarType);
  const currentVariant = PRODUCT_VARIANTS.find((v) => v.id === design.variantId);

  const handleSelectStyle = (styleId: CalendarStyleId) => {
    const matched = STYLES.find((s) => s.id === styleId);
    const accentMatch: Record<CalendarStyleId, AccentPaletteId> = {
      'son-mai-dinh-mui': 'cinnabar',
      'ca-phe-toi-gian': 'amber-gold',
      'dong-ho-di-san': 'cinnabar',
      'dao-xuan-bac-bo': 'cinnabar',
    };
    onUpdateDesign({
      styleId,
      accentId: matched ? accentMatch[styleId] : design.accentId,
    });
  };

  return (
    <section aria-labelledby="step2-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Configuration Panel */}
      <Surface className="lg:col-span-5 p-5 sm:p-6 space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            Bước 2 trên 4: Phong cách &amp; Bố cục
          </div>
          <h1
            id="step2-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-foreground"
          >
            Chọn kiểu &amp; bố cục lịch
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            {currentVariant?.name} · {currentVariant?.sizeLabel}
          </p>
        </div>

        {/* Year Selector */}
        <div className="space-y-2 pt-3 border-t border-border/80">
          <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Năm Âm lịch &amp; Dương lịch</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {([2027, 2026] as CalendarYear[]).map((yr) => {
              const active = design.year === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => onUpdateDesign({ year: yr })}
                  className={`min-h-12 px-3.5 py-2 rounded-control border text-left cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-primary ${
                    active
                      ? 'border-primary bg-primary/10 shadow-xs'
                      : 'border-border bg-surface text-muted hover:text-foreground hover:bg-background'
                  }`}
                >
                  <div className="text-sm font-bold tabular-nums text-foreground flex items-center justify-between">
                    <span>Năm {yr}</span>
                    {active && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                  </div>
                  <div className="text-xs text-muted font-medium mt-0.5">Xuân {getCanChiYear(yr)}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Art Styles */}
        <div className="space-y-2.5 pt-4 border-t border-border/80">
          <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-primary" />
            <span>Phong cách mỹ thuật Tết Việt</span>
          </label>
          <div className="space-y-2">
            {STYLES.map((st) => {
              const active = design.styleId === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleSelectStyle(st.id)}
                  className={`w-full p-3 rounded-control text-left flex items-start justify-between gap-3 cursor-pointer transition-all border focus-visible:outline-2 focus-visible:outline-primary ${
                    active
                      ? 'bg-primary/8 border-primary/40 shadow-xs'
                      : 'bg-surface border-border hover:bg-background'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-control shrink-0 border border-black/20 mt-0.5 flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: st.coverBg }}
                      aria-hidden="true"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: st.secondaryHex }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <span>{st.name}</span>
                      </div>
                      <div className="text-xs text-muted mt-0.5 leading-snug">{st.subtitle}</div>
                    </div>
                  </div>
                  {active && <Check className="w-4 h-4 text-primary shrink-0 mt-1 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Templates */}
        <div className="space-y-2.5 pt-4 border-t border-border/80">
          <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-primary" />
            <span>Bố cục trang ({design.calendarType === 'desk' ? 'Lịch Để Bàn' : 'Lịch Treo Tường'})</span>
          </label>
          <div className="space-y-2">
            {availableLayouts.map((layout) => {
              const active = design.layoutId === layout.id;
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => {
                    onUpdateDesign({ layoutId: layout.id as CalendarLayoutId });
                    if (activeSheet === 0 && layout.id !== 'wall-heritage-duet') {
                      onChangeSheet(1);
                    }
                  }}
                  className={`w-full p-3 rounded-control text-left flex items-start justify-between gap-3 cursor-pointer transition-all border focus-visible:outline-2 focus-visible:outline-primary ${
                    active
                      ? 'bg-primary/8 border-primary/40 shadow-xs'
                      : 'bg-surface border-border hover:bg-background'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground">{layout.name}</div>
                    <div className="text-xs text-muted mt-0.5 leading-snug">{layout.description}</div>
                  </div>
                  {active && <Check className="w-4 h-4 text-primary shrink-0 mt-1 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette Accents */}
        <div className="space-y-2.5 pt-4 border-t border-border/80">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Tông màu chữ &amp; điểm nhấn
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ACCENT_PALETTES.map((pal) => {
              const active = design.accentId === pal.id;
              return (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => onUpdateDesign({ accentId: pal.id })}
                  className={`inline-flex items-center gap-2.5 p-2 rounded-control border text-xs font-semibold cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-primary ${
                    active
                      ? 'border-primary bg-primary/10 text-foreground shadow-2xs'
                      : 'border-border bg-surface text-muted hover:text-foreground hover:bg-background'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-inner"
                    style={{ backgroundColor: pal.primary }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{pal.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-3">
          <Button tone="quiet" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4" />
            <span>Đổi loại lịch</span>
          </Button>
          <Button onClick={onNext} className="shadow-sm">
            <span>Tiếp tục: Tải ảnh &amp; tùy chỉnh</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Surface>

      {/* Right Sticky Preview Stage */}
      <Surface inset className="lg:col-span-7 p-4 sm:p-6 lg:sticky lg:top-24 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-border/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Bản xem trước trực tiếp
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onChangeSheet(0)}
              className={`px-3 py-1 text-xs font-bold rounded-control cursor-pointer transition-colors ${
                activeSheet === 0
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              Xem Trang Bìa
            </button>
            <button
              type="button"
              onClick={() => onChangeSheet(activeSheet === 0 ? 1 : activeSheet)}
              className={`px-3 py-1 text-xs font-bold rounded-control cursor-pointer transition-colors ${
                activeSheet > 0
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              Xem Trang Tháng
            </button>
          </div>
        </div>

        <CalendarRenderer
          design={design}
          activeSheet={activeSheet}
          onChangeSheet={onChangeSheet}
        />
      </Surface>
    </section>
  );
};
