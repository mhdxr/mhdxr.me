<div align="center">
  <h1>mhdxr.me</h1>
  <p>🔥 Personal website built with Next.js, TypeScript, Tailwind CSS, SWR, Firebase and Prisma with PostgreSQL</p>

[![GitHub Repo stars](https://img.shields.io/github/stars/mhdxr/mhdxr.me)](https://github.com/mhdxr/mhdxr.me/stargazers)
[![License](https://img.shields.io/github/license/mhdxr/mhdxr.me)](https://github.com/mhdxr/mhdxr.me/blob/master/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue)](https://www.typescriptlang.org/)

</div>
<br />

## 📖 About

A modern, feature-rich personal website built with Next.js 15, featuring real-time integrations and a beautiful, responsive design. This project showcases:

- 🎨 **Beautiful UI** - Tailwind CSS with Framer Motion animations
- 📝 **Blog Integration** - WordPress CMS and DEV.to articles
- 💬 **Real-time Guestbook** - Powered by Firebase
- 🎧 **Spotify Widget** - Live "Now Playing" status
- 📊 **Coding Statistics** - WakaTime integration
- 🤖 **AI Features** - ChatGPT integration (optional)
- 💻 **JavaScript Playground** - Live code editor with instant preview
- 🗂️ **Projects Showcase** - PostgreSQL database with Prisma ORM
- 🔐 **Authentication** - Next-Auth with Google & GitHub OAuth

Perfect for developers who want a professional portfolio with integrated blog and real-time features.

## 🌐 Live Demo

Visit the live site: **[mhdxr.me](https://mhdxr.me)**

## Introduction

This website was carefully crafted from the ground using Next.js and other helpful tools, starting in June 2023.

I'm constantly making improvements to add more features and content. This website is where I share what I've learned and offer insights to others.

Feel free to use this website as a reference, for inspiration, or as a template, following the provided license. You can access the source code to customize it to your needs.

If you find this website helpful, please consider leaving a rating. 😎👍🏻

If you have any questions, suggestions, or anything else, don't hesitate to reach out to me! 🧑‍💻
<br /><br />

## Tech Stack

This website is built using these technologies:

- ◼️ Next.js 15.3.2
- ⚛️ React 18
- 🔰 TypeScript
- 💠 Tailwind CSS 3
- 🗂 Prisma Client
- 🔥 Firebase
- 🦫 Zustand
- 〰️ SWR
- ➰ Framer Motion
- 💢 React Icons
- 🛢 Jest
- 🧿 Absolute Import and Path Alias
- 📏 ESLint
- ✨ Prettier
- 🐶 Husky & Lint Staged
- 📌 Conventional Commit Lint

<br />

## Features

On this website there are several features that will continue to be updated and added in the future.

- ### 🤖 ChatGPT AI (Unavailable)

You can access this feature by opening the command palette [cmd+k], then typing whatever you want to search/ask for. (Currently not available, but you can configure it on your machine with your own OpenAI api key)

- ### 💻 JavaScript Playground

A no-fuss pure JavaScript playground with a live feedback loop.

- ### 💬 Realtime Guestbook

Realtime guestbook chat is powered by Firebase. Anyone can leave me a message in this website.

- ### 🎧 Spotify Status

Displays song information being played on spotify in real time using the Spotify API and SWR.

- ### 🕗 Wakatime Statistics

Data is retrieved using the Wakatime API and then displayed on the dashboard, built with Next.js API routes deployed as serverless functions.

- ### 📝 Blogs

The content on this blog is meticulously managed and sourced from a self-hosted headless CMS powered by WordPress, exemplifying our commitment to a streamlined and efficient content delivery system. The data fetching technique used to retrieve articles from WordPress CMS API involves using Client-Side Rendering (CSR) for the blog list and Server-Side Rendering (SSR) for the blog details.

- ### 🗳 Projects

The data projects on this blog are taken from the PostgreSQL database connected through the Prisma Client. The database for this application is hosted on Supabase DB.The data fetching method used to retrieve data projects is Incremental Static Regeneration (ISR) with 1 second revalidation and Server-Side Rendering (SSR) for the project details..
<br /><br />

<br />

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **Yarn** 1.22.x or higher (recommended for husky hooks)
- **PostgreSQL** database (or [Supabase](https://supabase.com) account)
- **Firebase** project for real-time features ([Get started](https://console.firebase.google.com))

### Optional API Keys

For full functionality, you'll need API keys for:
- **Spotify API** - For "Now Playing" widget ([Get credentials](https://developer.spotify.com/dashboard))
- **WakaTime API** - For coding statistics ([Get API key](https://wakatime.com/settings/api-key))
- **GitHub API** - For repository data ([Generate token](https://github.com/settings/tokens))
- **OpenAI API** - For ChatGPT feature ([Get API key](https://platform.openai.com/api-keys))
- **DEV.to API** - For blog integration ([Get API key](https://dev.to/settings/extensions))

## Getting Started

If you are interested in running this project on your local machine, you can do so in just 3 easy steps below. Additionally, remember to update the ".env.example" file to ".env" and replace the variables with your own in the ".env" file.

### 1. Clone this repository

Clone using git:

```bash
git clone https://github.com/mhdxr/mhdxr.me.git
cd mhdxr.me
```

Or deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mhdxr/mhdxr.me)

### 2. Install dependencies

It is encouraged to use **yarn** so the husky hooks can work properly.

```bash
yarn install
```

### 3. Config .env

This repository uses several environment variables. Please copy .env.example into .env, then fill in the values with your own. For third-party environment variables such as Spotify, Wakatime, Firebase, and others, please refer to the official documentation provided by each provider.

```env
# Site Configuration
BUNDLE_ANALYZER=false
SITE_URL=https://mhdxr.me

# Blog API
BLOG_API_URL=

# OpenAI (for ChatGPT feature)
OPENAI_API_KEY=

# DEV.to Integration
DEVTO_KEY=

# Spotify Integration
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

# WakaTime Integration
WAKATIME_API_KEY=

# GitHub Integration
GITHUB_READ_USER_TOKEN_PERSONAL=
GITHUB_READ_USER_TOKEN_WORK=

# Prisma Database (PostgreSQL)
DATABASE_URL='postgres://USER:PASSWORD@HOST:5432/postgres'
DIRECT_URL='postgres://USER:PASSWORD@HOST:5432/postgres'

# Contact Form
CONTACT_FORM_API_KEY=

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DB_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_CHAT_DB=

# Next-Auth SSO
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
```

### 4. Run the development server

You can start the server using this command:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/pages/index.tsx`.
<br /><br />

## 📁 Project Structure

```
mhdxr.me/
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema definition
│   └── migrations/      # Database migration files
├── public/              # Static assets (images, fonts, etc.)
├── src/
│   ├── common/          # Shared components, hooks, and utilities
│   │   ├── components/  # Reusable UI components
│   │   ├── constant/    # Constants and configurations
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── libs/        # Utility libraries (Prisma, Firebase, MDX)
│   │   ├── stores/      # Zustand state management
│   │   ├── styles/      # Global styles and fonts
│   │   └── types/       # TypeScript type definitions
│   ├── contents/        # MDX content for learning section
│   ├── modules/         # Feature-specific modules
│   │   ├── about/       # About page components
│   │   ├── blog/        # Blog components
│   │   ├── chat/        # Guestbook/chat components
│   │   ├── dashboard/   # Dashboard widgets
│   │   ├── home/        # Homepage components
│   │   ├── learn/       # Learning section components
│   │   ├── playground/  # JavaScript playground
│   │   └── projects/    # Projects showcase
│   ├── pages/           # Next.js pages (Pages Router)
│   │   ├── api/         # API routes
│   │   ├── blog/        # Blog pages
│   │   ├── learn/       # Learning pages
│   │   ├── projects/    # Project pages
│   │   └── ...          # Other pages
│   └── services/        # External API integrations
│       ├── blog.ts      # WordPress API
│       ├── chatgpt.ts   # OpenAI API
│       ├── devto.ts     # DEV.to API
│       ├── firebase.ts  # Firebase config
│       ├── github.ts    # GitHub API
│       ├── spotify.ts   # Spotify API
│       └── wakatime.ts  # WakaTime API
├── .env.example         # Environment variables template
├── .eslintrc.js         # ESLint configuration
├── .prettierrc.json     # Prettier configuration
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server at http://localhost:3000 |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint to check code quality |
| `yarn lint:fix` | Fix ESLint errors and format code with Prettier |
| `yarn typecheck` | Run TypeScript type checking |
| `yarn format` | Format code with Prettier |
| `yarn format:check` | Check code formatting |
| `yarn test` | Run Jest tests |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:ci` | Run tests in CI mode |

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com).

#### Step-by-Step Deployment:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin master
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables**
   
   In Vercel dashboard, go to **Settings → Environment Variables** and add all variables from `.env.example`:
   
   **Required:**
   - `DATABASE_URL` - PostgreSQL connection string
   - `DIRECT_URL` - Direct PostgreSQL connection (for migrations)
   - `NEXTAUTH_URL` - Your production URL (e.g., https://yourdomain.com)
   - All Firebase variables (`NEXT_PUBLIC_FIREBASE_*`)
   
   **Optional (for full features):**
   - Spotify, WakaTime, GitHub, OpenAI, DEV.to API keys

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live!

5. **Run Database Migrations**
   ```bash
   # After first deployment
   npx prisma migrate deploy
   ```

6. **Configure Custom Domain** (Optional)
   - Go to **Settings → Domains**
   - Add your custom domain
   - Update DNS records as instructed
   - Update `NEXTAUTH_URL` environment variable

### Post-Deployment Checklist

- [ ] All environment variables configured (see `.env.example`, including `NEXTAUTH_SECRET`)
- [ ] Database migrations completed
- [ ] OAuth providers configured (Google, GitHub)
- [ ] Firebase security rules set (see `firebase.rules.example.json`)
- [ ] Test all API integrations
- [ ] Verify authentication flows
- [ ] Check mobile responsiveness
- [ ] Test in different browsers

## 🔧 Troubleshooting

### Common Issues

**Build fails with Prisma error**
```bash
# Generate Prisma client
npx prisma generate
```

**Firebase authentication not working**
- Verify all Firebase environment variables are set correctly
- Check Firebase console for authorized domains
- Ensure Firebase project is in production mode (not test mode)

**Spotify "Now Playing" not showing**
- Verify Spotify API credentials are correct
- Check if refresh token is still valid
- Ensure you're currently playing music on Spotify
- Check Spotify API rate limits

**Database connection fails**
- Verify `DATABASE_URL` format is correct
- Check if database is accessible from your deployment
- For Vercel: ensure `DIRECT_URL` is set for connection pooling
- Check database firewall rules

**OAuth authentication fails**
- Verify callback URLs are configured in OAuth provider settings
- Check `NEXTAUTH_URL` matches your deployment URL
- Ensure OAuth credentials are correct

### Getting Help

- 📖 [Next.js Documentation](https://nextjs.org/docs)
- 🔥 [Firebase Documentation](https://firebase.google.com/docs)
- 🗂️ [Prisma Documentation](https://www.prisma.io/docs)
- 💬 [Open an issue](https://github.com/mhdxr/mhdxr.me/issues)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Run `yarn lint` before committing
- Run `yarn typecheck` to ensure type safety
- Write meaningful commit messages (follow [Conventional Commits](https://www.conventionalcommits.org/))

## 🔐 Security Notes

- Required environment variables are documented in `.env.example`. Optional
  integrations (Spotify, OpenAI, WakaTime, GitHub tokens, DEV.to) are
  feature-flagged in `src/common/libs/env.ts` — the app degrades gracefully
  when they are not configured.
- `NEXTAUTH_SECRET` is **required in production**. Generate it with
  `openssl rand -base64 32` and set it on Vercel before deploying.
- Sample Firebase Realtime Database rules for the guestbook live in
  `firebase.rules.example.json`. UI-only delete checks are not sufficient;
  enforce permissions on the database side.
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy) are configured in `next.config.js`.

## License

Licensed under the [GPL-3.0 license](https://github.com/mhdxr/mhdxr.me/blob/master/LICENSE).
