# Puyre - Modern Blogging Platform

A beautiful, Medium-inspired blogging platform built with React Router v7, Drizzle ORM, Turso DB, and deployed on Cloudflare.

🔗 **Live Demo**: [https://puyre.shraj.workers.dev/](https://puyre.shraj.workers.dev/)  
📦 **Repository**: [https://github.com/appedme/puyre](https://github.com/appedme/puyre)

## ✨ Features

- 📝 **Rich Writing Experience** - Clean, distraction-free editor for creating blog posts
- 🔐 **OAuth Authentication** - Sign in with Google or GitHub using Better-Auth
- 💾 **Turso Database** - Fast, edge-deployed SQLite database with Drizzle ORM
- 🎨 **Medium-like UI** - Clean, minimalist design inspired by Medium
- ⚡ **React Router v7** - Modern full-stack React framework with SSR
- 🌐 **Cloudflare Deployment** - Deploy to the edge with Cloudflare Workers
- 🎯 **Topics & Tags** - Organize content by topics and tags
- 👥 **User Profiles** - Follow writers and build your reading network
- 🔔 **Notifications** - Stay updated with activity on your posts
- 📱 **Responsive Design** - Beautiful on all devices with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm or your preferred package manager
- Turso account for database (free tier available)
- Google OAuth credentials (for authentication)
- GitHub OAuth credentials (for authentication)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/appedme/puyre.git
cd puyre
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Database
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# App
APP_URL=http://localhost:5173
BETTER_AUTH_SECRET=your-random-secret-key
```

### Setting Up Turso Database

1. **Install Turso CLI**

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. **Create a database**

```bash
turso db create puyre
```

3. **Get your database URL and auth token**

```bash
turso db show puyre --url
turso db tokens create puyre
```

4. **Push your schema to the database**

```bash
npm run db:push
```

### Setting Up OAuth

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:5173/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

#### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:5173`
4. Set Authorization callback URL: `http://localhost:5173/api/auth/callback/github`
5. Copy Client ID and generate a Client Secret
6. Add them to your `.env` file

### Development

Start the development server:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`

### Database Commands

```bash
# Generate migration files
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## 🏗️ Project Structure

```
puyre/
├── app/
│   ├── components/         # Reusable UI components
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   └── post-card.tsx
│   ├── lib/               # Utility libraries
│   │   └── auth-client.ts
│   ├── routes/            # React Router routes
│   │   ├── home.tsx
│   │   ├── signin.tsx
│   │   ├── write.tsx
│   │   ├── post.tsx
│   │   ├── user.tsx
│   │   └── api.auth.ts
│   ├── app.css           # Global styles
│   ├── root.tsx          # Root layout
│   └── routes.ts         # Route configuration
├── db/
│   ├── schema.ts         # Database schema (Drizzle)
│   └── index.ts          # Database client
├── lib/
│   └── auth.ts           # Better-Auth configuration
├── public/               # Static assets
├── workers/
│   └── app.ts           # Cloudflare Worker entry
├── drizzle.config.ts    # Drizzle configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc       # Cloudflare Workers config
```

## 📊 Database Schema

The application uses a relational schema with the following main tables:

- **users** - User accounts and profiles
- **posts** - Blog posts with markdown content
- **comments** - Comments on posts
- **votes** - Post upvotes/likes
- **follows** - User follow relationships
- **savedPosts** - Saved posts by users
- **userLists** - Custom reading lists
- **interests** - User topic interests
- **notifications** - User notifications
- **tags** - Content tags/topics

## 🎨 Technology Stack

- **Framework**: React Router v7 with SSR
- **Styling**: Tailwind CSS v4
- **Database**: Turso (LibSQL/SQLite)
- **ORM**: Drizzle ORM
- **Authentication**: Better-Auth
- **Deployment**: Cloudflare Workers
- **Build Tool**: Vite
- **Language**: TypeScript

## 📦 Deployment

### Deploy to Cloudflare

1. **Build the project**

```bash
npm run build
```

2. **Deploy to Cloudflare**

```bash
npm run deploy
```

Or use Wrangler commands:

```bash
# Deploy directly
wrangler deploy

# Create a preview deployment
wrangler versions upload
wrangler versions deploy
```

### Environment Variables in Production

Add your environment variables in the Cloudflare dashboard:

1. Go to your Worker settings
2. Navigate to Variables and Secrets
3. Add all required environment variables from `.env.example`

## 🔧 Configuration

### Wrangler Configuration

Edit `wrangler.jsonc` to configure your Cloudflare Worker:

```jsonc
{
  "name": "puyre",
  "compatibility_date": "2025-04-04",
  "main": "./workers/app.ts",
  "vars": {
    // Add environment variables here
  }
}
```

### TypeScript Configuration

The project uses project references for better type checking:

- `tsconfig.json` - Base configuration
- `tsconfig.node.json` - Node.js/build tooling
- `tsconfig.cloudflare.json` - Cloudflare Workers runtime

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Medium's clean and minimalist design
- Built with modern web technologies
- Deployed on the edge with Cloudflare

## 📧 Support

For support, email support@puyre.com or open an issue in the GitHub repository.

---

Built with ❤️ using React Router, Drizzle, and Cloudflare

