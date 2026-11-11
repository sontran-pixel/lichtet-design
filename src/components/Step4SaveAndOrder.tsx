import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Printer,
  Save,
  Sparkles,
  Package,
  Gift,
  FileCheck,
} from 'lucide-react';
import type { CalendarDesign, PaperStockId, PrintOrderItem } from '../types/calendar';
import {
  formatVnd,
  getUnitPriceWithTier,
  LAYOUTS,
  PAPER_STOCKS,
  PRODUCT_VARIANTS,
  STYLES,
} from '../data/calendarCatalog';
import { VIETNAMESE_MONTH_NAMES } from '../utils/lunarCalendar';
import { exportCalendarSheetPng } from '../utils/exportCalendarPng';
import { CalendarRenderer } from './CalendarRenderer';
import { Button, Field, Surface, inputClassName } from './ui';

interface Step4SaveAndOrderProps {
  design: CalendarDesign;
  activeSheet: number;
  onChangeSheet: (sheetIndex: number) => void;
  onSaveProject: () => { ok: boolean; error?: string };
  onSubmitOrder: (order: PrintOrderItem) => void;
  onPrev: () => void;
  onStartNew: () => void;
}

const QUANTITY_PRESETS = [1, 10, 50, 100, 200];

export const Step4SaveAndOrder: React.FC<Step4SaveAndOrderProps> = ({
  design,
  activeSheet,
  onChangeSheet,
  onSaveProject,
  onSubmitOrder,
  onPrev,
  onStartNew,
}) => {
  const variant =
    PRODUCT_VARIANTS.find((v) => v.id === design.variantId) ?? PRODUCT_VARIANTS[0];
  const styleDef = STYLES.find((s) => s.id === design.styleId) ?? STYLES[0];
  const layoutDef = LAYOUTS.find((l) => l.id === design.layoutId) ?? LAYOUTS[0];

  const [saveMessage, setSaveMessage] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  const [exportStatus, setExportStatus] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const [quantity, setQuantity] = useState<number>(10);
  const [paperStockId, setPaperStockId] = useState<PaperStockId>('couche-250');
  const [foilStamping, setFoilStamping] = useState<boolean>(true);
  const [giftBox, setGiftBox] = useState<boolean>(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank-transfer'>('cod');
  const [note, setNote] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<PrintOrderItem | null>(null);

  const safeQty = Math.max(1, Math.min(5000, Number.isFinite(quantity) ? quantity : 1));
  const unitPriceVnd = getUnitPriceWithTier(
    variant.basePriceVnd,
    paperStockId,
    foilStamping,
    giftBox,
    safeQty
  );
  const subtotalVnd = unitPriceVnd * safeQty;
  const shippingVnd = subtotalVnd >= 1000000 ? 0 : 35000;
  const totalVnd = subtotalVnd + shippingVnd;

  const handleSave = () => {
    setSaveError('');
    const result = onSaveProject();
    if (result.ok) {
      setSaveMessage('Đã lưu mẫu thiết kế vào danh sách của bạn.');
    } else {
      setSaveError(result.error || 'Không thể lưu thiết kế.');
    }
  };

  const handleExportPng = async () => {
    setExportStatus('');
    setIsExporting(true);
    try {
      await exportCalendarSheetPng(design, activeSheet);
      setExportStatus(`Đã xuất ảnh PNG chất lượng cao cho ${VIETNAMESE_MONTH_NAMES[activeSheet]}.`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Lỗi khi xuất ảnh PNG.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Vui lòng nhập họ tên người nhận.';
    if (!/^[0-9+\s.-]{8,15}$/.test(customerPhone.trim())) {
      errs.customerPhone = 'Số điện thoại chưa hợp lệ (8–15 chữ số).';
    }
    if (!shippingAddress.trim()) {
      errs.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng cụ thể.';
    }
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setFormErrors({});
    onSaveProject();

    const orderCode = `LT${String(design.year).slice(-2)}-${Math.floor(100000 + Math.random() * 900000)}`;
    const order: PrintOrderItem = {
      orderCode,
      createdAt: new Date().toISOString(),
      designId: design.id,
      projectName: design.projectName,
      calendarType: design.calendarType,
      variantName: variant.name,
      year: design.year,
      quantity: safeQty,
      paperStockId,
      foilStamping,
      giftBox,
      unitPriceVnd,
      subtotalVnd,
      shippingVnd,
      totalVnd,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      shippingAddress: shippingAddress.trim(),
      province,
      paymentMethod,
      note: note.trim(),
    };

    onSubmitOrder(order);
    setConfirmedOrder(order);
  };

  if (confirmedOrder) {
    return (
      <section aria-labelledby="order-success-heading" className="max-w-3xl mx-auto">
        <Surface className="p-6 sm:p-9 space-y-6 shadow-md border-primary/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0 shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-success">
                <span>Xác nhận thành công</span>
              </div>
              <h1
                id="order-success-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-foreground"
              >
                Đặt in lịch Tết thành công
              </h1>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                Mã đơn hàng{' '}
                <strong className="text-primary font-bold tabular-nums text-base">{confirmedOrder.orderCode}</strong>{' '}
                đã được tiếp nhận vào hệ thống xưởng in. Bộ phận chế bản sẽ kiểm tra chất lượng file in và liên hệ duyệt màu qua SĐT/Zalo trước khi bấm máy.
              </p>
            </div>
          </div>

          <div className="border-t border-b border-border/80 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm bg-background p-4 rounded-control">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-primary" />
                <span>Chi tiết ấn phẩm</span>
              </div>
              <div className="font-bold text-foreground text-sm">{confirmedOrder.projectName}</div>
              <div className="text-muted">
                {confirmedOrder.variantName} · Năm {confirmedOrder.year}
              </div>
              <div className="text-muted">
                Số lượng: <strong className="text-foreground tabular-nums font-bold">{confirmedOrder.quantity} cuốn</strong>
                {' · '}
                {PAPER_STOCKS.find((p) => p.id === confirmedOrder.paperStockId)?.name}
              </div>
              <div className="text-muted">
                Gia công:{' '}
                {[
                  confirmedOrder.foilStamping ? 'Ép kim nhũ vàng cao cấp' : 'In tiêu chuẩn',
                  confirmedOrder.giftBox ? 'Kèm hộp quà Tết đồng bộ' : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </div>

            <div className="space-y-2 sm:border-l sm:border-border/80 sm:pl-5">
              <div className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-primary" />
                <span>Giao hàng &amp; Thanh toán</span>
              </div>
              <div className="font-bold text-foreground">
                {confirmedOrder.customerName} · {confirmedOrder.customerPhone}
              </div>
              <div className="text-muted leading-snug">
                {confirmedOrder.shippingAddress}, {confirmedOrder.province}
              </div>
              <div className="text-muted">
                Thanh toán:{' '}
                {confirmedOrder.paymentMethod === 'cod'
                  ? 'Thanh toán tiền mặt khi nhận hàng (COD)'
                  : 'Chuyển khoản ngân hàng / VietQR'}
              </div>
              <div className="text-base font-bold text-primary tabular-nums pt-1">
                Tổng thanh toán: {formatVnd(confirmedOrder.totalVnd)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button tone="quiet" onClick={() => setConfirmedOrder(null)}>
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại chỉnh sửa hoặc đặt thêm</span>
            </Button>
            <div className="flex flex-wrap gap-2.5">
              <Button tone="quiet" onClick={handleExportPng} disabled={isExporting}>
                <Download className="w-4 h-4 text-primary" />
                <span>Tải ảnh PNG xem trước</span>
              </Button>
              <Button onClick={onStartNew} className="shadow-xs">Tạo mẫu lịch mới</Button>
            </div>
          </div>
        </Surface>
      </section>
    );
  }

  return (
    <section aria-labelledby="step4-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Preview & Export */}
      <div className="lg:col-span-6 space-y-5">
        <Surface className="p-5 sm:p-6 space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
              Bước 4 trên 4: Duyệt mẫu &amp; Đặt in
            </div>
            <h1 id="step4-heading" className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Lưu mẫu &amp; đặt in lịch Tết
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Kiểm tra trang bìa và 12 tháng trước khi xuất file PNG in ấn hoặc gửi thông tin đặt in tới xưởng.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <Button onClick={handleSave} tone="quiet">
              <Save className="w-4 h-4 text-primary" />
              <span>Lưu mẫu thiết kế</span>
            </Button>
            <Button onClick={handleExportPng} tone="quiet" disabled={isExporting}>
              <Download className="w-4 h-4 text-primary" />
              <span>
                {isExporting
                  ? 'Đang xuất PNG...'
                  : `Tải ảnh ${VIETNAMESE_MONTH_NAMES[activeSheet]} (PNG)`}
              </span>
            </Button>
          </div>

          {(saveMessage || exportStatus) && (
            <p role="status" className="text-xs sm:text-sm font-semibold text-success p-2.5 rounded bg-success/10 border border-success/20">
              {saveMessage || exportStatus}
            </p>
          )}
          {saveError && (
            <p role="alert" className="text-xs sm:text-sm font-semibold text-primary p-2.5 rounded bg-primary/10 border border-primary/20">
              {saveError}
            </p>
          )}

          {/* Quick Specifications */}
          <div className="pt-3 border-t border-border/80 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
            <div>
              <span className="text-muted">Loại lịch:</span>{' '}
              <strong className="text-foreground">{variant.name}</strong>
            </div>
            <div>
              <span className="text-muted">Kích thước:</span>{' '}
              <strong className="text-foreground">{variant.sizeLabel}</strong>
            </div>
            <div>
              <span className="text-muted">Phong cách:</span>{' '}
              <strong className="text-foreground">{styleDef.name}</strong>
            </div>
            <div>
              <span className="text-muted">Bố cục:</span>{' '}
              <strong className="text-foreground">{layoutDef.name}</strong>
            </div>
          </div>
        </Surface>

        {/* Live Interactive Preview Box */}
        <Surface inset className="p-4 sm:p-5 shadow-inner">
          <CalendarRenderer
            design={design}
            activeSheet={activeSheet}
            onChangeSheet={onChangeSheet}
          />
        </Surface>

        <div>
          <Button tone="quiet" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại chỉnh sửa ảnh &amp; nội dung</span>
          </Button>
        </div>
      </div>

      {/* Right Column: Pricing & Checkout Form */}
      <Surface className="lg:col-span-6 p-5 sm:p-7 shadow-sm">
        <form onSubmit={handlePlaceOrder} className="space-y-5" noValidate>
          <div className="border-b border-border/80 pb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Báo giá tự động xưởng in</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-0.5">
              Thông số in ấn &amp; đặt hàng
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Áp dụng chiết khấu tự động theo bậc số lượng · Miễn phí giao hàng toàn quốc từ 1.000.000 đ
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="order-qty" className="text-xs font-bold uppercase tracking-wider text-muted">
                Số lượng đặt in (cuốn)
              </label>
              <span className="text-xs text-primary font-bold tabular-nums bg-primary/10 px-2 py-0.5 rounded">
                {safeQty >= 200
                  ? 'Giảm 28% (Giá sỉ xưởng ≥ 200)'
                  : safeQty >= 50
                  ? 'Giảm 18% (Doanh nghiệp ≥ 50)'
                  : safeQty >= 10
                  ? 'Giảm 10% (Nhóm ≥ 10)'
                  : 'Đơn giá in lẻ'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id="order-qty"
                type="number"
                min={1}
                max={5000}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-28 min-h-11 rounded-control border border-border bg-surface px-3 text-sm font-bold tabular-nums text-foreground focus-visible:outline-2 focus-visible:outline-primary"
              />
              {QUANTITY_PRESETS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuantity(q)}
                  className={`min-h-11 px-3 rounded-control border text-xs sm:text-sm font-bold tabular-nums cursor-pointer transition-all ${
                    safeQty === q
                      ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                      : 'border-border bg-surface text-muted hover:text-foreground hover:bg-background'
                  }`}
                >
                  {q} cuốn
                </button>
              ))}
            </div>
          </div>

          {/* Paper Stock Radio Options */}
          <div className="space-y-2 pt-3 border-t border-border/80">
            <div className="text-xs font-bold uppercase tracking-wider text-muted">Chất liệu giấy in ruột &amp; bìa</div>
            <div className="space-y-2">
              {PAPER_STOCKS.map((paper) => {
                const active = paperStockId === paper.id;
                return (
                  <label
                    key={paper.id}
                    className={`p-3 rounded-control flex items-start justify-between gap-3 cursor-pointer border transition-all ${
                      active
                        ? 'border-primary/50 bg-primary/8 shadow-2xs'
                        : 'border-border bg-surface hover:bg-background'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="paperStock"
                        checked={active}
                        onChange={() => setPaperStockId(paper.id)}
                        className="mt-1 accent-primary"
                      />
                      <div>
                        <div className="text-sm font-bold text-foreground">{paper.name}</div>
                        <div className="text-xs text-muted leading-relaxed">{paper.description}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary tabular-nums shrink-0 pt-0.5">
                      {paper.extraPerUnitVnd === 0
                        ? 'Tiêu chuẩn'
                        : `+${formatVnd(paper.extraPerUnitVnd)}/cuốn`}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Finishing Enhancements */}
          <div className="space-y-2.5 pt-3 border-t border-border/80">
            <div className="text-xs font-bold uppercase tracking-wider text-muted">Gia công mỹ thuật hoàn thiện</div>
            <label className="flex items-center justify-between gap-3 p-2.5 rounded-control border border-border bg-surface hover:bg-background cursor-pointer text-xs sm:text-sm">
              <span className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={foilStamping}
                  onChange={(e) => setFoilStamping(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="font-semibold text-foreground">Ép kim nhũ vàng năm {design.year} &amp; tên thương hiệu</span>
              </span>
              <span className="text-xs font-bold text-primary tabular-nums">+15.000 ₫/cuốn</span>
            </label>
            <label className="flex items-center justify-between gap-3 p-2.5 rounded-control border border-border bg-surface hover:bg-background cursor-pointer text-xs sm:text-sm">
              <span className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={giftBox}
                  onChange={(e) => setGiftBox(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-primary" />
                  <span>Hộp quà / Túi giấy đựng lịch Tết đỏ đồng bộ</span>
                </span>
              </span>
              <span className="text-xs font-bold text-primary tabular-nums">+18.000 ₫/cuốn</span>
            </label>
          </div>

          {/* Price Breakdown Calculation */}
          <div className="pt-3 border-t border-border/80 p-3.5 rounded-control bg-background border border-border/70 space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between text-muted">
              <span>Đơn giá áp dụng ({safeQty} cuốn)</span>
              <span className="tabular-nums font-bold text-foreground">
                {formatVnd(unitPriceVnd)} / cuốn
              </span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Tạm tính thành tiền</span>
              <span className="tabular-nums font-bold text-foreground">
                {formatVnd(subtotalVnd)}
              </span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Phí vận chuyển toàn quốc</span>
              <span className="tabular-nums font-bold text-foreground">
                {shippingVnd === 0 ? 'Miễn phí vận chuyển' : formatVnd(shippingVnd)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-border/70">
              <span className="text-sm sm:text-base font-bold text-foreground">Tổng chi phí dự kiến</span>
              <span className="font-display text-2xl font-bold text-primary tabular-nums">
                {formatVnd(totalVnd)}
              </span>
            </div>
          </div>

          {/* Delivery Details Form */}
          <div className="space-y-3 pt-3 border-t border-border/80">
            <h3 className="font-display text-lg font-bold text-foreground">
              Thông tin nhận hàng &amp; duyệt file
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Họ và tên người nhận"
                htmlFor="cust-name"
                required
                error={formErrors.customerName}
              >
                <input
                  id="cust-name"
                  type="text"
                  autoComplete="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn An"
                  className={inputClassName}
                />
              </Field>
              <Field
                label="Số điện thoại / Zalo"
                htmlFor="cust-phone"
                required
                error={formErrors.customerPhone}
              >
                <input
                  id="cust-phone"
                  type="tel"
                  autoComplete="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className={inputClassName}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Email nhận file duyệt in" htmlFor="cust-email">
                <input
                  id="cust-email"
                  type="email"
                  autoComplete="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="email@congty.vn"
                  className={inputClassName}
                />
              </Field>
              <Field label="Tỉnh / Thành phố" htmlFor="cust-province">
                <select
                  id="cust-province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className={inputClassName}
                >
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Tỉnh thành khác">Tỉnh thành khác</option>
                </select>
              </Field>
            </div>

            <Field
              label="Địa chỉ giao hàng chi tiết"
              htmlFor="cust-address"
              required
              error={formErrors.shippingAddress}
            >
              <input
                id="cust-address"
                type="text"
                autoComplete="street-address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                className={inputClassName}
              />
            </Field>

            <div className="space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-muted">Phương thức thanh toán</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="flex items-center gap-2.5 min-h-11 px-3 rounded-control border border-border cursor-pointer text-xs sm:text-sm font-medium bg-surface hover:bg-background">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-primary"
                  />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className="flex items-center gap-2.5 min-h-11 px-3 rounded-control border border-border cursor-pointer text-xs sm:text-sm font-medium bg-surface hover:bg-background">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={() => setPaymentMethod('bank-transfer')}
                    className="accent-primary"
                  />
                  <span>Chuyển khoản / VietQR</span>
                </label>
              </div>
            </div>

            <Field label="Ghi chú cho xưởng in (tùy chọn)" htmlFor="cust-note">
              <textarea
                id="cust-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Giao giờ hành chính, xuất hóa đơn VAT điện tử..."
                className={`${inputClassName} min-h-20 py-2.5`}
              />
            </Field>
          </div>

          <Button type="submit" className="w-full shadow-md text-base py-3">
            <Printer className="w-5 h-5" />
            <span>Xác nhận đặt in · {formatVnd(totalVnd)}</span>
          </Button>
        </form>
      </Surface>
    </section>
  );
};
