// Live loader for Guillaume Helleu's activity index from Google Sheets.
// Any edit in the Sheet is reflected on the site on next load.
const SHEET_ID = '1-rDLUjDXWT5NfQJnbRwbCS_RidZxJc_VRGhJ5LrqdTs';
const SHEET_NAME = 'Activités';

export function parseCSV(text) {
  const rows = [];
  let row = [], field = '', i = 0, inQ = false;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQ = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const clean = (s) => (s || '').trim();
const stripQuotes = (t) => clean(t).replace(/^«\s*/, '').replace(/\s*»$/, '');

export function rowsToItems(rows) {
  let h = rows.findIndex(r => (r[0] || '').trim().toUpperCase() === 'TYPE');
  if (h < 0) h = 1;
  const items = [];
  let lastType = '';
  for (let i = h + 1; i < rows.length; i++) {
    const r = rows[i];
    const title = stripQuotes(r[2]);
    if (!title) continue;
    let type = clean(r[0]);
    if (type) lastType = type; else type = lastType;
    items.push({
      type,
      domain: clean(r[1]),
      title,
      date: clean(r[3]),
      dateNorm: clean(r[4]),
      place: clean(r[5]),
      org: clean(r[6]),
      desc: clean(r[7]),
      format: clean(r[8]),
      resume: clean(r[9]),
      link: clean(r[10])
    });
  }
  return items;
}

export async function loadActivities() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('sheet fetch failed: ' + res.status);
  const csv = await res.text();
  return rowsToItems(parseCSV(csv));
}
