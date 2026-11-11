import type {
  AccentPaletteId,
  CalendarDesign,
  CalendarLayoutId,
  CalendarStyleId,
  LayoutDefinition,
  MonthSheetConfig,
  PaperStockId,
  ProductVariant,
  StyleDefinition,
} from '../types/calendar';

export const PRODUCT_VARIANTS: ProductVariant[] = [
  {
    id: 'desk-a-standard',
    calendarType: 'desk',
    name: 'Lịch Để Bàn Chữ A — Tiêu Chuẩn',
    sizeLabel: '21 × 15 cm (Ngang)',
    sheetCountLabel: '13 tờ (1 bìa + 12 tháng)',
    bindingLabel: 'Gáy lò xo kép ánh kim, đế carton bồi mỹ thuật',
    basePriceVnd: 85000,
    aspectRatio: 1.4,
  },
  {
    id: 'desk-a-large',
    calendarType: 'desk',
    name: 'Lịch Để Bàn Chữ A — Khổ Lớn Có Ghi Chú',
    sizeLabel: '24 × 18 cm (Ngang)',
    sheetCountLabel: '14 tờ (1 bìa + 12 tháng + trang ghi chú)',
    bindingLabel: 'Gáy lò xo kép, đế chữ A ép nhũ đỏ đô',
    basePriceVnd: 115000,
    aspectRatio: 1.33,
  },
  {
    id: 'wall-7-sheet',
    calendarType: 'wall',
    name: 'Lịch Treo Tường 7 Tờ (Nẹp Kẹp / Lò Xo)',
    sizeLabel: '35 × 50 cm (Đứng)',
    sheetCountLabel: '7 tờ (1 bìa + 6 tờ 2 tháng) hoặc 13 tờ đơn',
    bindingLabel: 'Nẹp kẹp thép hoặc lò xo giữa kèm móc treo',
    basePriceVnd: 120000,
    aspectRatio: 0.7,
  },
  {
    id: 'wall-13-sheet',
    calendarType: 'wall',
    name: 'Lịch Treo Tường 13 Tờ — Cao Cấp',
    sizeLabel: '40 × 60 cm (Đứng)',
    sheetCountLabel: '13 tờ (1 bìa + 12 tháng riêng biệt)',
    bindingLabel: 'Kẹp treo thép đen hoặc lò xo treo tường chắc chắn',
    basePriceVnd: 165000,
    aspectRatio: 0.67,
  },
];

export const STYLES: StyleDefinition[] = [
  {
    id: 'son-mai-dinh-mui',
    name: 'Đỏ Son & Mai Vàng',
    subtitle: 'Sắc đỏ Tết truyền thống, nhũ vàng và linh vật năm mới',
    coverBg: '#9B1618',
    coverText: '#FDE8B4',
    sheetBg: '#FFFBF4',
    sheetText: '#2A1614',
    accentHex: '#B91C1C',
    secondaryHex: '#D49A2A',
    footerBg: '#8A1214',
    footerText: '#FCE7B2',
    motifType: 'mai-vang',
  },
  {
    id: 'ca-phe-toi-gian',
    name: 'Cà Phê & Tối Giản',
    subtitle: 'Nền trắng thanh lịch, huy hiệu lục giác vàng hổ phách & chân trang doanh nghiệp',
    coverBg: '#2B1B15',
    coverText: '#FFFFFF',
    sheetBg: '#FFFFFF',
    sheetText: '#241B17',
    accentHex: '#D89614',
    secondaryHex: '#3B251E',
    footerBg: '#E6A817',
    footerText: '#1F1510',
    motifType: 'coffee-clean',
  },
  {
    id: 'dong-ho-di-san',
    name: 'Giấy Dó & Di Sản',
    subtitle: 'Nền giấy dó ngà ấm, đỏ chu sa và khung viền họa tiết dân gian',
    coverBg: '#F4EBDC',
    coverText: '#6B1412',
    sheetBg: '#FAF5EB',
    sheetText: '#2C221E',
    accentHex: '#9F241E',
    secondaryHex: '#7A542E',
    footerBg: '#5C1814',
    footerText: '#F6E9D7',
    motifType: 'dong-ho',
  },
  {
    id: 'dao-xuan-bac-bo',
    name: 'Đào Xuân Bắc Bộ',
    subtitle: 'Hồng đào phai dịu nhẹ, chữ serif trang nhã cho lịch gia đình & kỷ niệm',
    coverBg: '#591625',
    coverText: '#FFF3E8',
    sheetBg: '#FFF9F7',
    sheetText: '#2B191E',
    accentHex: '#B8334A',
    secondaryHex: '#C9893C',
    footerBg: '#46101C',
    footerText: '#FFEAD8',
    motifType: 'hoa-dao',
  },
];

