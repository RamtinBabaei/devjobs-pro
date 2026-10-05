import type { ApplicationRecord, ApplicationStatus, Job } from "../types/job";

export function isJob(value: unknown): value is Job {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "number" &&
    Number.isFinite(value.id) &&
    typeof value.title === "string" &&
    typeof value.company === "string" &&
    typeof value.companyMark === "string" &&
    typeof value.companyColor === "string" &&
    (value.companyLogoUrl === undefined || isSafeHttpUrl(value.companyLogoUrl)) &&
    typeof value.posted === "string" &&
    typeof value.location === "string" &&
    isWorkModeValue(value.workMode) &&
    isJobTypeValue(value.type) &&
    isExperienceValue(value.experience) &&
    (value.salaryMin === null || isFiniteNonNegativeNumber(value.salaryMin)) &&
    (value.salaryMax === null || isFiniteNonNegativeNumber(value.salaryMax)) &&
    typeof value.salaryLabel === "string" &&
    isStringArray(value.skills) &&
    typeof value.description === "string" &&
    isStringArray(value.responsibilities) &&
    isStringArray(value.requirements) &&
    isStringArray(value.benefits) &&
    typeof value.aboutCompany === "string" &&
    typeof value.employeeCount === "string" &&
    isSafeHttpUrl(value.website) &&
    isSafeHttpUrl(value.applyUrl) &&
    (value.featured === undefined || typeof value.featured === "boolean") &&
    (value.source === "remotive" || value.source === "demo")
  );
}

export function isJobArray(value: unknown): value is Job[] {
  return Array.isArray(value) && value.every(isJob);
}

export function isApplicationRecordArray(value: unknown): value is ApplicationRecord[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        isJob(item.job) &&
        isApplicationStatus(item.status) &&
        isValidDateString(item.appliedAt) &&
        isValidDateString(item.updatedAt),
    )
  );
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return value === "Applied" || value === "Interview" || value === "Offer" || value === "Rejected";
}

function isWorkModeValue(value: unknown): boolean {
  return value === "Remote" || value === "Hybrid" || value === "On-site";
}

function isJobTypeValue(value: unknown): boolean {
  return (
    value === "Full-time" ||
    value === "Part-time" ||
    value === "Contract" ||
    value === "Freelance" ||
    value === "Internship"
  );
}

function isExperienceValue(value: unknown): boolean {
  return (
    value === "Junior" ||
    value === "Mid-level" ||
    value === "Mid – Senior" ||
    value === "Senior" ||
    value === "Not specified"
  );
}

function isSafeHttpUrl(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isValidDateString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && Number.isFinite(Date.parse(value));
}
