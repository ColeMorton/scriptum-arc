# GitHub Pages Setup Guide

This guide will help you enable GitHub Pages for your Zixly documentation.

## Prerequisites

- GitHub repository with admin access
- Documentation files in the `/docs` directory (✅ Already completed)

## Step-by-Step Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (in the repository menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/docs** folder
6. Click **Save**

### 2. Configure Repository Settings

1. In **Settings** → **General** → **Features**
2. Ensure **Pages** is enabled
3. Optionally, set up a custom domain if desired

### 3. Verify Deployment

1. After enabling Pages, GitHub will build and deploy your documentation
2. The process typically takes 1-2 minutes
3. You'll see a green checkmark when deployment is complete
4. Your documentation will be available at: `https://colemorton.github.io/zixly/`

### 4. Custom Domain (Optional)

If you want to use a custom domain (e.g., `docs.colemorton.com.au`):

1. In **Settings** → **Pages**
2. Enter your custom domain in the **Custom domain** field
3. Follow GitHub's instructions for DNS configuration
4. Enable **Enforce HTTPS** once the domain is verified

## Documentation Structure

Your documentation is organized as follows:

```
docs/
├── index.md                    # Main landing page
├── README.md                   # Quick reference guide
├── product/                    # Product documentation
├── architecture/               # Technical architecture
├── financial/                  # Business model
├── sales/                      # Sales materials
├── implementation/             # Development phases
├── concepts/                   # Business concepts
├── integrations/               # Integration docs
└── specs/                      # Technical specifications
```

## Automatic Deployment

The GitHub Actions workflow (`.github/workflows/docs.yml`) will:

- ✅ Validate markdown syntax
- ✅ Check for broken links
- ✅ Deploy to GitHub Pages automatically
- ✅ Run on every push to main branch

## Testing Your Documentation

### Local Testing

1. Install a markdown preview tool:

   ```bash
   npm install -g markdown-preview-enhanced
   ```

2. Preview your documentation:
   ```bash
   markdown-preview-enhanced docs/index.md
   ```

### Link Testing

The GitHub Actions workflow includes automatic link checking. To test locally:

```bash
npm install -g markdown-link-check
markdown-link-check docs/index.md
```

## Troubleshooting

### Common Issues

**Issue**: Pages not deploying

- **Solution**: Check that the `/docs` folder contains `index.md`
- **Solution**: Verify the branch is set to `main` in Pages settings

**Issue**: Links not working

- **Solution**: Ensure all internal links use relative paths (e.g., `./architecture/system-architecture.md`)
- **Solution**: Check that target files exist

**Issue**: Images not displaying

- **Solution**: Store images in `/docs/assets/` directory
- **Solution**: Use relative paths for image links

### Getting Help

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Next Steps

Once GitHub Pages is enabled:

1. **Test all links** in your documentation
2. **Share the URL** with your team: `https://colemorton.github.io/zixly/`
3. **Update your README** to include the documentation badge
4. **Set up monitoring** for broken links (optional)

## Documentation Maintenance

- **Regular Updates**: Update documentation alongside code changes
- **Link Checking**: The GitHub Actions workflow will catch broken links
- **Content Review**: Schedule quarterly documentation reviews
- **User Feedback**: Collect feedback on documentation clarity and completeness

---

**Setup Status**: ✅ Ready for GitHub Pages deployment  
**Documentation URL**: `https://colemorton.github.io/zixly/`  
**Last Updated**: 2025-01-27
