export type CalendarType = 'desk' | 'wall';

export type WizardStep = 1 | 2 | 3 | 4;

export type CalendarYear = 2026 | 2027;

export type CalendarStyleId =
  | 'son-mai-dinh-mui'
  | 'ca-phe-toi-gian'
  | 'dong-ho-di-san'
  | 'dao-xuan-bac-bo';

export type CalendarLayoutId =
  | 'desk-split-curve'
  | 'desk-top-photo'
  | 'desk-editorial-notes'
  | 'desk-classic-frame'
  | 'wall-top-photo-grid'
  | 'wall-arch-portrait'
  | 'wall-full-bleed-poster'
  | 'wall-heritage-duet';

export type PaperStockId = 'couche-250' | 'my-thuat-280' | 'kraft-co-dien';

export type AccentPaletteId = 'cinnabar' | 'amber-gold' | 'espresso' | 'jade';

export interface ProductVariant {
  id: string;
  calendarType: CalendarType;
  name: string;
  sizeLabel: string;
  sheetCountLabel: string;
  bindingLabel: string;
  basePriceVnd: number;
  aspectRatio: number;
}

export interface StyleDefinition {
  id: CalendarStyleId;
  name: string;
  subtitle: string;
  coverBg: string;
  coverText: string;
  sheetBg: string;
  sheetText: string;
  accentHex: string;
  secondaryHex: string;
  footerBg: string;
  footerText: string;
  motifType: 'mai-vang' | 'coffee-clean' | 'dong-ho' | 'hoa-dao';
}

export interface LayoutDefinition {
  id: CalendarLayoutId;
  calendarType: CalendarType;
  name: string;
  description: string;
}

export interface MonthSheetConfig {
  sheetIndex: number;
  photoUrl: string;
  photoLabel: string;
  photoZoom: number;
  photoPosX: number;
  photoPosY: number;
  photoFilter: 'none' | 'warm' | 'vintage' | 'crisp';
  caption: string;
}

export interface SpecialDate {
  id: string;
  month: number;
  day: number;
  label: string;
}

export interface CalendarDesign {
  id: string;
  projectName: string;
  calendarType: CalendarType;
  variantId: string;
  year: CalendarYear;
  styleId: CalendarStyleId;
  layoutId: CalendarLayoutId;
  accentId: AccentPaletteId;
  headline: string;
  brandOrFamilyName: string;
  logoUrl: string;
  showFooterContact: boolean;
  website: string;
  phone: string;
  email: string;
  showLunarDates: boolean;
  showHolidays: boolean;
  weekStartsOnMonday: boolean;
  bilingualHeaders: boolean;
  sheets: MonthSheetConfig[];
  specialDates: SpecialDate[];
  updatedAt: string;
}

export interface PrintOrderItem {
  orderCode: string;
  createdAt: string;
  designId: string;
  projectName: string;
  calendarType: CalendarType;
  variantName: string;
  year: CalendarYear;
  quantity: number;
  paperStockId: PaperStockId;
  foilStamping: boolean;
  giftBox: boolean;
  unitPriceVnd: number;
  subtotalVnd: number;
  shippingVnd: number;
  totalVnd: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  province: string;
  paymentMethod: 'cod' | 'bank-transfer';
  note: string;
}
