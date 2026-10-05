export type WorkMode = "Remote" | "Hybrid" | "On-site";

export type JobType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Freelance"
  | "Internship";

export type Experience =
  | "Junior"
  | "Mid-level"
  | "Mid – Senior"
  | "Senior"
  | "Not specified";

export type JobSource = "remotive" | "demo";

export interface Job {
  id: number;
  title: string;
  company: string;
  companyMark: string;
  companyColor: string;
  companyLogoUrl?: string;
  posted: string;
  location: string;
  workMode: WorkMode;
  type: JobType;
  experience: Experience;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryLabel: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  aboutCompany: string;
  employeeCount: string;
  website: string;
  applyUrl: string;
  featured?: boolean;
  source: JobSource;
}

export type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Rejected";

export interface ApplicationRecord {
  job: Job;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
}
