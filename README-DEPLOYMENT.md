# Azure Static Web Apps Deployment Guide

This guide will help you deploy the ABN AMRO Dashboard to Azure Static Web Apps.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Azure CLI** (optional but recommended): Install from [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

## Deployment Steps

### 1. Create Azure Static Web App

#### Option A: Using Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web Apps" and select it
4. Click "Create"
5. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Name**: `abn-amro-dashboard` (or your preferred name)
   - **Plan Type**: Free (for development) or Standard (for production)
   - **Region**: Choose closest to your users
   - **Source**: GitHub
   - **GitHub Account**: Connect your GitHub account
   - **Organization**: Your GitHub username/organization
   - **Repository**: Select your dashboard repository
   - **Branch**: main (or master)
   - **Build Preset**: React
   - **App Location**: `/` (root of repository)
   - **API Location**: Leave empty
   - **Output Location**: `build`

#### Option B: Using Azure CLI
```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name rg-abn-amro-dashboard --location westeurope

# Create static web app
az staticwebapp create \
  --name abn-amro-dashboard \
  --resource-group rg-abn-amro-dashboard \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO \
  --location westeurope \
  --branch main \
  --app-location "/" \
  --output-location "build"
```

### 2. Configure GitHub Secrets

After creating the Static Web App, Azure will automatically:
1. Add a deployment workflow to your repository (`.github/workflows/azure-static-web-apps-xxx.yml`)
2. Add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to your GitHub repository

### 3. Verify Deployment

1. Push your code to the main branch
2. Check the Actions tab in your GitHub repository
3. Wait for the deployment to complete
4. Visit your Static Web App URL (available in Azure Portal)

## Configuration Files Explained

### `.github/workflows/azure-static-web-apps.yml`
- **Purpose**: Automates deployment when you push to main branch
- **Triggers**: Push to main/master, Pull requests
- **Actions**: Installs dependencies, builds the app, deploys to Azure

### `staticwebapp.config.json`
- **Purpose**: Configures routing for your Single Page Application
- **Key Features**:
  - Routes all paths to `index.html` for client-side routing
  - Handles 404 errors properly
  - Sets cache headers
  - Excludes static assets from rewriting

### `package.json` (Updated Scripts)
- **`build`**: Modified to ignore ESLint warnings during build
- **`build:prod`**: Production build with optimizations

## Environment Variables

If you need environment variables:

1. Copy `.env.example` to `.env.local`
2. Update the values as needed
3. In Azure Portal, go to your Static Web App → Configuration
4. Add environment variables in the "Application settings" section

## Custom Domain (Optional)

To use a custom domain:

1. In Azure Portal, go to your Static Web App
2. Select "Custom domains" from the left menu
3. Click "Add custom domain"
4. Follow the DNS configuration instructions

## Monitoring and Logs

- **Application Insights**: Can be enabled for monitoring
- **Function logs**: Available in Azure Portal under "Functions" (if using APIs)
- **GitHub Actions logs**: Check the Actions tab in your repository

## Troubleshooting

### Common Issues:

1. **Build fails**: Check the GitHub Actions logs for specific errors
2. **Routes not working**: Verify `staticwebapp.config.json` is in the root directory
3. **Assets not loading**: Check the `output_location` is set to `build`

### Support:
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Production Checklist

Before going live:
- [ ] Test all routes work correctly
- [ ] Verify mobile responsiveness
- [ ] Check performance metrics
- [ ] Set up custom domain (if needed)
- [ ] Configure Application Insights
- [ ] Review security headers
- [ ] Test in different browsers

## Cost Considerations

- **Free Tier**: 100 GB bandwidth, 0.5 GB storage, 2 custom domains
- **Standard Tier**: 100 GB bandwidth (then pay-per-use), 0.5 GB storage, unlimited custom domains

The dashboard should easily fit within the free tier limits for most use cases.