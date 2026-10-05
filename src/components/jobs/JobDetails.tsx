import { useState } from "react";
import type { Job } from "../../types/job";
import { formatSalary } from "../../utils/jobUtils";
import CompanyLogo from "../ui/CompanyLogo";
import Icon from "../ui/Icon";

interface JobDetailsProps {
  job: Job | null;
  saved: boolean;
  applied: boolean;
  onToggleSave: () => void;
  onMarkApplied: () => void;
  emptyMessage?: string;
}

type Tab = "Overview" | "About" | "Requirements" | "Tech stack" | "Benefits";

const TABS: Tab[] = ["Overview", "About", "Requirements", "Tech stack", "Benefits"];

export default function JobDetails({
  job,
  saved,
  applied,
  onToggleSave,
  onMarkApplied,
  emptyMessage = "Select a job to view details",
}: JobDetailsProps) {
  const [tab, setTab] = useState<Tab>("Overview");

  if (!job) {
    return (
      <section className="grid min-h-[420px] place-items-center border-l border-slate-200 bg-white p-8 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100">
            <Icon name="briefcase" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold">{emptyMessage}</h2>
        </div>
      </section>
    );
  }

  const isLiveJob = job.source === "remotive";

  return (
    <section className="border-l border-slate-200 bg-white p-5 sm:p-7">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
          <div className="flex gap-4">
            <CompanyLogo
              mark={job.companyMark}
              color={job.companyColor}
              imageUrl={job.companyLogoUrl}
              size="lg"
            />

            <div>
              <h1 className="text-xl font-black sm:text-2xl">{job.title}</h1>
              <div className="mt-1 text-sm text-slate-500">{job.company}</div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                <span>{job.workMode} · {job.location}</span>
                <span>{job.type}</span>
                <span>{formatSalary(job)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onToggleSave}
              aria-pressed={saved}
              className={`focus-ring flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold ${
                saved
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon name="bookmark" size={17} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save"}
            </button>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
            >
              {isLiveJob ? "Open listing" : "Browse live jobs"}
              <Icon name="external" size={15} />
            </a>

            <button
              type="button"
              onClick={onMarkApplied}
              disabled={applied}
              className={`focus-ring h-11 rounded-xl px-4 text-sm font-bold ${
                applied
                  ? "cursor-default bg-emerald-50 text-emerald-700"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {applied ? "Marked as applied" : "Mark as applied"}
            </button>
          </div>
        </div>

        <div
          className="mt-6 flex gap-6 overflow-x-auto border-b border-slate-200 text-sm font-semibold text-slate-500"
          role="tablist"
          aria-label="Job details"
        >
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              id={`job-tab-${tabId(item)}`}
              aria-controls={`job-panel-${tabId(item)}`}
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={`focus-ring relative whitespace-nowrap rounded-t-md pb-3 ${
                tab === item ? "text-blue-700" : "hover:text-slate-800"
              }`}
            >
              {item}
              {tab === item && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div
          id={`job-panel-${tabId(tab)}`}
          className="py-6"
          role="tabpanel"
          aria-labelledby={`job-tab-${tabId(tab)}`}
        >
          {tab === "Overview" && (
            <div className="space-y-7">
              <Section title="About the role" text={job.description} />
              <BulletList title="What you’ll do" items={job.responsibilities} />
              <BulletList title="What we’re looking for" items={job.requirements} />
            </div>
          )}

          {tab === "About" && (
            <div>
              <Section title={`About ${job.company}`} text={job.aboutCompany} />
              <a
                className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md text-sm font-bold text-blue-700"
                href={job.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Original listing
                <Icon name="external" size={15} />
              </a>

              {isLiveJob && (
                <p className="mt-4 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-700">
                  Job data is sourced from the Remotive public API. Full details and applications
                  remain on the original Remotive listing.
                </p>
              )}
            </div>
          )}

          {tab === "Requirements" && (
            <BulletList title="Requirements" items={job.requirements} />
          )}

          {tab === "Tech stack" && (
            <div>
              <h2 className="font-extrabold">Tech stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tab === "Benefits" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {job.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700"
                >
                  {benefit}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="font-extrabold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-extrabold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function tabId(tab: Tab): string {
  return tab.toLowerCase().replace(/\s+/g, "-");
}
