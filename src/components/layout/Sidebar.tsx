import { NavLink } from "react-router-dom";
import Icon from "../ui/Icon";

interface SidebarProps {
  savedCount: number;
  appliedCount: number;
  mobileOpen: boolean;
  alertsEnabled: boolean;
  onToggleAlerts: () => void;
  onClose: () => void;
}

const navigation = [
  { to: "/jobs", label: "Find Jobs", icon: "search" as const },
  { to: "/saved", label: "Saved", icon: "bookmark" as const },
  { to: "/applications", label: "Applications", icon: "file" as const },
];

export default function Sidebar({
  savedCount,
  appliedCount,
  mobileOpen,
  alertsEnabled,
  onToggleAlerts,
  onClose,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200/80 bg-white px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <NavLink to="/jobs" onClick={onClose} className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
              <span className="text-lg font-black">D</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-950">DevJobs</span>
          </NavLink>

          <button
            type="button"
            className="focus-ring rounded-lg p-2 text-slate-500 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="space-y-1.5" aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }: { isActive: boolean }) =>
                `focus-ring flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`
              }
            >
              <Icon name={item.icon} size={19} />
              <span className="flex-1">{item.label}</span>
              {item.to === "/saved" && savedCount > 0 && <Badge count={savedCount} />}
              {item.to === "/applications" && appliedCount > 0 && (
                <Badge count={appliedCount} />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="my-5 h-px bg-slate-100" />

        <div className="rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
          <div className="font-bold text-slate-800">Portfolio v2</div>
          <p className="mt-1">
            Live API data, URL filters, routing, query caching, saved jobs and application tracking.
          </p>
        </div>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700">
            <Icon name="bell" size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-950">Job alert preference</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {alertsEnabled
              ? "The demo alert preference is enabled on this device."
              : "This demo stores your preference locally; it does not send emails."}
          </p>
          <button
            type="button"
            onClick={onToggleAlerts}
            className={`focus-ring mt-4 w-full rounded-xl px-3 py-2.5 text-sm font-semibold ${
              alertsEnabled
                ? "border border-blue-200 bg-blue-50 text-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-pressed={alertsEnabled}
          >
            {alertsEnabled ? "Disable preference" : "Enable preference"}
          </button>
        </div>
      </aside>
    </>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
      {count}
    </span>
  );
}
