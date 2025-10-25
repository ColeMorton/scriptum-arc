# Local Jekyll Development Guide

Quick reference for testing documentation changes locally before pushing to GitHub Pages.

## Prerequisites

✅ **Already installed on your system:**

- Ruby 2.6.10
- Bundler 1.17.2
- Jekyll dependencies (via `bundle install`)

## Daily Workflow

### 1. Start Local Server

```bash
cd docs
bundle exec jekyll serve --baseurl=""
```

**What this does:**

- Starts Jekyll server on http://localhost:4000/
- Watches for file changes and auto-rebuilds
- Overrides `baseurl: '/zixly'` to work locally

**Expected output:**

```
Configuration file: /Users/colemorton/Projects/zixly/docs/_config.yml
            Source: /Users/colemorton/Projects/zixly/docs
       Destination: /Users/colemorton/Projects/zixly/docs/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 0.5 seconds.
 Auto-regeneration: enabled
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```

### 2. Preview Your Site

Open browser to: **http://localhost:4000/**

You should see:

- Zixly Documentation homepage
- Custom Cayman theme with gradient header
- All navigation working
- Real-time updates as you edit files

### 3. Make Changes

1. Edit any markdown file in `docs/`
2. Save the file
3. Jekyll auto-rebuilds (watch console for "...done in X seconds")
4. Refresh browser to see changes

### 4. Stop Server

Press `Ctrl+C` in the terminal running Jekyll

### 5. Push to GitHub

Once satisfied with local preview:

```bash
git add .
git commit -m "docs: update documentation"
git push origin main
```

GitHub Actions will build and deploy to https://colemorton.github.io/zixly/

## Common Commands

### First Time Setup (Already Done)

```bash
cd docs
bundle install --path vendor/bundle
```

### Update Dependencies (Periodically)

```bash
cd docs
bundle update github-pages
```

### Clean Build (If Issues)

```bash
cd docs
bundle exec jekyll clean
bundle exec jekyll serve --baseurl=""
```

### Check Jekyll Version

```bash
cd docs
bundle exec jekyll --version
```

## Troubleshooting

### Port 4000 Already in Use

If you see "Address already in use":

```bash
# Find and kill the process using port 4000
lsof -ti:4000 | xargs kill -9

# Or use a different port
bundle exec jekyll serve --baseurl="" --port 4001
```

### Ruby 3.0+ webrick Error

If you see "cannot load such file -- webrick":

```bash
cd docs
bundle add webrick
bundle exec jekyll serve --baseurl=""
```

### Changes Not Showing

1. Hard refresh browser: `Cmd+Shift+R`
2. Check Jekyll console for build errors
3. Try clean build (see commands above)

## File Structure

```
docs/
├── _config.yml          # Jekyll configuration
├── _layouts/            # Custom layouts
│   └── default.html     # Main layout template
├── _site/               # Generated HTML (gitignored)
├── vendor/              # Gem dependencies (gitignored)
├── Gemfile              # Ruby gem dependencies
├── .gitignore           # Ignore build artifacts
└── *.md                 # Your documentation files
```

## Benefits of Local Testing

1. **Instant feedback** - See changes in seconds
2. **No GitHub quota** - Unlimited local builds
3. **Catch errors early** - Find issues before pushing
4. **Test links** - Verify navigation works
5. **Faster iteration** - No waiting for CI/CD

## Configuration Notes

- `_config.yml` has `baseurl: '/zixly'` for GitHub Pages
- Local server overrides this with `--baseurl=""`
- Production URL: https://colemorton.github.io/zixly/
- Local URL: http://localhost:4000/

## Quick Reference Card

```bash
# Start server
cd docs && bundle exec jekyll serve --baseurl=""

# Stop server
Ctrl+C

# Preview site
http://localhost:4000/

# Update deps
cd docs && bundle update github-pages

# Clean build
cd docs && bundle exec jekyll clean
```

---

**Last Updated:** 2025-10-25  
**Jekyll Version:** 3.9.5  
**github-pages gem:** 231
