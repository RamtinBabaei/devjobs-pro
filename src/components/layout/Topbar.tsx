import { useEffect, useState, type ChangeEvent } from "react";
import Icon from "../ui/Icon";

interface TopbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  location: string;
  locationOptions: string[];
  onLocationChange: (value: string) => void;
  onMenu: () => void;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showLocation?: boolean;
}

export default function Topbar({
  search,
  onSearchChange,
  location,
  locationOptions,
  onLocationChange,
  onMenu,
  title,
  subtitle,
  showSearch = true,
  showLocation = true,
}: TopbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="relative flex flex-col gap-4 border-b border-slate-200/80 bg-white px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:px-7">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="focus-ring rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Icon name="menu" />
        </button>

        {title && (
          <div>
            <h1 className="text-lg font-extrabold text-slate-950">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
        )}
      </div>

      {showSearch && (
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search jobs</span>
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <Icon name="search" size={19} />
            </span>
            <input
              value={search}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
              className="focus-ring h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900"
              placeholder="Search title, company, skill, location..."
              type="search"
            />
          </label>

          {showLocation && (
            <label className="relative sm:w-52">
              <span className="sr-only">Filter by location</span>
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Icon name="pin" size={18} />
              </span>
              <select
                value={location}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  onLocationChange(event.target.value)
                }
                className="focus-ring h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-9 text-sm font-semibold text-slate-700"
              >
                {locationOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                <Icon name="chevron" size={16} />
              </span>
            </label>
          )}
        </div>
      )}

      <div className="ml-auto hidden items-center gap-3 xl:flex">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setProfileOpen(false);
            }}
            className="focus-ring grid h-11 w-11 place-items-center rounded-full text-slate-600 hover:bg-slate-50"
            aria-label="Project information"
            aria-expanded={notificationsOpen}
            aria-controls="project-info-popover"
          >
            <Icon name="bell" size={20} />
          </button>
          {notificationsOpen && (
            <Popover
              id="project-info-popover"
              title="Project information"
              text="Live API results are cached for six hours to reduce unnecessary requests."
            />
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((open) => !open);
              setNotificationsOpen(false);
            }}
            className="focus-ring flex items-center gap-3 rounded-xl p-1.5 pr-2 hover:bg-slate-50"
            aria-expanded={profileOpen}
            aria-controls="demo-profile-popover"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
              DU
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-slate-950">Demo User</div>
              <div className="text-xs text-slate-400">Frontend Portfolio</div>
            </div>
            <Icon name="chevron" size={16} />
          </button>
          {profileOpen && (
            <Popover
              id="demo-profile-popover"
              title="Demo profile"
              text="Authentication is intentionally outside the v2 scope. Saved jobs and application data stay on this device."
            />
          )}
        </div>
      </div>
    </header>
  );
}

function Popover({ id, title, text }: { id: string; title: string; text: string }) {
  return (
    <div
      id={id}
      className="absolute right-0 top-14 z-30 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
      role="region"
      aria-label={title}
    >
      <div className="text-sm font-extrabold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
