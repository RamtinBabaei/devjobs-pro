import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { fetchJobs, type JobsResult } from "../api/remotive";
import FilterBar from "../components/jobs/FilterBar";
import JobDetails from "../components/jobs/JobDetails";
import JobList from "../components/jobs/JobList";
import Topbar from "../components/layout/Topbar";
import { useUserData } from "../context/UserDataContext";
import type { AppOutletContext } from "../types/router";
import {
  DEFAULT_FILTERS,
  filterAndSortJobs,
  getLocationOptions,
  getTechStackOptions,
  isExperience,
  isJobType,
  isSalaryOption,
  isSortOption,
  isWorkMode,
  type JobFilters,
  type SortOption,
} from "../utils/jobUtils";

export default function JobsPage() {
  const { openMenu } = useOutletContext<AppOutletContext>();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const user = useUserData();

  const query = useQuery<JobsResult>({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  const allJobs = query.data?.jobs ?? [];
  const locationOptions = useMemo(() => getLocationOptions(allJobs), [allJobs]);
  const techStackOptions = useMemo(() => getTechStackOptions(allJobs), [allJobs]);

  const filters = readFilters(params, locationOptions, techStackOptions);

  const filteredJobs = useMemo(
    () => filterAndSortJobs(allJobs, filters),
    [
      allJobs,
      filters.experience,
      filters.jobType,
      filters.location,
      filters.salary,
      filters.search,
      filters.sort,
      filters.techStack,
      filters.workMode,
    ],
  );

  const selectedJob = useMemo(() => {
    if (!jobId) return filteredJobs[0] ?? null;

    const numericId = Number(jobId);
    if (!Number.isFinite(numericId)) return null;

    return (
      allJobs.find((job) => job.id === numericId) ??
      user.savedJobs.find((job) => job.id === numericId) ??
      user.applications.find((application) => application.job.id === numericId)?.job ??
      null
    );
  }, [allJobs, filteredJobs, jobId, user.applications, user.savedJobs]);

  const updateFilter = (key: string, value: string, defaultValue: string) => {
    const next = new URLSearchParams(params);

    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);

    setParams(next, { replace: true });
  };

  const resetFilters = () => setParams({}, { replace: true });

  const selectJob = (id: number) => {
    const queryString = params.toString();
    navigate(queryString ? `/jobs/${id}?${queryString}` : `/jobs/${id}`);
  };

  if (query.isError) {
    return (
      <>
        <Topbar
          search=""
          onSearchChange={() => undefined}
          location="All locations"
          locationOptions={["All locations"]}
          onLocationChange={() => undefined}
          onMenu={openMenu}
        />
        <div className="grid min-h-[500px] place-items-center bg-slate-50 p-8 text-center">
          <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8">
            <h2 className="text-xl font-extrabold text-slate-900">Unable to load jobs</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Something unexpected happened while preparing the job data.
            </p>
            <button
              type="button"
              onClick={() => query.refetch()}
              className="focus-ring mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (query.isPending) {
    return (
      <>
        <Topbar
          search=""
          onSearchChange={() => undefined}
          location="All locations"
          locationOptions={["All locations"]}
          onLocationChange={() => undefined}
          onMenu={openMenu}
        />
        <Skeleton />
      </>
    );
  }

  return (
    <>
      <Topbar
        search={filters.search}
        onSearchChange={(value) => updateFilter("q", value, "")}
        location={filters.location}
        locationOptions={locationOptions}
        onLocationChange={(value) =>
          updateFilter("location", value, DEFAULT_FILTERS.location)
        }
        onMenu={openMenu}
      />

      {query.data?.warning && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-800">
          <strong>Offline-friendly fallback:</strong> {query.data.warning}
          <button
            type="button"
            className="focus-ring ml-2 rounded px-1 font-bold underline"
            onClick={() => query.refetch()}
          >
            Retry live API
          </button>
        </div>
      )}

      <FilterBar
        workMode={filters.workMode}
        setWorkMode={(value) => updateFilter("mode", value, DEFAULT_FILTERS.workMode)}
        experience={filters.experience}
        setExperience={(value) =>
          updateFilter("experience", value, DEFAULT_FILTERS.experience)
        }
        salary={filters.salary}
        setSalary={(value) => updateFilter("salary", value, DEFAULT_FILTERS.salary)}
        jobType={filters.jobType}
        setJobType={(value) => updateFilter("type", value, DEFAULT_FILTERS.jobType)}
        techStack={filters.techStack}
        setTechStack={(value) => updateFilter("tech", value, DEFAULT_FILTERS.techStack)}
        techStackOptions={techStackOptions}
        sort={filters.sort}
        setSort={(value) => updateFilter("sort", value, DEFAULT_FILTERS.sort)}
        onReset={resetFilters}
      />

      <div className="grid min-h-[calc(100vh-170px)] grid-cols-1 xl:grid-cols-[minmax(380px,.9fr)_minmax(560px,1.25fr)]">
        <JobList
          jobs={filteredJobs}
          selectedId={selectedJob?.id ?? null}
          savedIds={user.savedJobs.map((job) => job.id)}
          onSelect={selectJob}
          onToggleSave={(id) => {
            const job = allJobs.find((item) => item.id === id);
            if (job) user.toggleSave(job);
          }}
          view="all"
          onClearFilters={resetFilters}
        />

        <JobDetails
          key={selectedJob?.id ?? "empty"}
          job={selectedJob}
          saved={selectedJob ? user.isSaved(selectedJob.id) : false}
          applied={selectedJob ? user.isApplied(selectedJob.id) : false}
          onToggleSave={() => {
            if (selectedJob) user.toggleSave(selectedJob);
          }}
          onMarkApplied={() => {
            if (selectedJob) user.markApplied(selectedJob);
          }}
          emptyMessage={
            jobId
              ? "This job is no longer available in the current or saved data."
              : "Select a job to view details"
          }
        />
      </div>

      <div className="border-t border-slate-200 bg-white px-6 py-3 text-xs text-slate-400">
        {query.data?.source === "api" ? (
          <span>
            Job data sourced from the{" "}
            <a
              href="https://remotive.com/remote-jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:underline"
            >
              Remotive public API
            </a>
            .
          </span>
        ) : (
          "Built-in demo dataset active."
        )}
      </div>
    </>
  );
}

function readFilters(
  params: URLSearchParams,
  locationOptions: string[],
  techStackOptions: string[],
): JobFilters {
  const search = params.get("q") ?? "";

  const rawLocation = params.get("location") ?? DEFAULT_FILTERS.location;
  const location = locationOptions.includes(rawLocation)
    ? rawLocation
    : DEFAULT_FILTERS.location;

  const rawWorkMode = params.get("mode") ?? DEFAULT_FILTERS.workMode;
  const workMode =
    rawWorkMode === DEFAULT_FILTERS.workMode || isWorkMode(rawWorkMode)
      ? rawWorkMode
      : DEFAULT_FILTERS.workMode;

  const rawExperience = params.get("experience") ?? DEFAULT_FILTERS.experience;
  const experience =
    rawExperience === DEFAULT_FILTERS.experience || isExperience(rawExperience)
      ? rawExperience
      : DEFAULT_FILTERS.experience;

  const rawSalary = params.get("salary") ?? DEFAULT_FILTERS.salary;
  const salary = isSalaryOption(rawSalary) ? rawSalary : DEFAULT_FILTERS.salary;

  const rawJobType = params.get("type") ?? DEFAULT_FILTERS.jobType;
  const jobType =
    rawJobType === DEFAULT_FILTERS.jobType || isJobType(rawJobType)
      ? rawJobType
      : DEFAULT_FILTERS.jobType;

  const rawTechStack = params.get("tech") ?? DEFAULT_FILTERS.techStack;
  const techStack = techStackOptions.includes(rawTechStack)
    ? rawTechStack
    : DEFAULT_FILTERS.techStack;

  const rawSort = params.get("sort") ?? DEFAULT_FILTERS.sort;
  const sort: SortOption = isSortOption(rawSort) ? rawSort : DEFAULT_FILTERS.sort;

  return {
    search,
    location,
    workMode,
    experience,
    salary,
    jobType,
    techStack,
    sort,
  };
}

function Skeleton() {
  return (
    <div className="grid min-h-[560px] grid-cols-1 xl:grid-cols-2" aria-label="Loading jobs">
      <div className="space-y-4 bg-slate-50 p-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
            <div className="mt-8 h-8 rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="hidden animate-pulse border-l border-slate-200 bg-white p-8 xl:block">
        <div className="h-7 w-2/3 rounded bg-slate-200" />
        <div className="mt-4 h-4 w-1/3 rounded bg-slate-100" />
        <div className="mt-10 h-4 w-full rounded bg-slate-100" />
        <div className="mt-3 h-4 w-11/12 rounded bg-slate-100" />
        <div className="mt-3 h-4 w-4/5 rounded bg-slate-100" />
      </div>
    </div>
  );
}
