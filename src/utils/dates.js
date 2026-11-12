const pad = (n) => String(n).padStart(2, "0");
export const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** [start, end] as yyyy-mm-dd covering the last `days` days including today. */
export const lastRange = (days) => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1));
  return [fmtDate(start), fmtDate(today)];
};
