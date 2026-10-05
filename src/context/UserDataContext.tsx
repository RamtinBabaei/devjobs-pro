import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { ApplicationRecord, ApplicationStatus, Job } from "../types/job";
import { isApplicationRecordArray, isBoolean, isJobArray } from "../utils/typeGuards";

interface UserDataContextValue {
  savedJobs: Job[];
  applications: ApplicationRecord[];
  alertsEnabled: boolean;
  toggleSave: (job: Job) => void;
  isSaved: (id: number) => boolean;
  markApplied: (job: Job) => void;
  isApplied: (id: number) => boolean;
  updateApplicationStatus: (id: number, status: ApplicationStatus) => void;
  removeApplication: (id: number) => void;
  toggleAlerts: () => void;
}

const UserDataContext = createContext<UserDataContextValue | null>(null);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [savedJobs, setSavedJobs] = useLocalStorage<Job[]>(
    "devjobs:saved-jobs:v4",
    [],
    isJobArray,
  );
  const [applications, setApplications] = useLocalStorage<ApplicationRecord[]>(
    "devjobs:applications:v4",
    [],
    isApplicationRecordArray,
  );
  const [alertsEnabled, setAlertsEnabled] = useLocalStorage<boolean>(
    "devjobs:alerts:v2",
    false,
    isBoolean,
  );

  const value = useMemo<UserDataContextValue>(
    () => ({
      savedJobs,
      applications,
      alertsEnabled,
      toggleSave: (job) => {
        setSavedJobs((items) =>
          items.some((item) => item.id === job.id)
            ? items.filter((item) => item.id !== job.id)
            : [job, ...items],
        );
      },
      isSaved: (id) => savedJobs.some((item) => item.id === id),
      markApplied: (job) => {
        setApplications((items) => {
          if (items.some((item) => item.job.id === job.id)) return items;

          const now = new Date().toISOString();
          return [
            {
              job,
              status: "Applied",
              appliedAt: now,
              updatedAt: now,
            },
            ...items,
          ];
        });
      },
      isApplied: (id) => applications.some((item) => item.job.id === id),
      updateApplicationStatus: (id, status) => {
        setApplications((items) =>
          items.map((item) =>
            item.job.id === id
              ? { ...item, status, updatedAt: new Date().toISOString() }
              : item,
          ),
        );
      },
      removeApplication: (id) => {
        setApplications((items) => items.filter((item) => item.job.id !== id));
      },
      toggleAlerts: () => setAlertsEnabled((enabled) => !enabled),
    }),
    [
      alertsEnabled,
      applications,
      savedJobs,
      setAlertsEnabled,
      setApplications,
      setSavedJobs,
    ],
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData(): UserDataContextValue {
  const value = useContext(UserDataContext);

  if (!value) {
    throw new Error("useUserData must be used inside UserDataProvider");
  }

  return value;
}
