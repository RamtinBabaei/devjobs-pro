import { jobs as demoJobs } from "../data/jobs";
import type { Job } from "../types/job";
import { isJobArray } from "../utils/typeGuards";
import {
  colorFromName,
  inferExperience,
  inferSkills,
  normalizeJobType,
  parseSalary,
  relativeDate,
  stripHtml,
} from "./remotiveMapper";
import { safeHttpUrl } from "../utils/url";

const API_URL = "https://remotive.com/api/remote-jobs?category=software-dev&limit=30";
const CACHE_KEY = "devjobs:remotive-cache:v3";
const CACHE_TTL = 6 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8_000;
const REMOTIVE_JOBS_URL = "https://remotive.com/remote-jobs";

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  job_type?: string;
  publication_date: string;
  candidate_required_location?: string;
  salary?: string;
  description?: string;
}

export interface JobsResult {
  jobs: Job[];
  source: "api" | "fallback";
  warning?: string;
}

export async function fetchJobs(): Promise<JobsResult> {
  const cachedJobs = readCache();
  if (cachedJobs) {
    return { jobs: cachedJobs, source: "api" };
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Remotive API returned HTTP ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    const rawJobs = readRemoteJobs(payload);
    const jobs = rawJobs.map(mapRemoteJob).filter((job): job is Job => job !== null);

    if (jobs.length === 0) {
      throw new Error("Remotive API returned no usable jobs");
    }

    writeCache(jobs);
    return { jobs, source: "api" };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("DevJobs: live API unavailable, using demo data.", error);
    }

    return {
      jobs: demoJobs,
      source: "fallback",
      warning:
        "Live jobs are temporarily unavailable. The built-in demo dataset is being shown instead.",
    };
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function mapRemoteJob(item: RemotiveJob): Job | null {
  const company = item.company_name.trim();
  const title = item.title.trim();
  const applyUrl = safeHttpUrl(item.url);

  if (!company || !title || !applyUrl) return null;

  const plainDescription = stripHtml(item.description ?? "");
  const salary = parseSalary(item.salary ?? "");
  const skills = inferSkills(`${title} ${plainDescription}`);

  return {
    id: item.id,
    title,
    company,
    companyMark: company.charAt(0).toUpperCase() || "J",
    companyColor: colorFromName(company),
    companyLogoUrl: safeHttpUrl(item.company_logo) ?? undefined,
    posted: relativeDate(item.publication_date),
    location: item.candidate_required_location?.trim() || "Worldwide",
    workMode: "Remote",
    type: normalizeJobType(item.job_type),
    experience: inferExperience(title),
    salaryMin: salary.min,
    salaryMax: salary.max,
    salaryLabel: salary.label,
    skills,
    description:
      plainDescription.slice(0, 520) ||
      "Open the original Remotive listing to review the complete role description.",
    responsibilities: [
      "Review the original Remotive listing for the employer’s complete, verified responsibilities.",
    ],
    requirements: [
      "Review the original Remotive listing for the employer’s complete requirements and eligibility details.",
    ],
    benefits: [
      "Review the original Remotive listing for verified compensation and benefit details.",
    ],
    aboutCompany: `${company} is hiring for this remote role. Job data is sourced from the Remotive public API.`,
    employeeCount: "See original listing",
    website: applyUrl,
    applyUrl,
    source: "remotive",
  };
}

function readRemoteJobs(payload: unknown): RemotiveJob[] {
  if (!isRecord(payload) || !Array.isArray(payload.jobs)) return [];
  return payload.jobs.filter(isRemoteJob);
}

function isRemoteJob(value: unknown): value is RemotiveJob {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "number" &&
    Number.isFinite(value.id) &&
    typeof value.url === "string" &&
    typeof value.title === "string" &&
    typeof value.company_name === "string" &&
    typeof value.publication_date === "string" &&
    (value.company_logo === undefined || typeof value.company_logo === "string") &&
    (value.job_type === undefined || typeof value.job_type === "string") &&
    (value.candidate_required_location === undefined ||
      typeof value.candidate_required_location === "string") &&
    (value.salary === undefined || typeof value.salary === "string") &&
    (value.description === undefined || typeof value.description === "string")
  );
}

function readCache(): Job[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;

    const savedAt = parsed.savedAt;
    const jobs = parsed.jobs;

    if (
      typeof savedAt !== "number" ||
      !Number.isFinite(savedAt) ||
      !Array.isArray(jobs) ||
      Date.now() - savedAt > CACHE_TTL
    ) {
      window.localStorage.removeItem(CACHE_KEY);
      return null;
    }

    if (!isJobArray(jobs) || jobs.length === 0) {
      window.localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return jobs;
  } catch {
    return null;
  }
}

function writeCache(jobs: Job[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), jobs }),
    );
  } catch {
    // Storage can be unavailable in private browsing or when quota is exceeded.
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export { API_URL, REMOTIVE_JOBS_URL };
