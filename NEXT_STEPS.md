# Next Steps Guide - Completing Puyre

This guide will help you complete the Puyre blogging platform by connecting it to the database and implementing the remaining features.

## Step 1: Environment Setup (10 minutes)

### 1.1 Install Turso CLI
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### 1.2 Create Database
```bash
turso db create puyre
```

### 1.3 Get Credentials
```bash
# Get database URL
turso db show puyre --url

# Generate auth token
turso db tokens create puyre
```

### 1.4 Set Up Environment Variables
Create `.env` file:
```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-token-here

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret

APP_URL=http://localhost:5173
BETTER_AUTH_SECRET=generate-a-random-secret-key
```

### 1.5 Push Schema to Database
```bash
npm run db:push
```

## Step 2: OAuth Setup (15 minutes)

### 2.1 Google OAuth
1. Go to https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Credentials → Create OAuth 2.0 Client ID
4. Authorized redirect URI: `http://localhost:5173/api/auth/callback/google`
5. Copy credentials to `.env`

### 2.2 GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Homepage: `http://localhost:5173`
4. Callback: `http://localhost:5173/api/auth/callback/github`
5. Copy credentials to `.env`

## Step 3: Implement Post CRUD (30-45 minutes)

### 3.1 Update write.tsx Action
```typescript
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const { db } = await import("../../db");
  const { posts } = await import("../../db/schema");
  const { nanoid } = await import("nanoid");
  
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tags = formData.get("tags") as string;
  
  const postId = params.postId || nanoid();
  
  if (params.postId) {
    // Update existing post
    await db.update(posts)
      .set({
        title,
        markdown: content,
        tags,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, params.postId));
  } else {
    // Create new post
    await db.insert(posts).values({
      id: postId,
      title,
      markdown: content,
      tags,
      userId: session.user.id, // Get from auth
      summary: generateSummary(content),
      image: extractFirstImage(content),
    });
  }
  
  return redirect(`/post/${postId}`);
}
```

### 3.2 Update post.tsx Loader
```typescript
export async function loader({ params }: Route.LoaderArgs) {
  const { db } = await import("../../db");
  const { posts, users } = await import("../../db/schema");
  const { eq } = await import("drizzle-orm");
  
  const post = await db.select()
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, params.id))
    .get();
  
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  
  return { post };
}
```

### 3.3 Update home.tsx Loader
```typescript
export async function loader() {
  const { db } = await import("../../db");
  const { posts, users } = await import("../../db/schema");
  const { eq, desc } = await import("drizzle-orm");
  
  const allPosts = await db.select({
    post: posts,
    author: users,
  })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(20);
  
  return { posts: allPosts };
}
```

## Step 4: Implement User Features (20-30 minutes)

### 4.1 User Profile Page
```typescript
// app/routes/user.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const { db } = await import("../../db");
  const { users, posts } = await import("../../db/schema");
  const { eq, desc } = await import("drizzle-orm");
  
  const user = await db.select()
    .from(users)
    .where(eq(users.id, params.id))
    .get();
  
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  
  const userPosts = await db.select()
    .from(posts)
    .where(eq(posts.userId, params.id))
    .orderBy(desc(posts.createdAt));
  
  return { user, posts: userPosts };
}
```

### 4.2 Follow/Unfollow Actions
```typescript
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  const { db } = await import("../../db");
  const { follows } = await import("../../db/schema");
  const { nanoid } = await import("nanoid");
  
  const session = await getSession(request);
  
  if (action === "follow") {
    await db.insert(follows).values({
      id: nanoid(),
      followerId: session.user.id,
      followingId: params.id,
    });
  } else if (action === "unfollow") {
    await db.delete(follows)
      .where(
        and(
          eq(follows.followerId, session.user.id),
          eq(follows.followingId, params.id)
        )
      );
  }
  
  return { success: true };
}
```

## Step 5: Add Search & Filtering (15-20 minutes)

