import type { Experience, JobType } from "../types/job";

export interface ParsedSalary {
  min: number | null;
  max: number | null;
  label: string;
}

const SKILL_PATTERNS: ReadonlyArray<[string, RegExp]> = [
  ["React", /\breact(?:\.js)?\b/i],
  ["TypeScript", /\btypescript\b/i],
  ["JavaScript", /\bjavascript\b/i],
  ["Next.js", /\bnext(?:\.js|js)?\b/i],
  ["Node.js", /\bnode(?:\.js|js)?\b/i],
  ["Python", /\bpython\b/i],
  ["Go", /\b(?:go|golang)\b/i],
  ["Java", /\bjava\b/i],
  ["C#", /(?:^|\s)c#(?:\s|$)/i],
  ["AWS", /\baws\b|amazon web services/i],
  ["Azure", /\bazure\b/i],
  ["GCP", /\bgcp\b|google cloud/i],
  ["Kubernetes", /\bkubernetes\b|\bk8s\b/i],
  ["Docker", /\bdocker\b/i],
  ["PostgreSQL", /\bpostgres(?:ql)?\b/i],
  ["GraphQL", /\bgraphql\b/i],
  ["Vue", /\bvue(?:\.js|js)?\b/i],
  ["Angular", /\bangular\b/i],
  ["Ruby", /\bruby\b/i],
  ["Rails", /\brails\b|ruby on rails/i],
  ["PHP", /\bphp\b/i],
  ["Laravel", /\blaravel\b/i],
  ["Rust", /\brust\b/i],
  ["Terraform", /\bterraform\b/i],
  ["CSS", /\bcss\b/i],
  ["HTML", /\bhtml\b/i],
  ["SQL", /\bsql\b/i],
];

const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  bull: "•",
};

export function normalizeJobType(value?: string): JobType {
  const normalized = (value ?? "").toLowerCase().replace(/[_-]+/g, " ");

  if (normalized.includes("part")) return "Part-time";
  if (normalized.includes("contract")) return "Contract";
  if (normalized.includes("freelance")) return "Freelance";
  if (normalized.includes("intern")) return "Internship";

  return "Full-time";
}

export function inferExperience(title: string): Experience {
  const normalizedTitle = title.toLowerCase();

  if (/\b(junior|entry|entry-level|graduate|intern|associate)\b/.test(normalizedTitle)) {
    return "Junior";
  }

  if (/\b(staff|principal|lead|senior|sr\.?|manager|director|head)\b/.test(normalizedTitle)) {
    return "Senior";
  }

  if (/\b(mid|mid-level|intermediate)\b/.test(normalizedTitle)) {
    return "Mid-level";
  }

  return "Not specified";
}

export function inferSkills(text: string): string[] {
  const found = SKILL_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(
    ([skill]) => skill,
  );

  return found.length > 0 ? found.slice(0, 6) : ["Software Development", "Remote"];
}

export function parseSalary(value: string): ParsedSalary {
  const label = normalizeWhitespace(value);
  if (!label) {
    return { min: null, max: null, label: "Salary not listed" };
  }

  // Do not convert non-annual compensation into an annual K value.
  const isPeriodicRate =
    /\b(hour|hourly|per hour|per hr|month|monthly|per month|week|weekly|per week|day|daily|per day)\b|\/\s*(?:h|hr|hour|mo|month|wk|week|day)\b/i.test(
      label,
    );
  if (isPeriodicRate) {
    return { min: null, max: null, label };
  }

  // Only normalize annual values when the currency is USD (or explicitly uses $).
  const explicitNonUsdCurrency = /\b(CAD|EUR|GBP|AUD|NZD|INR|CHF|SEK|NOK|DKK|JPY|CNY|RMB)\b|[€£¥]/i.test(
    label,
  );
  const looksUsd = /\bUSD\b|\$/i.test(label);

  if (explicitNonUsdCurrency && !/\bUSD\b/i.test(label)) {
    return { min: null, max: null, label };
  }

  const matches = [...label.matchAll(/(\d{1,3}(?:[ ,]\d{3})+|\d+(?:\.\d+)?)(\s*[kK])?/g)];
  const values = matches
    .map((match) => {
      const raw = match[1]?.replace(/[ ,]/g, "") ?? "";
      const numeric = Number(raw);
      if (!Number.isFinite(numeric)) return null;

      const hasKSuffix = Boolean(match[2]);
      const annualInThousands = hasKSuffix ? numeric : numeric >= 1000 ? numeric / 1000 : numeric;
      return Math.round(annualInThousands * 10) / 10;
    })
    .filter((number): number is number => number !== null && number > 0);

  // Without an explicit currency, keep the label but avoid treating ambiguous values as USD.
  if (!looksUsd || values.length === 0) {
    return { min: null, max: null, label };
  }

  return {
    min: values[0] ?? null,
    max: values[1] ?? values[0] ?? null,
    label,
  };
}

export function stripHtml(value: string): string {
  const withoutUnsafeBlocks = value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  const decoded = withoutUnsafeBlocks.replace(
    /&(#\d+|#x[\da-f]+|[a-z]+);/gi,
    (entity, token: string) => {
      const normalized = token.toLowerCase();

      if (normalized.startsWith("#x")) {
        const codePoint = Number.parseInt(normalized.slice(2), 16);
        return safeCodePoint(codePoint, entity);
      }

      if (normalized.startsWith("#")) {
        const codePoint = Number.parseInt(normalized.slice(1), 10);
        return safeCodePoint(codePoint, entity);
      }

      return HTML_ENTITIES[normalized] ?? entity;
    },
  );

  return normalizeWhitespace(decoded);
}

export function relativeDate(value: string): string {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Recently";

  const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));

  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function colorFromName(value: string): string {
  const colors = ["#2563eb", "#635bff", "#0f766e", "#7c3aed", "#111827", "#0369a1", "#be123c"];
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) | 0;
  }

  return colors[Math.abs(hash) % colors.length] ?? "#2563eb";
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").replace(/\s+([.,!?;:])/g, "$1").trim();
}

function safeCodePoint(codePoint: number, fallback: string): string {
  if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
    return fallback;
  }

  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return fallback;
  }
}
