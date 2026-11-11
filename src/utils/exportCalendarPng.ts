import type { CalendarDesign } from '../types/calendar';
import { ACCENT_PALETTES, STYLES } from '../data/calendarCatalog';
import {
  buildMonthCalendarGrid,
  ENGLISH_MONTH_NAMES,
  getCanChiYear,
  VIETNAMESE_MONTH_NAMES,
} from '../utils/lunarCalendar';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Không thể tải ảnh để xuất PNG.'));
    img.src = src;
  });
}

function drawCoverFitImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  zoomPct: number,
  posXPct: number,
  posYPct: number
) {
  const imgRatio = img.width / img.height;
  const boxRatio = dw / dh;
  let drawW = dw;
  let drawH = dh;
  if (imgRatio > boxRatio) {
    drawH = dh;
    drawW = dh * imgRatio;
  } else {
    drawW = dw;
    drawH = dw / imgRatio;
  }
  const zoom = zoomPct / 100;
  drawW *= zoom;
  drawH *= zoom;
  const x = dx - (drawW - dw) * (posXPct / 100);
  const y = dy - (drawH - dh) * (posYPct / 100);

  ctx.save();
  ctx.beginPath();
  ctx.rect(dx, dy, dw, dh);
  ctx.clip();
  ctx.drawImage(img, x, y, drawW, drawH);
  ctx.restore();
}