export const LAYOUTS: LayoutDefinition[] = [
  {
    id: 'desk-split-curve',
    calendarType: 'desk',
    name: 'Chia đôi bo cong (Lịch trái · Ảnh phải)',
    description: 'Bố cục như mẫu lịch để bàn: số tháng lớn bên trái, ảnh chân dung bo vòm viền vàng bên phải.',
  },
  {
    id: 'desk-top-photo',
    calendarType: 'desk',
    name: 'Ảnh ngang trên · Lịch gọn dưới',
    description: 'Ưu tiên khung ảnh gia đình hoặc sản phẩm rộng phía trên, bảng ngày dương & âm lịch phía dưới.',
  },
  {
    id: 'desk-editorial-notes',
    calendarType: 'desk',
    name: 'Lịch rộng bên trái · Ảnh & lời chúc phải',
    description: 'Tăng kích thước ô ngày để dễ theo dõi công việc, ảnh kỷ niệm đặt gọn gàng cột phải.',
  },
  {
    id: 'desk-classic-frame',
    calendarType: 'desk',
    name: 'Khung viền Tết cổ điển',
    description: 'Ảnh lồng khung viền chỉ vàng ở góc trái, bảng lịch 7 cột cân đối bên phải.',
  },
  {
    id: 'wall-top-photo-grid',
    calendarType: 'wall',
    name: 'Ảnh nửa trên · Lịch lục giác & chân trang',
    description: 'Bố cục mẫu lịch treo tường: ảnh vuông lớn phía trên, tiêu đề tháng kèm huy hiệu lục giác và thanh liên hệ dưới cùng.',
  },
  {
    id: 'wall-arch-portrait',
    calendarType: 'wall',
    name: 'Khung vòm cổ điển',
    description: 'Ảnh được cắt theo khung vòm cửa sổ truyền thống, bảng lịch tháng thoáng đạt phía dưới.',
  },
  {
    id: 'wall-full-bleed-poster',
    calendarType: 'wall',
    name: 'Ảnh tràn viền kèm bảng tháng tối giản',
    description: 'Ảnh chiếm 62% chiều cao tờ lịch, phù hợp ảnh phong cảnh hoặc ảnh chụp studio sắc nét.',
  },
  {
    id: 'wall-heritage-duet',
    calendarType: 'wall',
    name: 'Bìa đôi trưng bày & trang tháng',
    description: 'Hiển thị đồng thời tờ bìa và tờ tháng bên cạnh để kiểm tra tính đồng bộ khi treo cặp.',
  },
];

export const ACCENT_PALETTES: Array<{
  id: AccentPaletteId;
  name: string;
  primary: string;
  secondary: string;
}> = [
  { id: 'cinnabar', name: 'Đỏ Son', primary: '#B91C1C', secondary: '#D49A2A' },
  { id: 'amber-gold', name: 'Vàng Hổ Phách', primary: '#D89614', secondary: '#3B251E' },
  { id: 'espresso', name: 'Nâu Cà Phê', primary: '#4B2E22', secondary: '#C58B2A' },
  { id: 'jade', name: 'Xanh Ngọc Bích', primary: '#1E6B52', secondary: '#C9952C' },
];

