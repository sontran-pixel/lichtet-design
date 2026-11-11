export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  jd: number;
}

export interface CalendarDayCell {
  solarDay: number;
  solarMonth: number;
  solarYear: number;
  inCurrentMonth: boolean;
  dayOfWeek: number;
  lunar: LunarDate;
  lunarLabel: string;
  isFirstOfLunarMonth: boolean;
  isFullMoon: boolean;
  holidayName: string | null;
  isHolidayRed: boolean;
}

const PI = Math.PI;

function intPart(floatNum: number): number {
  return Math.floor(floatNum);
}

export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = intPart((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    intPart((153 * m + 2) / 5) +
    365 * y +
    intPart(y / 4) -
    intPart(y / 100) +
    intPart(y / 400) -
    32045;
  if (jd < 2299161) {
    jd = dd + intPart((153 * m + 2) / 5) + 365 * y + intPart(y / 4) - 32083;
  }
  return jd;
}

function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 -= 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 += 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  const JdNew = Jd1 + C1 - deltat;
  return intPart(JdNew + 0.5 + timeZone / 24);
}

function getSunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L *= dr;
  L -= PI * 2 * intPart(L / (PI * 2));
  return intPart((L / PI) * 6);
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = intPart(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = intPart((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

export function convertSolar2Lunar(dd: number, mm: number, yy: number, timeZone = 7): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = intPart((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = intPart((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    leap: lunarLeap,
    jd: dayNumber,
  };
}

const CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
const CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];

export function getCanChiYear(year: number): string {
  return `${CAN[year % 10]} ${CHI[year % 12]}`;
}

export function getVietnameseHoliday(
  solarDay: number,
  solarMonth: number,
  lunar: LunarDate
): { name: string; isRed: boolean } | null {
  const sKey = `${solarDay}/${solarMonth}`;
  const lKey = `${lunar.day}/${lunar.month}`;

  if (!lunar.leap) {
    if (lKey === '1/1') return { name: 'Mùng 1 Tết Nguyên Đán', isRed: true };
    if (lKey === '2/1') return { name: 'Mùng 2 Tết Nguyên Đán', isRed: true };
    if (lKey === '3/1') return { name: 'Mùng 3 Tết Nguyên Đán', isRed: true };
    if (lKey === '15/1') return { name: 'Rằm tháng Giêng', isRed: false };
    if (lKey === '10/3') return { name: 'Giỗ Tổ Hùng Vương', isRed: true };
    if (lKey === '15/4') return { name: 'Lễ Phật Đản', isRed: false };
    if (lKey === '5/5') return { name: 'Tết Đoan Ngọ', isRed: false };
    if (lKey === '15/7') return { name: 'Lễ Vu Lan', isRed: false };
    if (lKey === '15/8') return { name: 'Tết Trung Thu', isRed: false };
    if (lKey === '23/12') return { name: 'Tết Ông Công Ông Táo', isRed: true };
  }

  const solarHolidays: Record<string, { name: string; isRed: boolean }> = {
    '1/1': { name: 'Tết Dương Lịch', isRed: true },
    '14/2': { name: 'Lễ Tình Nhân', isRed: false },
    '8/3': { name: 'Quốc Tế Phụ Nữ', isRed: false },
    '30/4': { name: 'Giải Phóng Miền Nam', isRed: true },
    '1/5': { name: 'Quốc Tế Lao Động', isRed: true },
    '1/6': { name: 'Quốc Tế Thiếu Nhi', isRed: false },
    '2/9': { name: 'Quốc Khánh', isRed: true },
    '20/10': { name: 'Phụ Nữ Việt Nam', isRed: false },
    '20/11': { name: 'Nhà Giáo Việt Nam', isRed: false },
    '24/12': { name: 'Lễ Giáng Sinh', isRed: false },
  };

  return solarHolidays[sKey] ?? null;
}

export function buildMonthCalendarGrid(
  year: number,
  month: number,
  weekStartsOnMonday: boolean
): {
  cells: CalendarDayCell[];
  monthHolidays: Array<{ solarDay: number; lunarLabel: string; name: string }>;
} {
  const firstDayDate = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow = firstDayDate.getDay();

  const leadingDays = weekStartsOnMonday ? (firstDow === 0 ? 6 : firstDow - 1) : firstDow;
  const totalSlots = Math.ceil((leadingDays + daysInMonth) / 7) * 7;

  const cells: CalendarDayCell[] = [];
  const monthHolidays: Array<{ solarDay: number; lunarLabel: string; name: string }> = [];

  for (let i = 0; i < totalSlots; i++) {
    const offsetDay = i - leadingDays + 1;
    const d = new Date(year, month - 1, offsetDay);
    const sDay = d.getDate();
    const sMonth = d.getMonth() + 1;
    const sYear = d.getFullYear();
    const inCurrentMonth = sMonth === month && sYear === year;
    const lunar = convertSolar2Lunar(sDay, sMonth, sYear, 7);
    const isFirst = lunar.day === 1;
    const isFullMoon = lunar.day === 15;
    const lunarLabel = isFirst ? `${lunar.day}/${lunar.month}` : `${lunar.day}`;
    const holiday = getVietnameseHoliday(sDay, sMonth, lunar);

    if (inCurrentMonth && holiday) {
      monthHolidays.push({
        solarDay: sDay,
        lunarLabel: `${lunar.day}/${lunar.month} Âm lịch`,
        name: holiday.name,
      });
    }

    cells.push({
      solarDay: sDay,
      solarMonth: sMonth,
      solarYear: sYear,
      inCurrentMonth,
      dayOfWeek: d.getDay(),
      lunar,
      lunarLabel,
      isFirstOfLunarMonth: isFirst,
      isFullMoon,
      holidayName: holiday?.name ?? null,
      isHolidayRed: holiday?.isRed ?? false,
    });
  }

  return { cells, monthHolidays };
}

export const VIETNAMESE_MONTH_NAMES = [
  'Trang Bìa',
  'Tháng 01',
  'Tháng 02',
  'Tháng 03',
  'Tháng 04',
  'Tháng 05',
  'Tháng 06',
  'Tháng 07',
  'Tháng 08',
  'Tháng 09',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export const ENGLISH_MONTH_NAMES = [
  'Cover',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
