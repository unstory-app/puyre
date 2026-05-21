import { Link } from "react-router";
import { useSession } from "../lib/auth-client";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-serif font-bold">
            Puyre
          </Link>
          <div className="hidden md:block">
            <input
              type="search"
              placeholder="Search"
              className="bg-gray-50 border-none outline-none rounded-full px-4 py-2 text-sm w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {session?.user ? (
            <>
              <Link
                to="/write"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span className="text-sm">Write</span>
              </Link>

              <Link
                to="/notifications"
                className="text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </Link>

              <Link
                to={`/user/${session.user.id}`}
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-sm text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link
                to="/signin"
                className="bg-black text-white rounded-full px-4 py-2 text-sm hover:bg-gray-800"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
