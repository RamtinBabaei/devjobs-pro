import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useUserData } from "../../context/UserDataContext";
import Sidebar from "./Sidebar";

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { savedJobs, applications, alertsEnabled, toggleAlerts } = useUserData();

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#eef3f9] p-0 lg:p-5">
      <div className="surface-shadow mx-auto min-h-screen max-w-[1540px] overflow-hidden bg-white lg:min-h-[calc(100vh-40px)] lg:rounded-[28px] lg:border lg:border-white/80">
        <div className="flex min-h-[inherit]">
          <Sidebar
            savedCount={savedJobs.length}
            appliedCount={applications.length}
            mobileOpen={mobileOpen}
            alertsEnabled={alertsEnabled}
            onToggleAlerts={toggleAlerts}
            onClose={() => setMobileOpen(false)}
          />

          <main className="min-w-0 flex-1">
            <Outlet context={{ openMenu: () => setMobileOpen(true) }} />
          </main>
        </div>
      </div>
    </div>
  );
}
