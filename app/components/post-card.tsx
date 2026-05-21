import { Link } from "react-router";
import TimeAgo from "./time-ago";

interface PostCardProps {
  id: string;
  title: string;
  summary: string;
  image?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  createdAt: Date;
  showAuthor?: boolean;
}

export default function PostCard({
  id,
  title,
  summary,
  image,
  author,
  tags,
  createdAt,
  showAuthor = true,
}: PostCardProps) {
  return (
    <article className="border-b border-gray-200 pb-10 mb-10">
      {showAuthor && (
        <div className="flex items-center gap-3 mb-3">
          <Link to={`/user/${author.id}`}>
            <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs">
                  {author.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          <Link
            to={`/user/${author.id}`}
            className="text-sm font-medium text-gray-900 hover:underline"
          >
            {author.name}
          </Link>
          <span className="text-sm text-gray-500">
            <TimeAgo date={createdAt} />
          </span>
        </div>
      )}

      <div className="flex gap-10 justify-between">
        <div className="flex-1">
          <Link to={`/post/${id}`}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 hover:underline line-clamp-2">
              {title}
            </h2>
          </Link>
          <Link
            to={`/post/${id}`}
            className="text-gray-600 text-base leading-6 mb-4 line-clamp-3 hover:text-gray-900"
          >
            {summary}
          </Link>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              {tags.length > 0 && (
                <Link
                  to={`/tag/${tags[0]}`}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-700"
                >
                  {tags[0]}
                </Link>
              )}
              <span className="text-xs text-gray-500">4 min read</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="text-gray-500 hover:text-gray-700"
                aria-label="Save post"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
              <button
                className="text-gray-500 hover:text-gray-700"
                aria-label="More options"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {image && (
          <Link to={`/post/${id}`} className="shrink-0">
            <img
              src={image}
              alt={title}
              className="w-28 h-28 object-cover"
            />
          </Link>
        )}
      </div>
    </article>
  );
}
