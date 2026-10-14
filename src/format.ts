type Lang = "en" | "ar";
type Unit = "day" | "hour" | "minute";
type Forms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

const WORDS: Record<Lang, Record<Unit, Forms>> = {
  en: {
    day: { one: "day", other: "days" },
    hour: { one: "hour", other: "hours" },
    minute: { one: "minute", other: "minutes" },
  },
  ar: {
    day: { one: "يوم", two: "يومين", few: "أيام", other: "يوم" },
    hour: { one: "ساعة", two: "ساعتين", few: "ساعات", other: "ساعة" },
    minute: { one: "دقيقة", two: "دقيقتين", few: "دقايق", other: "دقيقة" },
  },
};

const plural = {
  en: new Intl.PluralRules("en"),
  ar: new Intl.PluralRules("ar"),
};

const numbers = {
  en: new Intl.NumberFormat("en"),
  ar: new Intl.NumberFormat("ar-EG"),
};

const arList = new Intl.ListFormat("ar", { type: "conjunction" });

function formatUnit(n: number, unit: Unit, lang: Lang): string {
  const cat = plural[lang].select(n);
  const forms = WORDS[lang][unit];
  const word = forms[cat] ?? forms.other;
  if (lang === "ar" && (cat === "one" || cat === "two")) return word;
  return `${numbers[lang].format(n)} ${word}`;
}

// minutes round up so it never says 0; hours round to nearest
export function formatDuration(ms: number, lang: Lang = "en"): string {
  const totalMinutes = Math.ceil(ms / 60_000);

  if (totalMinutes < 60) {
    return formatUnit(totalMinutes, "minute", lang);
  }

  const totalHours = Math.round(ms / 3_600_000);
  const units: [Unit, number][] = [
    ["day", Math.floor(totalHours / 24)],
    ["hour", totalHours % 24],
  ];

  const parts = units
    .filter(([, n]) => n > 0)
    .map(([unit, n]) => formatUnit(n, unit, lang));

  return lang === "ar" ? arList.format(parts) : parts.join(", ");
}

export function parseDate(str: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return undefined;

  const [y, m, d] = str.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  if (date.getUTCFullYear() !== y) return undefined;
  if (date.getUTCMonth() !== m - 1) return undefined;
  if (date.getUTCDate() !== d) return undefined;

  return date;
}