### 5.1 Search Implementation
```typescript
// app/routes/search.tsx
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  
  const { db } = await import("../../db");
  const { posts, users } = await import("../../db/schema");
  const { like, or, desc } = await import("drizzle-orm");
  
  const results = await db.select()
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(
      or(
        like(posts.title, `%${query}%`),
        like(posts.markdown, `%${query}%`),
        like(posts.tags, `%${query}%`)
      )
    )
    .orderBy(desc(posts.createdAt));
  
  return { query, results };
}
```

### 5.2 Tag Filtering
```typescript
// app/routes/tag.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const { db } = await import("../../db");
  const { posts, users } = await import("../../db/schema");
  const { like, desc } = await import("drizzle-orm");
  
  const results = await db.select()
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(like(posts.tags, `%${params.tag}%`))
    .orderBy(desc(posts.createdAt));
  
  return { tag: params.tag, posts: results };
}
```

## Step 6: Add Voting & Comments (20-30 minutes)

### 6.1 Vote Action
```typescript
export async function action({ request, params }: Route.ActionArgs) {
  const { db } = await import("../../db");
  const { votes } = await import("../../db/schema");
  const { nanoid } = await import("nanoid");
  
  const session = await getSession(request);
  
  // Check if already voted
  const existing = await db.select()
    .from(votes)
    .where(
      and(
        eq(votes.postId, params.id),
        eq(votes.userId, session.user.id)
      )
    )
    .get();
  
  if (existing) {
    // Remove vote
    await db.delete(votes).where(eq(votes.id, existing.id));
  } else {
    // Add vote
    await db.insert(votes).values({
      id: nanoid(),
      postId: params.id,
      userId: session.user.id,
    });
  }
  
  return { success: true };
}
```

### 6.2 Comment Action
```typescript
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const comment = formData.get("comment") as string;
  
  const { db } = await import("../../db");
  const { comments } = await import("../../db/schema");
  const { nanoid } = await import("nanoid");
  
  const session = await getSession(request);
  
  await db.insert(comments).values({
    id: nanoid(),
    postId: params.id,
    userId: session.user.id,
    comment,
  });
  
  return { success: true };
}
```

## Step 7: Testing (10-15 minutes)

### 7.1 Test Auth Flow
```bash
npm run dev
# Visit http://localhost:5173
# Click "Sign in" → Test Google/GitHub OAuth
```

### 7.2 Test Post Creation
1. Sign in
2. Click "Write"
3. Create a test post
4. Publish with tags
5. Verify it appears on homepage

### 7.3 Test Database
```bash
npm run db:studio
# Browse your data in the Drizzle Studio UI
```

## Step 8: Deploy to Production (5-10 minutes)

### 8.1 Add Production Environment Variables
In Cloudflare dashboard:
- Add all `.env` variables
- Update callback URLs to production domain

### 8.2 Deploy
```bash
npm run deploy
```

### 8.3 Verify
- Test auth flow in production
- Create a test post
- Check database in Turso dashboard

## Estimated Total Time: 2-3 hours

## Troubleshooting

### Auth Issues
- Verify OAuth callback URLs match exactly
- Check Better-Auth secret is set
- Ensure cookies are allowed in browser

### Database Issues
- Run `npm run db:push` to sync schema
- Check Turso token hasn't expired
- Verify database URL format

### Build Issues
- Clear `.react-router` cache: `rm -rf .react-router`
- Rebuild: `npm run build`
- Check TypeScript errors: `npm run typecheck`

## Additional Features to Add Later

1. **Markdown Editor**: Integrate a rich text/markdown editor
2. **Image Upload**: Add image upload to Cloudflare R2
3. **Email Notifications**: Use Resend or SendGrid
4. **RSS Feed**: Generate RSS for posts
5. **SEO**: Add meta tags, sitemaps
6. **Analytics**: Add Cloudflare Analytics
7. **Rate Limiting**: Add API rate limits
8. **Caching**: Implement edge caching strategies

## Resources

- [React Router Docs](https://reactrouter.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Turso Docs](https://docs.turso.tech/)
- [Better-Auth Docs](https://www.better-auth.com/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

---

Good luck building Puyre! 🚀
