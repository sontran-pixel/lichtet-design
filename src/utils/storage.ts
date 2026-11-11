import type { CalendarDesign, PrintOrderItem } from '../types/calendar';

const PROJECTS_KEY = 'lich_tet_studio_projects_v1';
const ORDERS_KEY = 'lich_tet_studio_orders_v1';

export function loadSavedProjects(): CalendarDesign[] {
  try {
    const raw = window.localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CalendarDesign =>
        Boolean(item && typeof item === 'object' && typeof item.id === 'string' && Array.isArray(item.sheets))
    );
  } catch {
    return [];
  }
}

export function saveProjectToStorage(design: CalendarDesign): { ok: boolean; projects: CalendarDesign[]; error?: string } {
  try {
    const existing = loadSavedProjects();
    const updatedDesign: CalendarDesign = {
      ...design,
      updatedAt: new Date().toISOString(),
    };
    const idx = existing.findIndex((p) => p.id === design.id);
    const next = idx >= 0 ? existing.map((p, i) => (i === idx ? updatedDesign : p)) : [updatedDesign, ...existing];
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
    return { ok: true, projects: next };
  } catch {
    return {
      ok: false,
      projects: loadSavedProjects(),
      error: 'Bộ nhớ trình duyệt đã đầy do ảnh tải lên quá lớn. Hãy giảm số ảnh tải lên hoặc xóa bớt mẫu cũ.',
    };
  }
}

export function deleteProjectFromStorage(id: string): CalendarDesign[] {
  try {
    const next = loadSavedProjects().filter((p) => p.id !== id);
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadSavedProjects();
  }
}

export function loadPrintOrders(): PrintOrderItem[] {
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePrintOrder(order: PrintOrderItem): { ok: boolean; orders: PrintOrderItem[] } {
  try {
    const existing = loadPrintOrders();
    const next = [order, ...existing];
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
    return { ok: true, orders: next };
  } catch {
    return { ok: false, orders: loadPrintOrders() };
  }
}

export function compressImageFile(file: File, maxDim = 960): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Tệp không phải hình ảnh hợp lệ.'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const targetW = Math.max(1, Math.round(img.width * scale));
        const targetH = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const isPng = file.type === 'image/png';
        const dataUrl = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.84);
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
