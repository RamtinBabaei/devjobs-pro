import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import JobCard from "../components/jobs/JobCard";
import Topbar from "../components/layout/Topbar";
import { useUserData } from "../context/UserDataContext";
import type { AppOutletContext } from "../types/router";

export default function SavedPage() {
  const { openMenu } = useOutletContext<AppOutletContext>();
  const user = useUserData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const jobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return user.savedJobs;

    return user.savedJobs.filter((job) =>
      [job.title, job.company, job.location, ...job.skills]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search, user.savedJobs]);

  return (
    <>
      <Topbar
        title="Saved jobs"
        subtitle="Roles bookmarked on this device"
        search={search}
        onSearchChange={setSearch}
        location="All locations"
        locationOptions={["All locations"]}
        onLocationChange={() => undefined}
        onMenu={openMenu}
        showLocation={false}
      />

      <section className="min-h-[calc(100vh-90px)] bg-slate-50/60 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              selected={false}
              saved
              onSelect={() => navigate(`/jobs/${job.id}`)}
              onSave={() => user.toggleSave(job)}
            />
          ))}

          {jobs.length === 0 && (
            <EmptyState
              text={
                user.savedJobs.length > 0
                  ? "No saved jobs match your search."
                  : "Save a role from Find Jobs and it will appear here."
              }
            />
          )}
        </div>
      </section>
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
