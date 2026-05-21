import { Link } from "react-router";

export default function Hero() {
  return (
    <div className="bg-[#ffc017] border-b border-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif leading-tight">
              Stay curious.
            </h1>
            <p className="text-2xl md:text-3xl leading-snug">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
            <Link
              to="/signin"
              className="inline-block bg-black text-white rounded-full px-12 py-3 text-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Start reading
            </Link>
          </div>
          <div className="hidden md:block relative">
            <svg
              className="w-full h-auto"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="200" cy="200" r="180" fill="#000" fillOpacity="0.05" />
              <circle cx="200" cy="200" r="140" fill="#000" fillOpacity="0.05" />
              <circle cx="200" cy="200" r="100" fill="#000" fillOpacity="0.05" />
              <circle cx="200" cy="200" r="60" fill="#000" fillOpacity="0.1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
