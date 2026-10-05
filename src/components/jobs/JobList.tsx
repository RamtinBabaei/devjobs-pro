import type { Job } from "../../types/job";
import Icon from "../ui/Icon";
import JobCard from "./JobCard";

interface JobListProps {
  jobs: Job[];
  selectedId: number | null;
  savedIds: number[];
  onSelect: (id: number) => void;
  onToggleSave: (id: number) => void;
  view: "all" | "saved" | "applied";
  onClearFilters: () => void;
}

const viewTitles: Record<JobListProps["view"], string> = {
  all: "jobs found",
  saved: "saved jobs",
  applied: "applications",
};

export default function JobList({
  jobs,
  selectedId,
  savedIds,
  onSelect,
  onToggleSave,
  view,
  onClearFilters,
}: JobListProps) {
  return (
    <section className="min-h-0 bg-slate-50/60 p-4 sm:p-5 xl:p-6" aria-label="Job results">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-950">
            {jobs.length} {viewTitles[view]}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {view === "all"
              ? "Developer opportunities from live or fallback data"
              : view === "saved"
                ? "Jobs you bookmarked on this device"
                : "Jobs you marked as applied"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            selected={job.id === selectedId}
            saved={savedIds.includes(job.id)}
            onSelect={() => onSelect(job.id)}
            onSave={() => onToggleSave(job.id)}
          />
        ))}

        {jobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500">
              <Icon name="search" size={20} />
            </div>
            <h3 className="mt-4 font-bold text-slate-900">
              {view === "saved"
                ? "No saved jobs yet"
                : view === "applied"
                  ? "No applications yet"
                  : "No jobs found"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {view === "all"
                ? "Try a different keyword or clear your filters."
                : "Switch back to Find Jobs and choose a role to get started."}
            </p>
            {view === "all" && (
              <button
                type="button"
                onClick={onClearFilters}
                className="focus-ring mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
