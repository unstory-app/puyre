import type { Route } from "./+types/post";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Post ${params.id} - Puyre` },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  // TODO: Fetch post from database
  return {
    post: {
      id: params.id,
      title: "Sample Post",
      content: "Sample content",
    },
  };
}

export default function Post({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8">{post.title}</h1>
      <div className="prose prose-lg max-w-none">
        {/* Render markdown content */}
      </div>
    </div>
  );
}
