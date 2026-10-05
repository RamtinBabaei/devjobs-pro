import type { Job } from "../../types/job";
import { formatSalary } from "../../utils/jobUtils";
import CompanyLogo from "../ui/CompanyLogo";
import Icon from "../ui/Icon";

interface JobCardProps {
  job: Job;
  selected: boolean;
  saved: boolean;
  onSelect: () => void;
  onSave: () => void;
}

export default function JobCard({
  job,
  selected,
  saved,
  onSelect,
  onSave,
}: JobCardProps) {
  return (
    <article
      className={`rounded-2xl border p-4 transition sm:p-5 ${
        selected
          ? "border-blue-400 bg-blue-50/40 shadow-[0_10px_30px_rgba(37,99,235,0.08)]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onSelect}
          className="focus-ring flex min-w-0 flex-1 gap-3 rounded-xl text-left sm:gap-4"
          aria-current={selected ? "true" : undefined}
          aria-label={`View ${job.title} at ${job.company}`}
        >
          <CompanyLogo
            mark={job.companyMark}
            color={job.companyColor}
            imageUrl={job.companyLogoUrl}
          />

          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-extrabold text-slate-950 sm:text-base">
              {job.title}
            </h3>
            <div className="mt-0.5 text-sm text-slate-500">{job.company}</div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <Icon name="pin" size={14} />
                {job.workMode} · {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="briefcase" size={14} />
                {job.type}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="chart" size={14} />
                {formatSalary(job)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  +{job.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-xs text-slate-400">{job.posted}</span>
          <button
            type="button"
            onClick={onSave}
            aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
            aria-pressed={saved}
            className={`focus-ring rounded-lg p-2 ${
              saved ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            <Icon name="bookmark" size={17} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}
