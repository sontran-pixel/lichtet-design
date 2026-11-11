import React from 'react';
import { ArrowRight, Check, Sparkles, Award, ShieldCheck, Clock } from 'lucide-react';
import type { CalendarDesign, CalendarType } from '../types/calendar';
import {
  DESK_PREVIEW_SVG,
  formatVnd,
  PRODUCT_VARIANTS,
  WALL_PREVIEW_SVG,
} from '../data/calendarCatalog';
import { Button, Surface } from './ui';

interface Step1TypeSelectProps {
  design: CalendarDesign;
  onSelectTypeAndVariant: (calendarType: CalendarType, variantId: string) => void;
  onNext: () => void;
}

const PRODUCT_SHOWCASE: Array<{
  type: CalendarType;
  title: string;
  badge: string;
  tagline: string;
  imageSrc: string;
  imageAlt: string;
  highlights: string[];
  dimensions: string;
  binding: string;
}> = [
  {
    type: 'desk',
    title: 'Lịch Để Bàn Tết (Đế Chữ A)',
    badge: '★ Lựa chọn phổ biến nhất cho văn phòng & quà tặng',
    tagline: 'Gọn gàng trên bàn làm việc, gáy lò xo xoắn kép ánh kim, thiết kế 2 mặt hiển thị ngày Âm & Dương.',
    imageSrc: DESK_PREVIEW_SVG,
    imageAlt: 'Mẫu lịch để bàn Tết 2027 đế chữ A gáy lò xo',
    dimensions: '21 × 15 cm hoặc 24 × 18 cm',
    binding: 'Gáy lò xo kép, đế chữ A bồi carton mỹ thuật',
    highlights: [
      'Đế chữ A cứng cáp bồi giấy mỹ thuật đỏ đô hoặc nâu sẫm',
      'Lò xo kép ánh đồng/vàng cao cấp, lật trang êm và phẳng phiu',
      'Hiển thị song song ngày Dương, ngày Âm lịch & ngày hoàng đạo',
      'Thích hợp in logo doanh nghiệp, ảnh gia đình, tranh kỷ niệm',
    ],
  },
  {
    type: 'wall',
    title: 'Lịch Treo Tường Tết (Nẹp Kẹp / Lò Xo)',
    badge: '★ Sang trọng cho phòng khách & sảnh doanh nghiệp',
    tagline: 'Tôn vinh tranh ảnh khổ lớn, nẹp kẹp thép chắc chắn hoặc lò xo giữa kèm thanh thương hiệu chân trang.',
    imageSrc: WALL_PREVIEW_SVG,
    imageAlt: 'Mẫu lịch treo tường Tết nẹp kẹp 13 tờ kèm trang bìa và trang tháng',
    dimensions: '35 × 50 cm hoặc 40 × 60 cm',
    binding: 'Nẹp kẹp thép ánh kim hoặc lò xo giữa có móc treo',
    highlights: [
      'Khổ đứng lớn sắc nét, màu sắc in offset 4 màu sống động',
      'Tùy chọn 7 tờ (2 tháng/tờ) tiết kiệm hoặc 13 tờ (1 tháng/tờ) cao cấp',
      'Thanh chân trang in rõ website, hotline, địa chỉ hoặc lời chúc',
      'Đầy đủ ngày rằm, mùng 1, tiết khí và các ngày lễ Việt Nam',
    ],
  },
];

export const Step1TypeSelect: React.FC<Step1TypeSelectProps> = ({
  design,
  onSelectTypeAndVariant,
  onNext,
}) => {
  return (
    <section aria-labelledby="step1-heading" className="space-y-6">
      {/* Hero Intro Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/80">
        <div className="space-y-1.5 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bước 1 trên 4: Khởi tạo quy cách ấn phẩm</span>
          </div>
          <h1
            id="step1-heading"
            className="font-display text-[length:var(--text-display)] font-bold tracking-tight text-foreground"
          >
            Chọn loại lịch Tết bạn muốn thiết kế
          </h1>
          <p className="text-sm sm:text-base text-muted">
            Chọn kiểu dáng lịch để bàn đế chữ A tiện dụng hoặc lịch treo tường khổ lớn truyền thống, kèm các quy cách kích thước tiêu chuẩn của xưởng in.
          </p>
        </div>
        <Button onClick={onNext} className="shrink-0 shadow-sm">
          <span>Tiếp tục: Chọn kiểu &amp; bố cục</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted">
        <div className="flex items-center gap-2 p-2.5 rounded-control bg-surface border border-border">
          <Award className="w-4 h-4 text-primary shrink-0" />
          <span>Chuẩn Âm lịch Việt Nam UTC+7 tính tự động</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-control bg-surface border border-border">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>Giấy Couche Matt &amp; Mỹ Thuật chống lóa mắt</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-control bg-surface border border-border">
          <Clock className="w-4 h-4 text-primary shrink-0" />
          <span>Duyệt mẫu trước khi in &amp; xuất file PNG tức thì</span>
        </div>
      </div>

      {/* Showcase Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PRODUCT_SHOWCASE.map((item) => {
          const isSelectedType = design.calendarType === item.type;
          const variants = PRODUCT_VARIANTS.filter((v) => v.calendarType === item.type);

          return (
            <Surface
              key={item.type}
              className={`overflow-hidden flex flex-col transition-all duration-200 ${
                isSelectedType
                  ? 'ring-2 ring-primary border-primary shadow-md'
                  : 'hover:border-primary/50'
              }`}
            >
              {/* Product Mockup Header Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
                />
                <div className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-xs text-amber-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-amber-400/30">
                  {item.badge}
                </div>
                {isSelectedType && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Đang chọn</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                      {item.title}
                    </h2>
                    <p className="text-sm text-muted mt-1 leading-relaxed">{item.tagline}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-control bg-background border border-border/70">
                    <div>
                      <span className="text-muted block">Kích thước:</span>
                      <strong className="text-foreground">{item.dimensions}</strong>
                    </div>
                    <div>
                      <span className="text-muted block">Gia công:</span>
                      <strong className="text-foreground">{item.binding}</strong>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/85 pt-1">
                    {item.highlights.map((line) => (
                      <li key={line} className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">✔</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Variant Selector */}
                <div className="pt-4 border-t border-border/70 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">
                    Chọn kích thước &amp; số tờ đặt in
                  </div>
                  <div className="divide-y divide-border/70">
                    {variants.map((variant) => {
                      const active = design.variantId === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => onSelectTypeAndVariant(item.type, variant.id)}
                          className={`w-full py-3 px-3 rounded-control text-left flex items-center justify-between gap-3 cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-primary ${
                            active
                              ? 'bg-primary/10 border border-primary/30 text-foreground'
                              : 'hover:bg-background border border-transparent'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-foreground flex items-center gap-2">
                              <span
                                className={`inline-flex w-4 h-4 rounded-full border items-center justify-center shrink-0 ${
                                  active ? 'border-primary bg-primary text-white' : 'border-border'
                                }`}
                              >
                                {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </span>
                              <span className="truncate">{variant.name}</span>
                            </div>
                            <div className="text-xs text-muted pl-6 mt-0.5">
                              {variant.sizeLabel} · {variant.sheetCountLabel}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold text-primary tabular-nums">
                              {formatVnd(variant.basePriceVnd)}
                            </div>
                            <span className="text-[10px] text-muted">giá từ 1 cuốn</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Surface>
          );
        })}
      </div>
    </section>
  );
};