export const PAPER_STOCKS: Array<{
  id: PaperStockId;
  name: string;
  description: string;
  extraPerUnitVnd: number;
}> = [
  {
    id: 'couche-250',
    name: 'Couche Matt 250gsm',
    description: 'Mịn lì, chống chói, lên màu ảnh sắc nét chuẩn xưởng in',
    extraPerUnitVnd: 0,
  },
  {
    id: 'my-thuat-280',
    name: 'Giấy Mỹ Thuật Gân Nhật 280gsm',
    description: 'Bề mặt có vân giấy nhẹ sang trọng, thích hợp lịch quà tặng',
    extraPerUnitVnd: 22000,
  },
  {
    id: 'kraft-co-dien',
    name: 'Ivory Kem 300gsm',
    description: 'Dày dặn, tông ngà ấm hợp phong cách Đông Hồ & tối giản',
    extraPerUnitVnd: 15000,
  },
];

function makeArtSvg(
  bg1: string,
  bg2: string,
  accent: string,
  motif: string,
  title: string,
  subtitle: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <circle cx="620" cy="140" r="170" fill="${accent}" opacity="0.18"/>
    <circle cx="170" cy="480" r="210" fill="${accent}" opacity="0.12"/>
    <path d="M0 440 Q220 360 440 430 T800 390 L800 600 L0 600 Z" fill="${accent}" opacity="0.22"/>
    <rect x="36" y="36" width="728" height="528" fill="none" stroke="${accent}" stroke-width="2" opacity="0.45"/>
    ${motif}
    <text x="64" y="498" fill="#FFF8EE" font-family="Georgia, serif" font-size="34" font-weight="600">${title}</text>
    <text x="64" y="534" fill="#FFF8EE" opacity="0.82" font-family="sans-serif" font-size="18">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DESK_PREVIEW_SVG = makeArtSvg(
  '#8F1418',
  '#4D0A0C',
  '#F4C152',
  `<g fill="#F4C152">
    <circle cx="400" cy="220" r="80" opacity="0.25"/>
    <rect x="180" y="140" width="440" height="240" rx="12" fill="#7A0F12" stroke="#F4C152" stroke-width="3"/>
    <line x1="180" y1="180" x2="620" y2="180" stroke="#F4C152" stroke-width="2"/>
    <text x="400" y="240" fill="#FDE6A6" font-family="Georgia, serif" font-size="48" font-weight="700" text-anchor="middle">LỊCH ĐỂ BÀN 2027</text>
    <text x="400" y="280" fill="#FFF" font-family="sans-serif" font-size="20" text-anchor="middle">ĐẾ CHỮ A · GÁY LÒ XO KÉP</text>
  </g>`,
  'Lịch Để Bàn Chữ A',
  'Mẫu 2027 Đinh Mùi sang trọng'
);

export const WALL_PREVIEW_SVG = makeArtSvg(
  '#2C1C16',
  '#150D09',
  '#E6A817',
  `<g fill="#E6A817">
    <rect x="240" y="100" width="320" height="340" rx="8" fill="#FFFDF9" stroke="#E6A817" stroke-width="3"/>
    <rect x="256" y="116" width="288" height="150" fill="#4A2E20"/>
    <text x="400" y="310" fill="#D98A16" font-family="Georgia, serif" font-size="28" font-weight="700" text-anchor="middle">LỊCH TREO TƯỜNG</text>
    <text x="400" y="345" fill="#333" font-family="sans-serif" font-size="16" text-anchor="middle">KHỔ ĐỨNG LỚN · 13 TỜ / 7 TỜ</text>
  </g>`,
  'Lịch Treo Tường',
  'Bản in chất lượng cao'
);

const ART_MOTIFS = [
  {
    label: 'Bìa Xuân Đinh Mùi — Pháo Hoa & Hoa Mai',
    caption: 'Cung chúc tân xuân · An khang thịnh vượng',
    url: makeArtSvg(
      '#8F1316',
      '#4D090B',
      '#F4C152',
      `<g fill="#F4C152">
        <circle cx="400" cy="230" r="88" opacity="0.22"/>
        <path d="M230 180 Q320 120 400 175 Q480 120 570 180" fill="none" stroke="#F4C152" stroke-width="4"/>
        <circle cx="290" cy="150" r="14"/><circle cx="340" cy="135" r="10"/><circle cx="460" cy="138" r="12"/><circle cx="515" cy="158" r="14"/>
        <circle cx="400" cy="230" r="56" fill="none" stroke="#F4C152" stroke-width="3" stroke-dasharray="8 8"/>
        <polygon points="400,190 412,222 446,222 418,242 428,274 400,254 372,274 382,242 354,222 388,222" fill="#FDE6A6"/>
      </g>`,
      'Xuân Đinh Mùi',
      'Khởi đầu bình an và rực rỡ'
    ),
  },
  {
    label: 'Tháng 1 — Khởi Đầu & Tách Cà Phê Sáng',
    caption: 'Khởi đầu năm mới tràn đầy năng lượng',
    url: makeArtSvg(
      '#3B231A',
      '#1E120D',
      '#E2A63B',
      `<g>
        <ellipse cx="400" cy="300" rx="130" ry="38" fill="#F5EBDD" opacity="0.9"/>
        <path d="M310 210 Q310 300 400 300 Q490 300 490 210 Z" fill="#FFFDF9"/>
        <ellipse cx="400" cy="210" rx="90" ry="24" fill="#9E5B2D"/>
        <path d="M490 225 Q535 225 535 255 Q535 280 485 280" fill="none" stroke="#FFFDF9" stroke-width="12"/>
        <path d="M365 165 Q355 140 375 120 M405 160 Q395 135 415 112 M440 168 Q430 145 450 125" fill="none" stroke="#F5D08A" stroke-width="4" stroke-linecap="round"/>
      </g>`,
      'Hương Xuân Ban Mai',
      'Tách cà phê đầu năm · Tháng Giêng'
    ),
  },
  {
    label: 'Tháng 2 — Tết Sum Vầy & Bánh Chưng Xanh',
    caption: 'Bánh chưng xanh bên câu đối đỏ',
    url: makeArtSvg(
      '#1F593D',
      '#103222',
      '#E9B84A',
      `<g>
        <rect x="300" y="150" width="200" height="190" rx="14" fill="#2E7D52" stroke="#E9B84A" stroke-width="4"/>
        <line x1="300" y1="215" x2="500" y2="215" stroke="#F6E2B3" stroke-width="6"/>
        <line x1="300" y1="275" x2="500" y2="275" stroke="#F6E2B3" stroke-width="6"/>
        <line x1="365" y1="150" x2="365" y2="340" stroke="#F6E2B3" stroke-width="6"/>
        <line x1="435" y1="150" x2="435" y2="340" stroke="#F6E2B3" stroke-width="6"/>
      </g>`,
      'Tết Đoàn Viên',
      'Thịt mỡ dưa hành câu đối đỏ'
    ),
  },
  {
    label: 'Tháng 3 — Hoa Ban Tây Bắc & Trời Xuân',
    caption: 'Sắc xuân vùng cao thanh khiết',
    url: makeArtSvg(
      '#4F2D3A',
      '#2B171F',
      '#F5C7C0',
      `<g fill="#FBE5E2">
        <circle cx="340" cy="210" r="26"/><circle cx="390" cy="180" r="24"/><circle cx="445" cy="215" r="28"/><circle cx="395" cy="255" r="24"/>
        <circle cx="395" cy="215" r="14" fill="#E89B48"/>
      </g>`,
      'Mùa Hoa Ban Nở',
      'Nắng ấm tháng Ba về trên non cao'
    ),
  },
  {
    label: 'Tháng 4 — Cố Đô Huế & Sông Hương',
    caption: 'Trầm mặc nét đẹp di sản Việt',
    url: makeArtSvg(
      '#6E2924',
      '#3A1412',
      '#E5B35C',
      `<g fill="none" stroke="#F4D391" stroke-width="4">
        <polygon points="400,120 330,185 470,185" fill="#E5B35C" opacity="0.8"/>
        <polygon points="400,165 310,235 490,235" fill="#E5B35C" opacity="0.65"/>
        <rect x="335" y="235" width="130" height="90" fill="#F4D391" opacity="0.25"/>
        <line x1="220" y1="345" x2="580" y2="345" stroke-width="3"/>
      </g>`,
      'Nét Xưa Đất Kinh Kỳ',
      'Tháng Tư dịu dàng bên dòng Hương'
    ),
  },
  {
    label: 'Tháng 5 — Phượng Vĩ & Nắng Hạ',
    caption: 'Sắc đỏ rực rỡ đầu mùa hạ',
    url: makeArtSvg(
      '#9E281B',
      '#58120B',
      '#F6C958',
      `<g>
        <circle cx="400" cy="225" r="78" fill="#F6C958" opacity="0.85"/>
        <path d="M220 310 Q320 265 420 300 T600 280" fill="none" stroke="#FCE7A5" stroke-width="5"/>
      </g>`,
      'Nắng Hạ Tháng Năm',
      'Khúc giao mùa rực nắng vàng'
    ),
  },
  {
    label: 'Tháng 6 — Sen Hồ Tây Thanh Tịnh',
    caption: 'Trong đầm gì đẹp bằng sen',
    url: makeArtSvg(
      '#1F5246',
      '#102E27',
      '#F0B5B8',
      `<g>
        <ellipse cx="400" cy="315" rx="145" ry="30" fill="#2E7D67"/>
        <path d="M400 165 Q365 225 400 285 Q435 225 400 165 Z" fill="#FAD2D6"/>
        <path d="M400 185 Q325 225 360 285 Q395 250 400 185 Z" fill="#F4B2B8"/>
        <path d="M400 185 Q475 225 440 285 Q405 250 400 185 Z" fill="#F4B2B8"/>
      </g>`,
      'Hương Sen Đầu Hạ',
      'Tĩnh tâm và an nhiên mỗi ngày'
    ),
  },
  {
    label: 'Tháng 7 — Phố Cổ Hội An Đêm Đèn Lồng',
    caption: 'Lung linh ánh đèn bên sông Hoài',
    url: makeArtSvg(
      '#7C221A',
      '#2B1319',
      '#F5B942',
      `<g>
        <ellipse cx="320" cy="215" rx="44" ry="56" fill="#E85A34" stroke="#F8D26A" stroke-width="3"/>
        <ellipse cx="430" cy="185" rx="38" ry="50" fill="#F5B942" stroke="#FFF2C2" stroke-width="3"/>
        <ellipse cx="520" cy="235" rx="42" ry="52" fill="#D93829" stroke="#F8D26A" stroke-width="3"/>
      </g>`,
      'Đêm Hội An',
      'Ánh đèn lồng ấm áp tháng Bảy'
    ),
  },
  {
    label: 'Tháng 8 — Mùa Thu Hà Nội & Cốm Làng Vòng',
    caption: 'Hương cốm mới trong gió thu về',
    url: makeArtSvg(
      '#2B4A38',
      '#16281E',
      '#D6B254',
      `<g>
        <circle cx="400" cy="220" r="80" fill="#D6B254" opacity="0.28"/>
        <path d="M310 270 Q400 175 490 270 Q400 325 310 270 Z" fill="#5CA06B"/>
        <circle cx="400" cy="255" r="34" fill="#A9D68A"/>
      </g>`,
      'Thu Sang Làng Vòng',
      'Chút hương cốm xanh gói lá sen'
    ),
  },
  {
    label: 'Tháng 9 — Ruộng Bậc Thang Mùa Lúa Chín',
    caption: 'Sắc vàng ấm no trên non ngàn',
    url: makeArtSvg(
      '#6E4B17',
      '#3B250A',
      '#F2C14E',
      `<g fill="none" stroke="#F6D57A" stroke-width="6">
        <path d="M180 260 Q400 205 620 260"/>
        <path d="M150 305 Q400 245 650 305"/>
        <path d="M120 350 Q400 285 680 350"/>
      </g>`,
      'Mùa Vàng Tây Bắc',
      'Bội thu và trù phú tháng Chín'
    ),
  },
  {
    label: 'Tháng 10 — Dã Quỳ Cao Nguyên',
    caption: 'Nắng gió cao nguyên rực sắc vàng',
    url: makeArtSvg(
      '#493518',
      '#271B0B',
      '#F2B729',
      `<g fill="#F4C23D">
        <circle cx="400" cy="225" r="24" fill="#5B3611"/>
        <ellipse cx="400" cy="170" rx="16" ry="34"/><ellipse cx="400" cy="280" rx="16" ry="34"/>
        <ellipse cx="345" cy="225" rx="34" ry="16"/><ellipse cx="455" cy="225" rx="34" ry="16"/>
      </g>`,
      'Sắc Vàng Cao Nguyên',
      'Tháng Mười lộng gió đại ngàn'
    ),
  },
  {
    label: 'Tháng 11 — Cúc Họa Mi Chớm Đông',
    caption: 'Tinh khôi những ngày gió lạnh đầu mùa',
    url: makeArtSvg(
      '#2F3A47',
      '#192028',
      '#E6C775',
      `<g>
        <circle cx="400" cy="225" r="26" fill="#E8B938"/>
        <circle cx="355" cy="225" r="22" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="445" cy="225" r="22" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="400" cy="180" r="22" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="400" cy="270" r="22" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="400" cy="225" r="20" fill="#E8B938"/>
      </g>`,
      'Cúc Họa Mi Tháng 11',
      'Dịu dàng phố cổ chớm đông'
    ),
  },
  {
    label: 'Tháng 12 — Chợ Hoa Cuối Năm & Đoàn Tụ',
    caption: 'Gói ghém yêu thương đón Tết sum vầy',
    url: makeArtSvg(
      '#78181A',
      '#3B0A0B',
      '#F3BE50',
      `<g>
        <circle cx="330" cy="220" r="46" fill="#E8A938" opacity="0.85"/>
        <circle cx="470" cy="220" r="46" fill="#D93829" opacity="0.85"/>
        <path d="M270 300 Q400 245 530 300" fill="none" stroke="#F8D888" stroke-width="5"/>
      </g>`,
      'Chợ Hoa Cuối Năm',
      'Khép lại một năm trọn vẹn yêu thương'
    ),
  },
];

export const PRESET_GALLERY = ART_MOTIFS;

export function createInitialSheets(): MonthSheetConfig[] {
  return ART_MOTIFS.map((item, index) => ({
    sheetIndex: index,
    photoUrl: item.url,
    photoLabel: item.label,
    photoZoom: 100,
    photoPosX: 50,
    photoPosY: 50,
    photoFilter: 'none',
    caption: item.caption,
  }));
}

export function createDefaultDesign(
  calendarType: 'desk' | 'wall' = 'desk',
  projectName = 'Lịch Tết Đinh Mùi 2027'
): CalendarDesign {
  const isDesk = calendarType === 'desk';
  return {
    id: `proj_${Date.now()}`,
    projectName,
    calendarType,
    variantId: isDesk ? 'desk-a-standard' : 'wall-13-sheet',
    year: 2027,
    styleId: isDesk ? 'son-mai-dinh-mui' : 'ca-phe-toi-gian',
    layoutId: isDesk ? 'desk-split-curve' : 'wall-top-photo-grid',
    accentId: isDesk ? 'cinnabar' : 'amber-gold',
    headline: 'CHÚC MỪNG NĂM MỚI',
    brandOrFamilyName: isDesk ? 'Gia Đình An Nhiên' : 'Mộc Nhiên Coffee',
    logoUrl: '',
    showFooterContact: true,
    website: 'www.mocnhien.vn',
    phone: '0912 345 678',
    email: 'lienhe@mocnhien.vn',
    showLunarDates: true,
    showHolidays: true,
    weekStartsOnMonday: false,
    bilingualHeaders: false,
    sheets: createInitialSheets(),
    specialDates: [
      { id: 'sp_1', month: 1, day: 15, label: 'Kỷ niệm gia đình' },
      { id: 'sp_2', month: 2, day: 6, label: 'Mùng 1 Tết Đinh Mùi' },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getUnitPriceWithTier(
  basePriceVnd: number,
  paperStockId: PaperStockId,
  foilStamping: boolean,
  giftBox: boolean,
  quantity: number
): number {
  const paper = PAPER_STOCKS.find((p) => p.id === paperStockId);
  let raw = basePriceVnd + (paper?.extraPerUnitVnd ?? 0);
  if (foilStamping) raw += 15000;
  if (giftBox) raw += 18000;

  let multiplier = 1;
  if (quantity >= 200) multiplier = 0.72;
  else if (quantity >= 50) multiplier = 0.82;
  else if (quantity >= 10) multiplier = 0.9;

  return Math.round((raw * multiplier) / 1000) * 1000;
}
