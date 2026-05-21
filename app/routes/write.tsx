import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSession } from "../lib/auth-client";
import type { Route } from "./+types/write";

export function meta() {
  return [
    { title: "Write a story - Puyre" },
    { name: "description", content: "Share your story on Puyre" },
  ];
}

export default function Write({ params }: Route.ComponentProps) {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const postId = params.postId;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      navigate("/signin");
    }
  }, [session, navigate]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim() || !tags.trim()) {
      return;
    }

    // TODO: Implement publish/update logic with database
    console.log("Publishing:", { title, content, tags });
    navigate("/");
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPublishDialog(true)}
            disabled={title.length < 5 || content.length < 15}
            className="bg-green-600 text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {postId ? "Save" : "Publish"}
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <textarea
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full text-5xl font-serif font-bold border-none outline-none resize-none mb-8 placeholder-gray-300"
          rows={2}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell your story..."
          className="w-full text-xl border-none outline-none resize-none min-h-[500px] leading-relaxed placeholder-gray-300"
        />
      </div>

      {showPublishDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Story preview</h2>
              <button
                onClick={() => setShowPublishDialog(false)}
                className="text-gray-400 hover:text-gray-600"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="bg-gray-100 h-48 mb-4 flex items-center justify-center text-gray-400">
                  <p className="text-sm text-center px-4">
                    Include a high-quality image in your story
                  </p>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {content.slice(0, 150)}...
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-700 mb-4">
                    Publishing to{" "}
                    <span className="font-semibold">{session.user.name}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Add or change topics (up to 5) so readers know what your
                    story is about
                  </p>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Add topics (e.g., Technology, Writing)"
                    className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-gray-900"
                  />
                </div>

                <button
                  onClick={handlePublish}
                  disabled={!tags.trim()}
                  className="w-full bg-green-600 text-white rounded-full px-6 py-3 font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {postId ? "Save now" : "Publish now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
