import type { ChangeEvent } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import CompanyLogo from "../components/ui/CompanyLogo";
import { useUserData } from "../context/UserDataContext";
import type { ApplicationStatus } from "../types/job";
import type { AppOutletContext } from "../types/router";

const columns: ApplicationStatus[] = ["Applied", "Interview", "Offer", "Rejected"];

export default function ApplicationsPage() {
  const { openMenu } = useOutletContext<AppOutletContext>();
  const user = useUserData();

  return (
    <>
      <Topbar
        title="Application tracker"
        subtitle="Track the roles you explicitly marked as applied"
        search=""
        onSearchChange={() => undefined}
        location="All locations"
        locationOptions={["All locations"]}
        onLocationChange={() => undefined}
        onMenu={openMenu}
        showSearch={false}
      />

      <div className="min-h-[calc(100vh-90px)] overflow-x-auto bg-slate-50 p-4 sm:p-5">
        <div className="grid min-w-[1000px] grid-cols-4 gap-4">
          {columns.map((status) => {
            const applications = user.applications.filter(
              (application) => application.status === status,
            );

            return (
              <section key={status} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-extrabold text-slate-900">{status}</h2>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">
                    {applications.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {applications.map((application) => (
                    <article
                      key={application.job.id}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex gap-3">
                        <CompanyLogo
                          mark={application.job.companyMark}
                          color={application.job.companyColor}
                          imageUrl={application.job.companyLogoUrl}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/jobs/${application.job.id}`}
                            className="focus-ring rounded text-sm font-bold text-slate-900 hover:text-blue-700"
                          >
                            {application.job.title}
                          </Link>
                          <p className="text-xs text-slate-500">{application.job.company}</p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            Added {formatDate(application.appliedAt)}
                          </p>
                        </div>
                      </div>

                      <label className="mt-3 block">
                        <span className="sr-only">
                          Application status for {application.job.title}
                        </span>
                        <select
                          value={application.status}
                          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                            user.updateApplicationStatus(
                              application.job.id,
                              event.target.value as ApplicationStatus,
                            )
                          }
                          className="focus-ring w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-semibold"
                        >
                          {columns.map((column) => (
                            <option key={column}>{column}</option>
                          ))}
                        </select>
                      </label>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <a
                          href={application.job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring rounded text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Source listing
                        </a>
                        <button
                          type="button"
                          onClick={() => user.removeApplication(application.job.id)}
                          className="focus-ring rounded px-1 text-xs font-semibold text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {user.applications.length === 0 && (
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            Open a job and choose <strong>Mark as applied</strong>. It will then appear in this
            tracker.
          </div>
        )}
      </div>
    </>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
