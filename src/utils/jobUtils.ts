import type { Experience, Job, JobType, WorkMode } from "../types/job";

export type SortOption = "relevant" | "salary-high" | "salary-low" | "company";

export const WORK_MODE_OPTIONS = ["All modes", "Remote", "Hybrid", "On-site"] as const;
export const EXPERIENCE_OPTIONS = [
  "All experience",
  "Junior",
  "Mid-level",
  "Mid – Senior",
  "Senior",
  "Not specified",
] as const;
export const SALARY_OPTIONS = ["Any salary", "$120K+", "$150K+", "$180K+", "$200K+"] as const;
export const JOB_TYPE_OPTIONS = [
  "All job types",
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
] as const;
export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: "relevant", label: "Most relevant" },
  { value: "salary-high", label: "Highest salary" },
  { value: "salary-low", label: "Lowest salary" },
  { value: "company", label: "Company A–Z" },
];

export interface JobFilters {
  search: string;
  location: string;
  workMode: string;
  experience: string;
  salary: string;
  jobType: string;
  techStack: string;
  sort: SortOption;
}

export const DEFAULT_FILTERS: JobFilters = {
  search: "",
  location: "All locations",
  workMode: "All modes",
  experience: "All experience",
  salary: "Any salary",
  jobType: "All job types",
  techStack: "Any tech stack",
  sort: "relevant",
};

export function filterAndSortJobs(allJobs: Job[], filters: JobFilters): Job[] {
  const query = filters.search.trim().toLowerCase();

  const filtered = allJobs.filter((job) => {
    const searchableText = [
      job.title,
      job.company,
      job.location,
      job.workMode,
      job.type,
      job.experience,
      ...job.skills,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchableText.includes(query)) &&
      (filters.location === "All locations" || job.location === filters.location) &&
      (filters.workMode === "All modes" || job.workMode === filters.workMode) &&
      (filters.experience === "All experience" || job.experience === filters.experience) &&
      (filters.jobType === "All job types" || job.type === filters.jobType) &&
      (filters.techStack === "Any tech stack" || job.skills.includes(filters.techStack)) &&
      matchesSalaryFilter(job, filters.salary)
    );
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === "salary-high") {
      return (b.salaryMax ?? -1) - (a.salaryMax ?? -1);
    }

    if (filters.sort === "salary-low") {
      return (
        (a.salaryMin ?? Number.MAX_SAFE_INTEGER) -
        (b.salaryMin ?? Number.MAX_SAFE_INTEGER)
      );
    }

    if (filters.sort === "company") {
      return a.company.localeCompare(b.company);
    }

    const featuredDifference = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredDifference !== 0) return featuredDifference;

    // Modern JavaScript sorting is stable, so returning 0 preserves the
    // upstream API order for the default "Most relevant" view.
    return 0;
  });
}

export function matchesSalaryFilter(job: Job, salary: string): boolean {
  if (salary === "Any salary") return true;
  if (job.salaryMin === null) return false;
  if (salary === "$120K+") return job.salaryMin >= 120;
  if (salary === "$150K+") return job.salaryMin >= 150;
  if (salary === "$180K+") return job.salaryMin >= 180;
  if (salary === "$200K+") return job.salaryMin >= 200;
  return true;
}

export function getLocationOptions(jobs: Job[]): string[] {
  return [
    "All locations",
    ...Array.from(new Set(jobs.map((job) => job.location))).sort(),
  ];
}

export function getTechStackOptions(jobs: Job[]): string[] {
  return [
    "Any tech stack",
    ...Array.from(new Set(jobs.flatMap((job) => job.skills))).sort(),
  ];
}

export function formatSalary(job: Job): string {
  if (job.salaryMin !== null && job.salaryMax !== null) {
    if (job.salaryMin === job.salaryMax) return `$${job.salaryMin}K`;
    return `$${job.salaryMin}K – $${job.salaryMax}K`;
  }

  return job.salaryLabel || "Salary not listed";
}

export function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function isWorkMode(value: string): value is WorkMode {
  return value === "Remote" || value === "Hybrid" || value === "On-site";
}

export function isExperience(value: string): value is Experience {
  return (
    value === "Junior" ||
    value === "Mid-level" ||
    value === "Mid – Senior" ||
    value === "Senior" ||
    value === "Not specified"
  );
}

export function isJobType(value: string): value is JobType {
  return (
    value === "Full-time" ||
    value === "Part-time" ||
    value === "Contract" ||
    value === "Freelance" ||
    value === "Internship"
  );
}

export function isSalaryOption(value: string): boolean {
  return SALARY_OPTIONS.includes(value as (typeof SALARY_OPTIONS)[number]);
}