export async function exportCalendarSheetPng(design: CalendarDesign, sheetIndex: number): Promise<void> {
  const style = STYLES.find((s) => s.id === design.styleId) ?? STYLES[0];
  const palette = ACCENT_PALETTES.find((p) => p.id === design.accentId) ?? ACCENT_PALETTES[0];
  const sheet = design.sheets[sheetIndex] ?? design.sheets[0];
  const isDesk = design.calendarType === 'desk';

  const width = isDesk ? 1400 : 1200;
  const height = isDesk ? 1000 : 1720;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Trình duyệt không hỗ trợ xuất ảnh Canvas.');

  const isCover = sheetIndex === 0;
  ctx.fillStyle = isCover ? style.coverBg : style.sheetBg;
  ctx.fillRect(0, 0, width, height);

  let photoImg: HTMLImageElement | null = null;
  if (sheet.photoUrl) {
    try {
      photoImg = await loadImage(sheet.photoUrl);
    } catch {
      photoImg = null;
    }
  }

  const footerH = design.showFooterContact ? (isDesk ? 74 : 92) : 0;

  if (isCover) {
    if (photoImg) {
      ctx.save();
      ctx.globalAlpha = 0.86;
      drawCoverFitImage(
        ctx,
        photoImg,
        0,
        0,
        width,
        height - footerH,
        sheet.photoZoom,
        sheet.photoPosX,
        sheet.photoPosY
      );
      ctx.restore();
    }
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(20, 8, 8, 0.72)');
    grad.addColorStop(0.55, 'rgba(20, 8, 8, 0.28)');
    grad.addColorStop(1, 'rgba(20, 8, 8, 0.78)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height - footerH);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FCE7B2';
    ctx.font = `600 ${isDesk ? 34 : 38}px "Source Sans 3", sans-serif`;
    ctx.fillText(design.brandOrFamilyName.toUpperCase(), width / 2, isDesk ? 150 : 250);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `600 ${isDesk ? 58 : 72}px "Newsreader", Georgia, serif`;
    ctx.fillText(design.headline, width / 2, isDesk ? 260 : 380);

    ctx.fillStyle = palette.secondary;
    ctx.font = `700 ${isDesk ? 150 : 180}px "Newsreader", Georgia, serif`;
    ctx.fillText(String(design.year), width / 2, isDesk ? 440 : 590);

    ctx.fillStyle = '#FCE7B2';
    ctx.font = `600 ${isDesk ? 32 : 38}px "Source Sans 3", sans-serif`;
    ctx.fillText(`XUÂN ${getCanChiYear(design.year).toUpperCase()}`, width / 2, isDesk ? 510 : 670);

    if (sheet.caption) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = `400 ${isDesk ? 28 : 32}px "Source Sans 3", sans-serif`;
      ctx.fillText(sheet.caption, width / 2, height - footerH - 70);
    }
  } else {
    if (isDesk) {
      const leftW = Math.round(width * 0.56);
      const rightX = leftW;
      const rightW = width - leftW;
      if (photoImg) {
        drawCoverFitImage(
          ctx,
          photoImg,
          rightX + 24,
          44,
          rightW - 60,
          height - footerH - 88,
          sheet.photoZoom,
          sheet.photoPosX,
          sheet.photoPosY
        );
      }
      ctx.strokeStyle = palette.secondary;
      ctx.lineWidth = 4;
      ctx.strokeRect(rightX + 24, 44, rightW - 60, height - footerH - 88);

      ctx.textAlign = 'left';
      ctx.fillStyle = palette.primary;
      ctx.font = '700 44px "Newsreader", Georgia, serif';
      const title = design.bilingualHeaders
        ? `${VIETNAMESE_MONTH_NAMES[sheetIndex]} · ${ENGLISH_MONTH_NAMES[sheetIndex]}`
        : VIETNAMESE_MONTH_NAMES[sheetIndex];
      ctx.fillText(title, 56, 108);

      ctx.fillStyle = style.sheetText;
      ctx.font = '600 22px "Source Sans 3", sans-serif';
      ctx.fillText(`Năm ${design.year} · ${getCanChiYear(design.year)}`, 56, 146);

      drawCalendarGridOnCanvas(ctx, design, sheetIndex, 56, 190, leftW - 88, height - footerH - 250, palette.primary, style.sheetText);
    } else {
      const photoH = Math.round((height - footerH) * 0.46);
      if (photoImg) {
        drawCoverFitImage(
          ctx,
          photoImg,
          40,
          40,
          width - 80,
          photoH - 40,
          sheet.photoZoom,
          sheet.photoPosX,
          sheet.photoPosY
        );
      }
      ctx.textAlign = 'left';
      ctx.fillStyle = palette.primary;
      ctx.font = '700 64px "Newsreader", Georgia, serif';
      const monthTitle = design.bilingualHeaders
        ? `${ENGLISH_MONTH_NAMES[sheetIndex]} · ${VIETNAMESE_MONTH_NAMES[sheetIndex]}`
        : VIETNAMESE_MONTH_NAMES[sheetIndex];
      ctx.fillText(monthTitle, 56, photoH + 92);

      const hx = width - 120;
      const hy = photoH + 72;
      ctx.fillStyle = palette.secondary;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = hx + 46 * Math.cos(angle);
        const py = hy + 46 * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = '700 36px "Source Sans 3", sans-serif';
      ctx.fillText(String(sheetIndex).padStart(2, '0'), hx, hy + 13);

      drawCalendarGridOnCanvas(
        ctx,
        design,
        sheetIndex,
        56,
        photoH + 148,
        width - 112,
        height - footerH - photoH - 200,
        palette.primary,
        style.sheetText
      );
    }
  }

  if (design.showFooterContact) {
    ctx.fillStyle = style.footerBg;
    ctx.fillRect(0, height - footerH, width, footerH);
    ctx.fillStyle = style.footerText;
    ctx.textAlign = 'center';
    ctx.font = `600 ${isDesk ? 22 : 26}px "Source Sans 3", sans-serif`;
    const parts = [design.website, design.phone, design.email].filter(Boolean).join('   •   ');
    ctx.fillText(parts || design.brandOrFamilyName, width / 2, height - footerH / 2 + 9);
  }

  const link = document.createElement('a');
  const safeName = (design.projectName || 'lich-tet').replace(/[^a-zA-Z0-9_-]+/g, '-').toLowerCase();
  link.download = `${safeName}-${sheetIndex === 0 ? 'bia' : `thang-${sheetIndex}`}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function drawCalendarGridOnCanvas(
  ctx: CanvasRenderingContext2D,
  design: CalendarDesign,
  month: number,
  gx: number,
  gy: number,
  gw: number,
  gh: number,
  accentColor: string,
  inkColor: string
) {
  const { cells } = buildMonthCalendarGrid(design.year, month, design.weekStartsOnMonday);
  const headers = design.weekStartsOnMonday
    ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
    : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const colW = gw / 7;
  const rows = cells.length / 7;
  const headerH = 44;
  const rowH = (gh - headerH) / rows;

  ctx.textAlign = 'center';
  headers.forEach((h, i) => {
    const isWeekend = h === 'CN' || h === 'T7';
    ctx.fillStyle = isWeekend ? accentColor : inkColor;
    ctx.font = '700 22px "Source Sans 3", sans-serif';
    ctx.fillText(h, gx + i * colW + colW / 2, gy + 28);
  });

  ctx.strokeStyle = 'rgba(0,0,0,0.14)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(gx, gy + headerH);
  ctx.lineTo(gx + gw, gy + headerH);
  ctx.stroke();

  cells.forEach((cell, idx) => {
    const col = idx % 7;
    const row = Math.floor(idx / 7);
    const cx = gx + col * colW + colW / 2;
    const cy = gy + headerH + row * rowH + rowH * 0.48;
    if (!cell.inCurrentMonth) {
      ctx.globalAlpha = 0.28;
    } else {
      ctx.globalAlpha = 1;
    }
    const isWeekend = cell.dayOfWeek === 0 || cell.dayOfWeek === 6;
    ctx.fillStyle = (cell.isHolidayRed || isWeekend) && cell.inCurrentMonth ? accentColor : inkColor;
    ctx.font = '700 30px "Source Sans 3", sans-serif';
    ctx.fillText(String(cell.solarDay), cx, cy);

    if (design.showLunarDates) {
      ctx.fillStyle = cell.isFirstOfLunarMonth ? accentColor : 'rgba(60,45,35,0.66)';
      ctx.font = '600 16px "Source Sans 3", sans-serif';
      ctx.fillText(cell.lunarLabel, cx, cy + 24);
    }
  });
  ctx.globalAlpha = 1;
}
