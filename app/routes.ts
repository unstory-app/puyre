import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signin", "routes/signin.tsx"),
  route("write/:postId?", "routes/write.tsx"),
  route("post/:id", "routes/post.tsx"),
  route("user/:id", "routes/user.tsx"),
  route("tag/:tag", "routes/tag.tsx"),
  route("notifications", "routes/notifications.tsx"),
  route("search/:query", "routes/search.tsx"),
  route("api/auth/*", "routes/api.auth.ts"),
] satisfies RouteConfig;
