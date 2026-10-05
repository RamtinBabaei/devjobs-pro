import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
      <div>
        <div className="text-7xl font-black text-blue-600">404</div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-950">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you requested does not exist in this demo.
        </p>
        <Link
          to="/jobs"
          className="focus-ring mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
        >
          Back to jobs
        </Link>
      </div>
    </div>
  );
}
