import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  ImagePlus,
  Images,
  RotateCcw,
  Trash2,
  Upload,
  Sparkles,
  Type,
  CalendarDays,
  Image as ImageIcon,
} from 'lucide-react';
import type { CalendarDesign, MonthSheetConfig, SpecialDate } from '../types/calendar';
import { PRESET_GALLERY } from '../data/calendarCatalog';
import { VIETNAMESE_MONTH_NAMES } from '../utils/lunarCalendar';
import { compressImageFile } from '../utils/storage';
import { CalendarRenderer } from './CalendarRenderer';
import { Button, Field, Surface, inputClassName } from './ui';

interface Step3CustomizeProps {
  design: CalendarDesign;
  activeSheet: number;
  onChangeSheet: (sheetIndex: number) => void;
  onUpdateDesign: (patch: Partial<CalendarDesign>) => void;
  onUpdateSheet: (sheetIndex: number, patch: Partial<MonthSheetConfig>) => void;
  onPrev: () => void;
  onNext: () => void;
}

type EditorTab = 'photos' | 'brand' | 'lunar';

const HEADLINE_SUGGESTIONS = [
  'CHÚC MỪNG NĂM MỚI',
  'AN KHANG THỊNH VƯỢNG',
  'VẠN SỰ NHƯ Ý',
  'TÂN NIÊN PHÚ QUÝ',
  'CUNG CHÚC TÂN XUÂN',
  'MÃ ĐÁO THÀNH CÔNG',
];

