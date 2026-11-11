import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Globe, Mail, Phone, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import type { CalendarDesign } from '../types/calendar';
import { ACCENT_PALETTES, STYLES } from '../data/calendarCatalog';
import {
  buildMonthCalendarGrid,
  type CalendarDayCell,
  ENGLISH_MONTH_NAMES,
  getCanChiYear,
  VIETNAMESE_MONTH_NAMES,
} from '../utils/lunarCalendar';
import { DongSonWatermark, HoaMaiCorner, SpiralCoilRow, WallClipsRow, ZodiacSeal } from './TetMotifs';

interface CalendarRendererProps {
  design: CalendarDesign;
  activeSheet: number;
  onChangeSheet: (sheetIndex: number) => void;
  compact?: boolean;
}

const FILTER_MAP: Record<string, string> = {
  none: 'none',
  warm: 'sepia(0.18) saturate(1.18) brightness(1.02)',
  vintage: 'sepia(0.30) contrast(0.95) brightness(0.97)',
  crisp: 'contrast(1.12) saturate(1.10)',
};

export const CalendarRenderer: React.FC<CalendarRendererProps> = ({
  design,
  activeSheet,
  onChangeSheet,
  compact = false,
}) => {
  const style = STYLES.find((s) => s.id === design.styleId) ?? STYLES[0];
  const accent = ACCENT_PALETTES.find((a) => a.id === design.accentId) ?? ACCENT_PALETTES[0];
  const sheet = design.sheets[activeSheet] ?? design.sheets[0];
  const isDesk = design.calendarType === 'desk';
  const stripScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stripScrollRef.current) {
      const activeBtn = stripScrollRef.current.querySelector<HTMLButtonElement>(`[data-sheet="${activeSheet}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeSheet]);

  const photoStyle: React.CSSProperties = {
    objectFit: 'cover',
    objectPosition: `${sheet.photoPosX}% ${sheet.photoPosY}%`,
    transform: `scale(${sheet.photoZoom / 100})`,
    filter: FILTER_MAP[sheet.photoFilter] ?? 'none',
    transition: 'transform 150ms ease-out',
  };

  const renderFooterStrip = (isCoverContext: boolean) => {
    if (!design.showFooterContact) return null;
    const bg = isCoverContext ? '#1A0E0B' : style.footerBg;
    const fg = isCoverContext ? '#FDE8C7' : style.footerText;
    return (
      <div
        className="w-full px-3 py-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-medium shrink-0 border-t border-black/10"
        style={{ backgroundColor: bg, color: fg }}
      >
        <span className="inline-flex items-center gap-1.5 min-w-0 truncate">
          <Globe className="w-3 h-3 shrink-0 opacity-80" aria-hidden="true" />
          <span className="truncate">{design.website || design.brandOrFamilyName}</span>
        </span>
        {design.phone && (
          <span className="inline-flex items-center gap-1.5 shrink-0 tabular-nums">
            <Phone className="w-3 h-3 shrink-0 opacity-80" aria-hidden="true" />
            <span>{design.phone}</span>
          </span>
        )}
        {design.email && (
          <span className="inline-flex items-center gap-1.5 min-w-0 truncate hidden sm:inline-flex">
            <Mail className="w-3 h-3 shrink-0 opacity-80" aria-hidden="true" />
            <span className="truncate">{design.email}</span>
          </span>
        )}
      </div>
    );
  };

  const renderCoverSheet = (coverSheet = design.sheets[0], ratioClass: string) => {
    const coverImgStyle: React.CSSProperties = {
      objectFit: 'cover',
      objectPosition: `${coverSheet.photoPosX}% ${coverSheet.photoPosY}%`,
      transform: `scale(${coverSheet.photoZoom / 100})`,
      filter: FILTER_MAP[coverSheet.photoFilter] ?? 'none',
    };

    const isLightCover = style.id === 'dong-ho-di-san';

    return (
      <div
        className={`relative w-full overflow-hidden flex flex-col justify-between shadow-inner ${ratioClass}`}
        style={{ backgroundColor: style.coverBg, color: style.coverText }}
      >
        {/* Background photo */}
        <img
          src={coverSheet.photoUrl}
          alt={coverSheet.photoLabel || 'Ảnh bìa lịch Tết'}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full"
          style={coverImgStyle}
        />

        {/* Traditional gradient veil */}
        <div
          className="absolute inset-0"
          style={{
            background: isLightCover
              ? 'linear-gradient(180deg, rgba(244,235,220,0.92) 0%, rgba(244,235,220,0.48) 50%, rgba(68,18,14,0.85) 100%)'
              : 'linear-gradient(180deg, rgba(26,10,9,0.78) 0%, rgba(26,10,9,0.32) 52%, rgba(20,8,8,0.84) 100%)',
          }}
        />

        {/* Dong Son Bronze Drum Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.14] text-white">
          <DongSonWatermark className="w-72 h-72 sm:w-96 sm:h-96" />
        </div>

        {/* Traditional golden apricot blossom corner motif */}
        {style.motifType === 'mai-vang' && (
          <HoaMaiCorner
            color={accent.secondary}
            className="absolute -top-2 -left-2 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none opacity-95 drop-shadow-md"
          />
        )}

        {/* Main Cover Typography Content */}
        <div className="relative z-10 p-5 sm:p-7 flex flex-col items-center text-center gap-1.5 my-auto">
          {design.logoUrl ? (
            <img
              src={design.logoUrl}
              alt="Logo thương hiệu"
              referrerPolicy="no-referrer"
              className="h-10 sm:h-12 w-auto object-contain mb-1 drop-shadow-md"
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 mb-1">
              <ZodiacSeal year={design.year} accentColor={isLightCover ? accent.primary : accent.secondary} />
            </div>
          )}

          <p
            className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase"
            style={{ color: isLightCover ? accent.primary : '#FDE6B0' }}
          >
            {design.brandOrFamilyName}
          </p>

          <h3
            className="font-display text-xl sm:text-3xl font-semibold tracking-wide leading-tight mt-1 text-balance drop-shadow-sm"
            style={{ color: isLightCover ? '#3D110F' : '#FFFFFF' }}
          >
            {design.headline}
          </h3>

          <div className="flex items-center justify-center gap-3 mt-1">
            <span
              className="font-display text-5xl sm:text-7xl font-bold leading-none tabular-nums tracking-tight drop-shadow-md"
              style={{
                color: isLightCover ? accent.primary : accent.secondary,
                textShadow: isLightCover ? 'none' : '0 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              {design.year}
            </span>
            <div className="flex flex-col items-start border-l-2 pl-2 text-left"
              style={{
                borderColor: isLightCover ? 'rgba(78,29,26,0.4)' : 'rgba(252,231,178,0.5)',
              }}
            >
              <span
                className="text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                style={{ color: isLightCover ? '#4E1D1A' : '#FCE7B2' }}
              >
                XUÂN {getCanChiYear(design.year)}
              </span>
              <span className="text-[9px] sm:text-[10px] opacity-80"
                style={{ color: isLightCover ? '#4E1D1A' : '#FDE8C7' }}
              >
                Tân Niên Vạn Phúc
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          {coverSheet.caption && (
            <p className="px-5 pb-3 text-center text-xs font-medium text-white/95 drop-shadow-sm">
              {coverSheet.caption}
            </p>
          )}
          {renderFooterStrip(true)}
        </div>
      </div>
    );
  };

  const renderDateMatrix = (monthIndex: number, dense = false) => {
    const { cells, monthHolidays } = buildMonthCalendarGrid(
      design.year,
      monthIndex,
      design.weekStartsOnMonday
    );
    const weekdayLabels = design.weekStartsOnMonday
      ? design.bilingualHeaders
        ? ['T2 · MON', 'T3 · TUE', 'T4 · WED', 'T5 · THU', 'T6 · FRI', 'T7 · SAT', 'CN · SUN']
        : ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
      : design.bilingualHeaders
      ? ['CN · SUN', 'T2 · MON', 'T3 · TUE', 'T4 · WED', 'T5 · THU', 'T6 · FRI', 'T7 · SAT']
      : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const specialForMonth = design.specialDates.filter((s) => s.month === monthIndex);

    return (
      <div className="flex flex-col flex-1 min-h-0 justify-between">
        <div>
          {/* Weekday Row */}
          <div
            className="grid grid-cols-7 border-b pb-1.5 mb-1.5 text-center"
            style={{ borderColor: `${accent.primary}35` }}
          >
            {weekdayLabels.map((label, idx) => {
              const isWeekend = design.weekStartsOnMonday ? idx >= 5 : idx === 0 || idx === 6;
              return (
                <div
                  key={label}
                  className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase"
                  style={{ color: isWeekend ? accent.primary : style.sheetText }}
                >
                  {label}
                </div>
              );
            })}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {cells.map((cell: CalendarDayCell, idx: number) => {
              const isWeekend = cell.dayOfWeek === 0 || cell.dayOfWeek === 6;
              const personalEvent = cell.inCurrentMonth
                ? specialForMonth.find((sp) => sp.day === cell.solarDay)
                : undefined;

              return (
                <div
                  key={idx}
                  title={
                    cell.inCurrentMonth
                      ? [cell.holidayName, personalEvent?.label, `${cell.lunar.day}/${cell.lunar.month} Âm lịch`]
                          .filter(Boolean)
                          .join(' · ')
                      : undefined
                  }
                  className={`relative flex flex-col items-center justify-center rounded transition-colors ${
                    dense ? 'py-0.5' : 'py-1'
                  } ${cell.inCurrentMonth ? 'opacity-100 hover:bg-black/5' : 'opacity-25'}`}
                  style={
                    personalEvent
                      ? { backgroundColor: `${accent.secondary}22`, borderRadius: '4px' }
                      : undefined
                  }
                >
                  <span
                    className={`tabular-nums font-semibold leading-none ${
                      dense ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                    }`}
                    style={{
                      color:
                        (cell.isHolidayRed || isWeekend) && cell.inCurrentMonth
                          ? accent.primary
                          : style.sheetText,
                    }}
                  >
                    {cell.solarDay}
                  </span>
                  {design.showLunarDates && (
                    <span
                      className="tabular-nums text-[8px] sm:text-[9px] leading-tight mt-0.5"
                      style={{
                        color:
                          cell.isFirstOfLunarMonth || cell.isFullMoon
                            ? accent.primary
                            : 'rgba(65, 50, 42, 0.70)',
                        fontWeight: cell.isFirstOfLunarMonth ? 700 : 500,
                      }}
                    >
                      {cell.lunarLabel}
                    </span>
                  )}
                  {personalEvent && (
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-0.5"
                      style={{ backgroundColor: accent.primary }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Holidays and Personal Special Notes Strip */}
        {(design.showHolidays && monthHolidays.length > 0) || specialForMonth.length > 0 ? (
          <div
            className="mt-2 pt-1.5 border-t text-[9px] sm:text-[10px] leading-relaxed flex flex-wrap gap-x-3 gap-y-1"
            style={{ borderColor: `${accent.primary}25`, color: 'rgba(55, 42, 36, 0.85)' }}
          >
            {design.showHolidays &&
              monthHolidays.slice(0, 2).map((h) => (
                <span key={`${h.solarDay}-${h.name}`} className="truncate inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent.primary }} />
                  <strong style={{ color: accent.primary }}>
                    {h.solarDay}/{monthIndex}
                  </strong>{' '}
                  <span className="text-muted">({h.lunarLabel}):</span> {h.name}
                </span>
              ))}
            {specialForMonth.slice(0, 2).map((sp) => (
              <span key={sp.id} className="truncate font-medium inline-flex items-center gap-1" style={{ color: accent.primary }}>
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>{sp.day}/{monthIndex}: {sp.label}</span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  const renderMonthTitleBlock = (monthIndex: number, showHexBadge = false) => {
    const primaryName = design.bilingualHeaders
      ? ENGLISH_MONTH_NAMES[monthIndex]
      : VIETNAMESE_MONTH_NAMES[monthIndex];
    const subName = design.bilingualHeaders
      ? `${VIETNAMESE_MONTH_NAMES[monthIndex]} · ${design.year}`
      : `${ENGLISH_MONTH_NAMES[monthIndex]} · ${design.year}`;

    return (
      <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-black/5">
        <div className="min-w-0">
          <div
            className="font-display text-xl sm:text-2xl font-bold leading-none tracking-tight"
            style={{ color: accent.primary }}
          >
            {primaryName}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1 font-medium">
            {subName} · {getCanChiYear(design.year)}
          </div>
        </div>

        {showHexBadge ? (
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center drop-shadow-sm">
            <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
              <polygon
                points="20,2 36,11 36,29 20,38 4,29 4,11"
                fill={accent.secondary}
              />
            </svg>
            <span className="absolute text-sm font-bold text-white tabular-nums">
              {String(monthIndex).padStart(2, '0')}
            </span>
          </div>
        ) : (
          <div
            className="text-2xl sm:text-3xl font-display font-bold tabular-nums leading-none"
            style={{ color: accent.secondary }}
          >
            {String(monthIndex).padStart(2, '0')}
          </div>
        )}
      </div>
    );
  };

  const renderDeskMonthlySheet = (monthIndex: number) => {
    const layout = design.layoutId;

    if (layout === 'desk-top-photo') {
      return (
        <div
          className="w-full aspect-[1.4/1] flex flex-col justify-between overflow-hidden relative shadow-inner"
          style={{ backgroundColor: style.sheetBg, color: style.sheetText }}
        >
          <div className="relative h-[44%] w-full overflow-hidden border-b border-black/10">
            <img
              src={sheet.photoUrl}
              alt={sheet.photoLabel}
              referrerPolicy="no-referrer"
              className="w-full h-full"
              style={photoStyle}
            />
            {sheet.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent px-3.5 py-1.5 text-[11px] text-white font-medium">
                {sheet.caption}
              </div>
            )}
          </div>
          <div className="flex-1 min-h-0 px-4 py-2.5 flex flex-col">
            {renderMonthTitleBlock(monthIndex, false)}
            {renderDateMatrix(monthIndex, true)}
          </div>
          {renderFooterStrip(false)}
        </div>
      );
    }

    if (layout === 'desk-classic-frame') {
      return (
        <div
          className="w-full aspect-[1.4/1] flex flex-col justify-between overflow-hidden shadow-inner"
          style={{ backgroundColor: style.sheetBg, color: style.sheetText }}
        >
          <div className="flex-1 min-h-0 grid grid-cols-12 gap-3.5 p-3.5 sm:p-5">
            <div className="col-span-5 flex flex-col gap-2 min-h-0">
              <div
                className="relative flex-1 min-h-0 overflow-hidden rounded-sm border-2 p-1 bg-white shadow-sm"
                style={{ borderColor: accent.secondary }}
              >
                <img
                  src={sheet.photoUrl}
                  alt={sheet.photoLabel}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-[2px]"
                  style={photoStyle}
                />
              </div>
              <p className="text-[11px] text-center font-medium text-neutral-600 line-clamp-1">
                {sheet.caption || design.brandOrFamilyName}
              </p>
            </div>
            <div className="col-span-7 flex flex-col min-h-0">
              {renderMonthTitleBlock(monthIndex, true)}
              {renderDateMatrix(monthIndex, true)}
            </div>
          </div>
          {renderFooterStrip(false)}
        </div>
      );
    }

    if (layout === 'desk-editorial-notes') {
      return (
        <div
          className="w-full aspect-[1.4/1] flex flex-col justify-between overflow-hidden shadow-inner"
          style={{ backgroundColor: style.sheetBg, color: style.sheetText }}
        >
          <div className="flex-1 min-h-0 grid grid-cols-12 gap-3.5 p-3.5 sm:p-5">
            <div className="col-span-7 flex flex-col min-h-0">
              {renderMonthTitleBlock(monthIndex, false)}
              {renderDateMatrix(monthIndex, false)}
            </div>
            <div className="col-span-5 flex flex-col gap-2 min-h-0">
              <div className="relative flex-1 min-h-0 overflow-hidden rounded-sm shadow-sm">
                <img
                  src={sheet.photoUrl}
                  alt={sheet.photoLabel}
                  referrerPolicy="no-referrer"
                  className="w-full h-full"
                  style={photoStyle}
                />
              </div>
              <div
                className="border-t pt-1.5 text-[11px] leading-snug"
                style={{ borderColor: `${accent.primary}30` }}
              >
                <div className="font-bold" style={{ color: accent.primary }}>
                  {design.brandOrFamilyName}
                </div>
                <div className="text-neutral-600 line-clamp-2 mt-0.5">{sheet.caption}</div>
              </div>
            </div>
          </div>
          {renderFooterStrip(false)}
        </div>
      );
    }

    // Default: desk-split-curve (inspired by physical desk calendar 2027)
    return (
      <div
        className="w-full aspect-[1.4/1] flex flex-col justify-between overflow-hidden relative shadow-inner"
        style={{ backgroundColor: style.sheetBg, color: style.sheetText }}
      >
        <div className="flex-1 min-h-0 grid grid-cols-12 overflow-hidden">
          <div className="col-span-7 p-3.5 sm:p-5 flex flex-col min-h-0 relative z-10">
            <div className="flex items-baseline justify-between gap-2 mb-2 pb-1 border-b border-black/5">
              <div>
                <span
                  className="text-[10px] font-bold tracking-widest uppercase block"
                  style={{ color: accent.primary }}
                >
                  {design.bilingualHeaders ? ENGLISH_MONTH_NAMES[monthIndex] : `NĂM ${design.year} · ${getCanChiYear(design.year)}`}
                </span>
                <h3
                  className="font-display text-xl sm:text-2xl font-bold leading-none mt-0.5"
                  style={{ color: accent.primary }}
                >
                  {VIETNAMESE_MONTH_NAMES[monthIndex]}
                </h3>
              </div>
              {design.logoUrl && (
                <img
                  src={design.logoUrl}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="h-7 w-auto object-contain"
                />
              )}
            </div>
            {renderDateMatrix(monthIndex, true)}
          </div>

          <div className="col-span-5 relative overflow-hidden">
            <div
              className="absolute inset-y-2.5 right-2.5 left-0 overflow-hidden border-l-[3px] shadow-sm"
              style={{
                borderColor: accent.secondary,
                borderTopLeftRadius: '999px',
                borderBottomLeftRadius: '999px',
              }}
            >
              <img
                src={sheet.photoUrl}
                alt={sheet.photoLabel}
                referrerPolicy="no-referrer"
                className="w-full h-full"
                style={photoStyle}
              />
            </div>
          </div>
        </div>
        {renderFooterStrip(false)}
      </div>
    );
  };

  const renderWallMonthlySheet = (monthIndex: number) => {
    const layout = design.layoutId;

    if (layout === 'wall-arch-portrait') {
      return (
        <div
          className="w-full aspect-[0.7/1] flex flex-col justify-between overflow-hidden shadow-inner"
          style={{ backgroundColor: style.sheetBg, color: style.sheetText }}
        >
          <div className="p-4 pb-1 h-[50%] flex flex-col">
            <div
              className="flex-1 min-h-0 overflow-hidden border-2 shadow-sm"
              style={{
                borderColor: accent.secondary,
                borderTopLeftRadius: '999px',
                borderTopRightRadius: '999px',
              }}
            >
              <img
                src={sheet.photoUrl}
                alt={sheet.photoLabel}
                referrerPolicy="no-referrer"
                className="w-full h-full"
                style={photoStyle}
              />
            </div>
          </div>
          <div className="flex-1 min-h-0 px-5 py-3 flex flex-col">
            {renderMonthTitleBlock(monthIndex, true)}
            {renderDateMatrix(monthIndex, false)}
          </div>
          {renderFooterStrip(false)}
        </div>
      );
    }

    if (layout === 'wall-full-bleed-poster') {
      return (
        <div
          className="w-full aspect-[0.7/1] flex flex-col justify-between overflow-hidden shadow-inner"
          style={{ backgroundColor: style.sheetBg, color: style.sheetText }}
        >
          <div className="relative h-[56%] w-full overflow-hidden border-b border-black/10">
            <img
              src={sheet.photoUrl}
              alt={sheet.photoLabel}
              referrerPolicy="no-referrer"
              className="w-full h-full"
              style={photoStyle}
            />
            {sheet.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent px-5 py-2 text-xs text-white font-medium">
                {sheet.caption}
              </div>
            )}
          </div>
          <div className="flex-1 min-h-0 px-5 py-3 flex flex-col">
            {renderMonthTitleBlock(monthIndex, false)}
            {renderDateMatrix(monthIndex, true)}
          </div>
          {renderFooterStrip(false)}
        </div>
      );
    }

    return (
      <div
        className="w-full aspect-[0.7/1] flex flex-col justify-between overflow-hidden shadow-inner"
        style={{ backgroundColor: style.sheetBg, color: style.sheetText }}
      >
        <div className="relative h-[48%] w-full overflow-hidden border-b border-black/10">
          <img
            src={sheet.photoUrl}
            alt={sheet.photoLabel}
            referrerPolicy="no-referrer"
            className="w-full h-full"
            style={photoStyle}
          />
        </div>
        <div className="flex-1 min-h-0 px-5 py-3 flex flex-col">
          {renderMonthTitleBlock(monthIndex, true)}
          {renderDateMatrix(monthIndex, false)}
        </div>
        {renderFooterStrip(false)}
      </div>
    );
  };

  const isWallDuet = !isDesk && design.layoutId === 'wall-heritage-duet' && !compact;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Visual Realistic Stage */}
      <div className="w-full flex items-center justify-center py-2 sm:py-3">
        {isDesk ? (
          <div className="w-full max-w-[560px] flex flex-col items-center group">
            {/* Double-loop spiral rings */}
            <SpiralCoilRow count={compact ? 15 : 20} ringColor={accent.secondary} />
            {/* The calendar page surface */}
            <div
              className="relative z-10 w-full rounded-sm overflow-hidden border border-black/20"
              style={{
                boxShadow:
                  '0 18px 38px -12px rgba(45, 15, 10, 0.35), 0 4px 10px rgba(0, 0, 0, 0.15)',
              }}
            >
              {activeSheet === 0
                ? renderCoverSheet(sheet, 'aspect-[1.4/1]')
                : renderDeskMonthlySheet(activeSheet)}
            </div>
            {/* Physical Triangular A-frame Stand Base */}
            <div
              className="w-[96%] h-6 sm:h-7 rounded-b-md border-x border-b border-black/35 flex items-center justify-between px-4"
              style={{
                background: 'linear-gradient(180deg, #5A1417 0%, #2A0608 100%)',
                boxShadow: '0 8px 18px rgba(0,0,0,0.3)',
              }}
              aria-hidden="true"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-200/50">
                Xưởng Lịch Việt Nam · {design.year}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            </div>
          </div>
        ) : isWallDuet ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col items-center">
              <WallClipsRow />
              <div
                className="w-full overflow-hidden border border-black/20 rounded-xs"
                style={{ boxShadow: '0 16px 32px -10px rgba(0,0,0,0.3)' }}
              >
                {renderCoverSheet(design.sheets[0], 'aspect-[0.7/1]')}
              </div>
              <span className="mt-2 text-xs font-semibold text-muted">Trang Bìa</span>
            </div>
            <div className="flex flex-col items-center">
              <WallClipsRow />
              <div
                className="w-full overflow-hidden border border-black/20 rounded-xs"
                style={{ boxShadow: '0 16px 32px -10px rgba(0,0,0,0.3)' }}
              >
                {renderWallMonthlySheet(activeSheet === 0 ? 1 : activeSheet)}
              </div>
              <span className="mt-2 text-xs font-semibold text-muted">
                {VIETNAMESE_MONTH_NAMES[activeSheet === 0 ? 1 : activeSheet]}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[400px] flex flex-col items-center">
            <WallClipsRow />
            <div
              className="relative z-10 w-full overflow-hidden border border-black/20 rounded-xs"
              style={{
                boxShadow:
                  '0 20px 42px -14px rgba(45, 15, 10, 0.4), 0 4px 12px rgba(0, 0, 0, 0.16)',
              }}
            >
              {activeSheet === 0
                ? renderCoverSheet(sheet, 'aspect-[0.7/1]')
                : renderWallMonthlySheet(activeSheet)}
            </div>
          </div>
        )}
      </div>

      {/* Visual Sheet Filmstrip Carousel */}
      {!compact && (
        <div className="w-full space-y-2 pt-3 border-t border-border/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChangeSheet(activeSheet === 0 ? 12 : activeSheet - 1)}
                aria-label="Trang trước"
                className="inline-flex items-center justify-center w-8 h-8 rounded-control border border-border bg-surface text-foreground hover:bg-background focus-visible:outline-2 focus-visible:outline-primary cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground">
                <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                <span>{VIETNAMESE_MONTH_NAMES[activeSheet]}</span>
                {activeSheet > 0 && <span className="text-muted font-normal">({ENGLISH_MONTH_NAMES[activeSheet]})</span>}
              </div>
              <button
                type="button"
                onClick={() => onChangeSheet(activeSheet === 12 ? 0 : activeSheet + 1)}
                aria-label="Trang tiếp theo"
                className="inline-flex items-center justify-center w-8 h-8 rounded-control border border-border bg-surface text-foreground hover:bg-background focus-visible:outline-2 focus-visible:outline-primary cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs text-muted tabular-nums">
              Trang <strong>{activeSheet + 1}</strong> / 13
            </span>
          </div>

          {/* Visual Mini Thumbnails Strip */}
          <div
            ref={stripScrollRef}
            className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin py-1 px-0.5"
          >
            {design.sheets.map((s, idx) => {
              const isActive = activeSheet === idx;
              return (
                <button
                  key={idx}
                  data-sheet={idx}
                  type="button"
                  onClick={() => onChangeSheet(idx)}
                  className={`group relative shrink-0 flex flex-col items-center rounded-control transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
                    isActive
                      ? 'ring-2 ring-primary ring-offset-2 scale-105'
                      : 'opacity-70 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  <div
                    className={`w-14 sm:w-16 ${
                      isDesk ? 'aspect-[1.4/1]' : 'aspect-[0.7/1]'
                    } rounded-sm overflow-hidden border border-black/20 bg-neutral-200 shadow-2xs`}
                  >
                    <img
                      src={s.photoUrl}
                      alt={s.photoLabel || `Trang ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-bold whitespace-nowrap ${
                      isActive ? 'text-primary' : 'text-muted'
                    }`}
                  >
                    {idx === 0 ? 'Bìa' : `Th ${idx}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
