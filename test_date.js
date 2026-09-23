const MONTH_MAP = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
};

function parseOcrDate(dateStr, fallbackYear = '2024') {
  if (!dateStr) return { isoDate: null, hadCorrections: true };
  let str = dateStr.trim();
  str = str.replace(/O/gi, '0').replace(/[lI]/g, '1');

  // Try MMM DD, YYYY or MMM DD
  const mmmMatch = str.match(/([a-zA-Z]{3})\s+(\d{1,2})(?:[,\s]+(\d{4}))?/i);
  if (mmmMatch) {
    const mStr = mmmMatch[1].toLowerCase();
    const month = MONTH_MAP[mStr];
    if (month) {
      const day = mmmMatch[2].padStart(2, '0');
      const year = mmmMatch[3] || fallbackYear;
      return { isoDate: `${year}-${month}-${day}`, hadCorrections: false };
    }
  }
  return { isoDate: null, hadCorrections: true };
}

console.log("Test Oct 31, 2024:", parseOcrDate("Oct 31, 2024"));
