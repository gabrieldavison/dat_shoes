# Cloudflare Pages Deployment Guide

This guide will help you deploy your React flowchart application to Cloudflare Pages.

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Supabase project set up (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md))

## Method 1: Deploy via Cloudflare Dashboard (Recommended)

### Step 1: Connect Your Repository

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** in the left sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Authorize Cloudflare to access your Git provider
6. Select your repository from the list

### Step 2: Configure Build Settings

Use the following build configuration:

- **Production branch**: `main` (or your default branch)
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty if project is at root)

### Step 3: Environment Variables (Build-time)

**Important**: For static Vite applications, environment variables are embedded during build time, not at runtime.

Add your Supabase environment variables as **build environment variables**:

1. In the build configuration page, scroll to **Environment variables (advanced)**
2. Click **Add variable**
3. Add the following variables (these are used during the build process):
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

**Note**: These `VITE_` prefixed variables are build-time variables that Vite embeds into your static files during compilation. They should match the variables in your local `.env` file.

### Step 4: Deploy

1. Click **Save and Deploy**
2. Cloudflare Pages will build and deploy your application
3. Once complete, you'll receive a unique URL (e.g., `your-project.pages.dev`)

## Method 2: Deploy via Wrangler CLI

This project includes a [`wrangler.jsonc`](wrangler.jsonc) configuration file for easy deployment.

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Authenticate

```bash
wrangler login
```

### Step 3: Build Your Project

```bash
npm run build
```

### Step 4: Deploy

```bash
npx wrangler deploy
```

The deployment uses the [`wrangler.jsonc`](wrangler.jsonc) configuration which specifies:
- Project name: `mr-flow-chart`
- Assets directory: `./dist`
- Compatibility date: `2025-12-01`

**Note**: You can modify the project name in [`wrangler.jsonc`](wrangler.jsonc) if desired.

### Step 5: Set Environment Variables (for future builds)

**Important**: Since Wrangler CLI deployment only uploads already-built static files, environment variables cannot be added after deployment for static-only sites.

For future deployments, you have two options:

**Option A: Use local `.env` file (simpler but less secure)**
1. Keep your `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Build locally with `npm run build` (variables are embedded during build)
3. Deploy the built files with `npx wrangler deploy`

**Option B: Set environment variables in Cloudflare (recommended for production)**
1. Switch to Git-based deployment (Method 1)
2. Configure build environment variables in the Cloudflare Pages dashboard
3. Let Cloudflare build and deploy automatically

**Note**: For static sites, environment variables are baked into the JavaScript bundle at build time, not available at runtime.

## Automatic Deployments

Once connected via Git (Method 1), Cloudflare Pages will automatically:

- Deploy production builds when you push to your main branch
- Create preview deployments for pull requests
- Provide unique URLs for each deployment

## Custom Domain (Optional)

### Add a Custom Domain

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (usually takes a few minutes)

## Environment-Specific Variables (Git-based deployments only)

When using Git-based deployment (Method 1), you can set different **build environment variables** for:

- **Production**: Used when building your main branch deployments
- **Preview**: Used when building pull request and branch preview deployments

To set environment-specific variables:

1. Go to **Settings** > **Environment variables**
2. Add variables separately for **Production** and **Preview** environments
3. Each will be used during the respective build process

This is useful for separate Supabase projects for development and production.

**Important**: These are build-time variables, not runtime variables. They are embedded into your static files during the build process.

## Build Configuration Details

### Node.js Version

Cloudflare Pages uses Node.js 18 by default. If you need a different version:

1. Go to **Settings** > **Builds & deployments**
2. Add an environment variable: `NODE_VERSION` with your desired version (e.g., `20`)

### Build Cache

Cloudflare Pages automatically caches `node_modules` to speed up builds. To clear the cache:

1. Go to **Settings** > **Builds & deployments**
2. Click **Clear build cache**

## Troubleshooting

### Build Failures

**TypeScript Errors:**
- Ensure all TypeScript errors are resolved locally
- Run `npm run build` locally to verify

**Missing Dependencies:**
- Verify all dependencies are in [`package.json`](package.json)
- Check that `package-lock.json` is committed

**Environment Variables:**
- Ensure variables are prefixed with `VITE_` for Vite projects
- Verify variables are set as **build environment variables** (not runtime variables)
- Remember: For static sites, these are embedded at build time, not available at runtime
- If using CLI deployment, ensure `.env` file exists locally during build

### Runtime Issues

**Blank Page:**
- Check browser console for errors
- Verify Supabase credentials are correct
- Check CORS settings in your Supabase project

**Authentication Not Working:**
- Ensure Supabase URL is correct
- Verify redirect URLs in Supabase dashboard include your Cloudflare Pages domain
- Add your Pages domain to Supabase **Authentication** > **URL Configuration** > **Site URL**

## Rollback Deployments

To rollback to a previous deployment:

1. Go to your project's **Deployments** tab
2. Find the deployment you want to rollback to
3. Click the three dots menu
4. Select **Rollback to this deployment**

## Preview Deployments

Every push to a non-production branch creates a preview deployment with a unique URL in the format:

```
<BRANCH>.<PROJECT>.pages.dev
```

This allows you to test changes before merging to production.

## Build Logs

To view build logs:

1. Go to your project's **Deployments** tab
2. Click on any deployment
3. View the **Build log** and **Function log** tabs

## Performance Optimization

Cloudflare Pages automatically provides:

- Global CDN distribution
- Automatic HTTPS
- DDoS protection
- Brotli compression
- HTTP/3 support

## Cost

Cloudflare Pages free tier includes:

- Unlimited sites
- Unlimited requests
- Unlimited bandwidth
- 500 builds per month
- 1 concurrent build

For higher limits, consider [Cloudflare Pages Pro](https://www.cloudflare.com/plans/developer-platform/).

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#cloudflare-pages)
- [Supabase Documentation](https://supabase.com/docs)

## Quick Deployment Checklist

- [ ] Code pushed to Git repository
- [ ] Supabase project created and configured
- [ ] Environment variables ready (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured
- [ ] Environment variables added to Cloudflare Pages
- [ ] Deployment successful
- [ ] Application tested on deployed URL
- [ ] Custom domain configured (optional)
- [ ] Supabase redirect URLs updated with Pages domain

---

Your React flowchart application is now deployed on Cloudflare Pages! 🎉