export const Step3Customize: React.FC<Step3CustomizeProps> = ({
  design,
  activeSheet,
  onChangeSheet,
  onUpdateDesign,
  onUpdateSheet,
  onPrev,
  onNext,
}) => {
  const [tab, setTab] = useState<EditorTab>('photos');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const [newEventMonth, setNewEventMonth] = useState<number>(activeSheet > 0 ? activeSheet : 1);
  const [newEventDay, setNewEventDay] = useState<number>(15);
  const [newEventLabel, setNewEventLabel] = useState<string>('');

  const singleFileRef = useRef<HTMLInputElement>(null);
  const batchFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);

  const currentSheet = design.sheets[activeSheet] ?? design.sheets[0];

  const handleSinglePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError('');
    setUploadStatus('');
    setIsProcessingImage(true);
    try {
      const dataUrl = await compressImageFile(file, 960);
      onUpdateSheet(activeSheet, {
        photoUrl: dataUrl,
        photoLabel: file.name,
        photoZoom: 100,
        photoPosX: 50,
        photoPosY: 50,
      });
      setUploadStatus(`Đã cập nhật ảnh riêng cho ${VIETNAMESE_MONTH_NAMES[activeSheet]}.`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Không thể tải ảnh lên.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleBatchPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    setUploadError('');
    setUploadStatus('');
    setIsProcessingImage(true);
    try {
      const limit = Math.min(files.length, 13);
      const nextSheets = [...design.sheets];
      for (let i = 0; i < limit; i++) {
        const targetIndex = (activeSheet + i) % 13;
        const dataUrl = await compressImageFile(files[i], 880);
        nextSheets[targetIndex] = {
          ...nextSheets[targetIndex],
          photoUrl: dataUrl,
          photoLabel: files[i].name,
          photoZoom: 100,
          photoPosX: 50,
          photoPosY: 50,
        };
      }
      onUpdateDesign({ sheets: nextSheets });
      setUploadStatus(`Đã tự động gán ${limit} ảnh vào các trang lịch từ ${VIETNAMESE_MONTH_NAMES[activeSheet]}.`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Không thể xử lý bộ ảnh.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError('');
    try {
      const dataUrl = await compressImageFile(file, 420);
      onUpdateDesign({ logoUrl: dataUrl });
      setUploadStatus('Đã cập nhật logo thương hiệu.');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Không thể tải logo.');
    }
  };

  const handleAddSpecialDate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newEventLabel.trim();
    if (!trimmed) return;
    const clampedDay = Math.max(1, Math.min(31, Number(newEventDay) || 1));
    const newItem: SpecialDate = {
      id: `sp_${Date.now()}`,
      month: newEventMonth,
      day: clampedDay,
      label: trimmed,
    };
    onUpdateDesign({ specialDates: [...design.specialDates, newItem] });
    setNewEventLabel('');
    onChangeSheet(newEventMonth);
  };

  const handleDeleteSpecialDate = (id: string) => {
    onUpdateDesign({
      specialDates: design.specialDates.filter((d) => d.id !== id),
    });
  };

  return (
    <section aria-labelledby="step3-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Workbench */}
      <Surface className="lg:col-span-5 p-5 sm:p-6 space-y-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            Bước 3 trên 4: Tùy chỉnh chi tiết
          </div>
          <h1 id="step3-heading" className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Tải ảnh &amp; cá nhân hóa
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Chỉnh sửa ảnh 12 tháng, thêm logo thương hiệu, lời chúc xuân và đánh dấu ngày kỷ niệm riêng.
          </p>
        </div>

        {/* 3 Tool Tabs */}
        <div role="tablist" aria-label="Nhóm công cụ tùy chỉnh" className="flex flex-wrap gap-1.5 border-b border-border/80 pb-3">
          {[
            { id: 'photos' as EditorTab, label: 'Ảnh & Khung hình', icon: ImageIcon },
            { id: 'brand' as EditorTab, label: 'Nội dung & Logo', icon: Type },
            { id: 'lunar' as EditorTab, label: 'Lịch Âm & Ngày riêng', icon: CalendarDays },
          ].map((item) => {
            const active = tab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`min-h-10 px-3.5 rounded-control text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-primary ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-background text-muted hover:text-foreground hover:bg-surface'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {uploadError && (
          <p role="alert" className="text-xs sm:text-sm font-semibold text-primary p-2.5 rounded bg-primary/10 border border-primary/20">
            {uploadError}
          </p>
        )}
        {uploadStatus && (
          <p role="status" className="text-xs sm:text-sm font-semibold text-success p-2.5 rounded bg-success/10 border border-success/20">
            {uploadStatus}
          </p>
        )}

        {/* TAB 1: Photos */}
        {tab === 'photos' && (
          <div className="space-y-5">
            <Field label="Trang đang chỉnh sửa" htmlFor="sheet-select">
              <select
                id="sheet-select"
                value={activeSheet}
                onChange={(e) => onChangeSheet(Number(e.target.value))}
                className={inputClassName}
              >
                {VIETNAMESE_MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>
                    {idx === 0 ? 'Trang Bìa (Cover)' : `${name} (${design.year})`}
                  </option>
                ))}
              </select>
            </Field>

            {/* Upload Buttons */}
            <div className="flex flex-wrap gap-2.5">
              <input
                ref={singleFileRef}
                type="file"
                accept="image/*"
                onChange={handleSinglePhotoUpload}
                className="sr-only"
                aria-label="Tải ảnh cho trang đang chọn"
              />
              <Button
                type="button"
                onClick={() => singleFileRef.current?.click()}
                disabled={isProcessingImage}
                className="flex-1 min-w-[170px] shadow-xs"
              >
                <ImagePlus className="w-4 h-4" />
                <span>{isProcessingImage ? 'Đang xử lý...' : `Tải ảnh ${VIETNAMESE_MONTH_NAMES[activeSheet]}`}</span>
              </Button>

              <input
                ref={batchFileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleBatchPhotoUpload}
                className="sr-only"
                aria-label="Tải nhiều ảnh cho nhiều tháng"
              />
              <Button
                type="button"
                tone="quiet"
                onClick={() => batchFileRef.current?.click()}
                disabled={isProcessingImage}
              >
                <Images className="w-4 h-4 text-primary" />
                <span>Tải nhiều ảnh</span>
              </Button>
            </div>

            {/* Interactive Crop & Zoom Sliders */}
            <div className="space-y-3 pt-3 border-t border-border/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Căn chỉnh khung ảnh {VIETNAMESE_MONTH_NAMES[activeSheet]}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSheet(activeSheet, {
                      photoZoom: 100,
                      photoPosX: 50,
                      photoPosY: 50,
                      photoFilter: 'none',
                    })
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-primary cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại</span>
                </button>
              </div>

              <div className="space-y-3 p-3.5 rounded-control bg-background border border-border/70">
                <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
                  <span className="flex justify-between">
                    <span>Phóng to ảnh (Zoom)</span>
                    <span className="tabular-nums font-bold text-primary">{currentSheet.photoZoom}%</span>
                  </span>
                  <input
                    type="range"
                    min={100}
                    max={180}
                    step={2}
                    value={currentSheet.photoZoom}
                    onChange={(e) =>
                      onUpdateSheet(activeSheet, { photoZoom: Number(e.target.value) })
                    }
                    className="w-full accent-primary cursor-pointer"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
                    <span className="flex justify-between">
                      <span>Dịch ngang</span>
                      <span className="tabular-nums text-muted">{currentSheet.photoPosX}%</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={currentSheet.photoPosX}
                      onChange={(e) =>
                        onUpdateSheet(activeSheet, { photoPosX: Number(e.target.value) })
                      }
                      className="w-full accent-primary cursor-pointer"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
                    <span className="flex justify-between">
                      <span>Dịch dọc</span>
                      <span className="tabular-nums text-muted">{currentSheet.photoPosY}%</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={currentSheet.photoPosY}
                      onChange={(e) =>
                        onUpdateSheet(activeSheet, { photoPosY: Number(e.target.value) })
                      }
                      className="w-full accent-primary cursor-pointer"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-medium text-muted mr-1">Bộ lọc màu:</span>
                  {(
                    [
                      { id: 'none', label: 'Nguyên bản' },
                      { id: 'warm', label: 'Nắng ấm Tết' },
                      { id: 'vintage', label: 'Hoài niệm' },
                      { id: 'crisp', label: 'Sắc nét' },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onUpdateSheet(activeSheet, { photoFilter: f.id })}
                      className={`px-2.5 py-1 text-xs rounded-control border cursor-pointer transition-colors ${
                        currentSheet.photoFilter === f.id
                          ? 'border-primary bg-primary text-primary-foreground font-bold shadow-2xs'
                          : 'border-border bg-surface text-muted hover:text-foreground'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Field
              label={`Chú thích / câu chúc cho ${VIETNAMESE_MONTH_NAMES[activeSheet]}`}
              htmlFor="sheet-caption"
            >
              <input
                id="sheet-caption"
                type="text"
                value={currentSheet.caption}
                onChange={(e) => onUpdateSheet(activeSheet, { caption: e.target.value })}
                placeholder="Ví dụ: Xuân sum vầy bên gia đình..."
                className={inputClassName}
              />
            </Field>

            {/* Built-in Cultural Art Presets */}
            <div className="space-y-2 pt-3 border-t border-border/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Kho tranh mỹ thuật văn hóa Tết Việt
                </span>
                <span className="text-[11px] text-primary font-semibold">12 bức tranh theo mùa</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_GALLERY.map((preset) => {
                  const selected = currentSheet.photoUrl === preset.url;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      title={preset.label}
                      onClick={() =>
                        onUpdateSheet(activeSheet, {
                          photoUrl: preset.url,
                          photoLabel: preset.label,
                          caption: preset.caption,
                        })
                      }
                      className={`aspect-[4/3] rounded-control overflow-hidden border cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-primary ${
                        selected
                          ? 'ring-2 ring-primary border-primary shadow-xs scale-102'
                          : 'border-border opacity-85 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Brand & Copy */}
        {tab === 'brand' && (
          <div className="space-y-4">
            <Field label="Tên ấn phẩm lịch" htmlFor="project-name">
              <input
                id="project-name"
                type="text"
                value={design.projectName}
                onChange={(e) => onUpdateDesign({ projectName: e.target.value })}
                className={inputClassName}
              />
            </Field>

            <Field label="Tên gia đình hoặc thương hiệu doanh nghiệp" htmlFor="brand-name">
              <input
                id="brand-name"
                type="text"
                value={design.brandOrFamilyName}
                onChange={(e) => onUpdateDesign({ brandOrFamilyName: e.target.value })}
                placeholder="Ví dụ: Gia Đình An Nhiên hoặc Mộc Nhiên Coffee"
                className={inputClassName}
              />
            </Field>

            <div className="space-y-2">
              <Field label="Tiêu đề / Lời chúc trang bìa" htmlFor="headline-input">
                <input
                  id="headline-input"
                  type="text"
                  value={design.headline}
                  onChange={(e) => onUpdateDesign({ headline: e.target.value })}
                  className={inputClassName}
                />
              </Field>
              <div className="flex flex-wrap gap-1.5">
                {HEADLINE_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onUpdateDesign({ headline: s })}
                    className="px-2.5 py-1 text-xs font-semibold rounded-control border border-border bg-background text-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-border/80">
              <div className="text-sm font-bold text-foreground">Logo thương hiệu (tùy chọn)</div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="sr-only"
                  aria-label="Tải lên logo thương hiệu"
                />
                <Button type="button" tone="quiet" size="sm" onClick={() => logoFileRef.current?.click()}>
                  <Upload className="w-4 h-4 text-primary" />
                  <span>{design.logoUrl ? 'Thay đổi logo' : 'Tải logo lên'}</span>
                </Button>
                {design.logoUrl && (
                  <Button
                    type="button"
                    tone="ghost"
                    size="sm"
                    onClick={() => onUpdateDesign({ logoUrl: '' })}
                  >
                    <Trash2 className="w-4 h-4 text-primary" />
                    <span>Gỡ logo</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/80">
              <label className="flex items-center gap-2.5 text-sm font-semibold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={design.showFooterContact}
                  onChange={(e) => onUpdateDesign({ showFooterContact: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span>Hiển thị dải chân trang (Website · Hotline · Email)</span>
              </label>

              {design.showFooterContact && (
                <div className="space-y-3 p-3.5 rounded-control bg-background border border-border/70">
                  <Field label="Website / Fanpage" htmlFor="footer-web">
                    <input
                      id="footer-web"
                      type="text"
                      value={design.website}
                      onChange={(e) => onUpdateDesign({ website: e.target.value })}
                      className={inputClassName}
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Số điện thoại / Hotline" htmlFor="footer-phone">
                      <input
                        id="footer-phone"
                        type="tel"
                        value={design.phone}
                        onChange={(e) => onUpdateDesign({ phone: e.target.value })}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Email liên hệ" htmlFor="footer-email">
                      <input
                        id="footer-email"
                        type="email"
                        value={design.email}
                        onChange={(e) => onUpdateDesign({ email: e.target.value })}
                        className={inputClassName}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Lunar & Special Dates */}
        {tab === 'lunar' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted">
                Tùy chọn hiển thị lịch Việt Nam
              </div>
              {[
                {
                  key: 'showLunarDates' as const,
                  label: 'Hiển thị ngày Âm lịch (Mùng 1, Rằm, ngày thường)',
                },
                {
                  key: 'showHolidays' as const,
                  label: 'Chú thích các ngày lễ Tết Việt Nam ở cuối trang',
                },
                {
                  key: 'weekStartsOnMonday' as const,
                  label: 'Tuần bắt đầu từ Thứ Hai (T2 – CN)',
                },
                {
                  key: 'bilingualHeaders' as const,
                  label: 'Tiêu đề tháng song ngữ Việt – Anh',
                },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground cursor-pointer py-1 hover:text-primary transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={design[opt.key]}
                    onChange={(e) => onUpdateDesign({ [opt.key]: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Custom Milestone Form */}
            <form
              onSubmit={handleAddSpecialDate}
              className="space-y-3 pt-4 border-t border-border/80"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-muted">
                Đánh dấu ngày kỷ niệm cá nhân / sự kiện công ty
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Tháng" htmlFor="event-month">
                  <select
                    id="event-month"
                    value={newEventMonth}
                    onChange={(e) => setNewEventMonth(Number(e.target.value))}
                    className={inputClassName}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        Tháng {m}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Ngày Dương lịch" htmlFor="event-day">
                  <input
                    id="event-day"
                    type="number"
                    min={1}
                    max={31}
                    value={newEventDay}
                    onChange={(e) => setNewEventDay(Number(e.target.value))}
                    className={inputClassName}
                  />
                </Field>
              </div>
              <div className="flex gap-2 items-end">
                <Field label="Tên sự kiện / ngày kỷ niệm" htmlFor="event-label" className="flex-1">
                  <input
                    id="event-label"
                    type="text"
                    value={newEventLabel}
                    onChange={(e) => setNewEventLabel(e.target.value)}
                    placeholder="Ví dụ: Sinh nhật Mẹ, Ngày thành lập công ty..."
                    className={inputClassName}
                  />
                </Field>
                <Button type="submit" tone="quiet" className="shadow-2xs">
                  <CalendarPlus className="w-4 h-4 text-primary" />
                  <span>Thêm</span>
                </Button>
              </div>
            </form>

            {design.specialDates.length > 0 && (
              <div className="pt-2 border-t border-border/70 divide-y divide-border/70">
                {design.specialDates.map((item) => (
                  <div
                    key={item.id}
                    className="py-2 flex items-center justify-between gap-2 text-xs sm:text-sm"
                  >
                    <button
                      type="button"
                      onClick={() => onChangeSheet(item.month)}
                      className="text-left hover:text-primary cursor-pointer min-w-0 truncate"
                    >
                      <span className="font-bold text-primary tabular-nums">
                        {String(item.day).padStart(2, '0')}/{String(item.month).padStart(2, '0')}
                      </span>
                      <span className="mx-1.5 text-muted">·</span>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSpecialDate(item.id)}
                      aria-label={`Xóa sự kiện ${item.label}`}
                      className="p-1.5 text-muted hover:text-primary cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-3">
          <Button tone="quiet" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4" />
            <span>Chọn kiểu &amp; bố cục</span>
          </Button>
          <Button onClick={onNext} className="shadow-sm">
            <span>Tiếp tục: Lưu &amp; đặt in</span>
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
              Bản xem trước thiết kế · {VIETNAMESE_MONTH_NAMES[activeSheet]}
            </span>
          </div>
          <span className="text-xs font-semibold text-muted">
            {design.calendarType === 'desk' ? 'Lịch Để Bàn' : 'Lịch Treo Tường'} · Năm {design.year}
          </span>
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
