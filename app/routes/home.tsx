import type { Route } from "./+types/home";
import { useSession } from "../lib/auth-client";
import Hero from "../components/hero";
import PostCard from "../components/post-card";

export function meta() {
  return [
    { title: "Puyre – Where good ideas find you" },
    { name: "description", content: "Discover stories, thinking, and expertise from writers on any topic." },
  ];
}

export async function loader() {
  // TODO: Fetch posts from database
  return {
    posts: [],
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { data: session } = useSession();
  const { posts } = loaderData;

  if (!session?.user) {
    return (
      <div>
        <Hero />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-8">Trending on Puyre</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trending posts placeholder */}
            <p className="text-gray-500">No posts yet. Start writing!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-8 flex gap-6 border-b border-gray-200">
            <button className="pb-3 border-b-2 border-black font-medium">
              For you
            </button>
            <button className="pb-3 text-gray-500 hover:text-gray-900">
              Following
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No posts yet. Start following writers or explore topics!
              </p>
            </div>
          ) : (
            <div>
              {posts.map((post: any) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-8">
            <div>
              <h3 className="font-semibold mb-4">Recommended topics</h3>
              <div className="flex flex-wrap gap-2">
                {["Technology", "Programming", "Design", "Writing", "AI"].map(
                  (topic) => (
                    <a
                      key={topic}
                      href={`/tag/${topic.toLowerCase()}`}
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm"
                    >
                      {topic}
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Who to follow</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  No recommendations yet
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
