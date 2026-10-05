import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import {
  EXPERIENCE_OPTIONS,
  JOB_TYPE_OPTIONS,
  SALARY_OPTIONS,
  SORT_OPTIONS,
  WORK_MODE_OPTIONS,
  type SortOption,
} from "../../utils/jobUtils";
import Icon from "../ui/Icon";

interface FilterBarProps {
  workMode: string;
  setWorkMode: (value: string) => void;
  experience: string;
  setExperience: (value: string) => void;
  salary: string;
  setSalary: (value: string) => void;
  jobType: string;
  setJobType: (value: string) => void;
  techStack: string;
  setTechStack: (value: string) => void;
  techStackOptions: string[];
  sort: SortOption;
  setSort: (value: SortOption) => void;
  onReset: () => void;
}

function SelectChip({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
        className="focus-ring h-10 appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-8 text-sm font-semibold text-slate-600 hover:border-slate-300"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
        <Icon name="chevron" size={14} />
      </span>
    </label>
  );
}

export default function FilterBar(props: FilterBarProps) {
  const hasAdvancedFilter =
    props.salary !== "Any salary" ||
    props.jobType !== "All job types" ||
    props.techStack !== "Any tech stack";

  const [advancedOpen, setAdvancedOpen] = useState(hasAdvancedFilter);

  useEffect(() => {
    if (hasAdvancedFilter) setAdvancedOpen(true);
  }, [hasAdvancedFilter]);

  return (
    <div className="border-b border-slate-200/80 bg-white px-4 py-4 sm:px-6 xl:px-7">
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setAdvancedOpen((current) => !current)}
          className={`focus-ring flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
            advancedOpen || hasAdvancedFilter
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
          aria-expanded={advancedOpen}
          aria-controls="advanced-job-filters"
        >
          <Icon name="filter" size={17} />
          All filters
          {hasAdvancedFilter && (
            <span className="h-2 w-2 rounded-full bg-blue-600" aria-label="Advanced filters active" />
          )}
        </button>

        <SelectChip value={props.workMode} onChange={props.setWorkMode} label="Work mode">
          {WORK_MODE_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </SelectChip>

        <SelectChip
          value={props.experience}
          onChange={props.setExperience}
          label="Experience level"
        >
          {EXPERIENCE_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </SelectChip>

        <button
          type="button"
          onClick={props.onReset}
          className="focus-ring ml-auto rounded-lg px-2 py-1 text-sm font-semibold text-slate-400 transition hover:text-slate-700"
        >
          Reset
        </button>

        <label className="relative">
          <span className="sr-only">Sort jobs</span>
          <select
            value={props.sort}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              props.setSort(event.target.value as SortOption)
            }
            className="focus-ring h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-9 text-sm font-semibold text-slate-600"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-slate-400">
            <Icon name="chevron" size={14} />
          </span>
        </label>
      </div>

      {advancedOpen && (
        <div
          id="advanced-job-filters"
          className="mt-3 flex flex-wrap gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-3"
        >
          <SelectChip value={props.salary} onChange={props.setSalary} label="Minimum salary">
            {SALARY_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </SelectChip>

          <SelectChip value={props.jobType} onChange={props.setJobType} label="Job type">
            {JOB_TYPE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </SelectChip>

          <SelectChip value={props.techStack} onChange={props.setTechStack} label="Tech stack">
            {props.techStackOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </SelectChip>
        </div>
      )}
    </div>
  );
}
