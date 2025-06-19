#!/bin/bash

# Azure Static Website Deployment Script
# For React App deployment to Azure Storage Account

set -e  # Exit on any error

# Configuration
STORAGE_ACCOUNT_NAME="analogclockstorage2025"
APP_PATH="/Users/viswanathbarenkala/work/work/analog-clock-app"
RESOURCE_GROUP_NAME=""  # Will be auto-detected if empty

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if Azure CLI is installed
if ! command_exists az; then
    print_error "Azure CLI is not installed. Please install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if Node.js is installed
if ! command_exists node; then
    print_error "Node.js is not installed. Please install it from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    print_error "npm is not installed. Please install Node.js which includes npm"
    exit 1
fi

print_success "All prerequisites are installed"

# Check if user is logged in to Azure
print_status "Checking Azure login status..."
if ! az account show > /dev/null 2>&1; then
    print_warning "Not logged in to Azure. Please log in:"
    az login
fi

# Get current subscription info
SUBSCRIPTION_INFO=$(az account show --query "{name:name, id:id}" -o tsv)
print_success "Logged in to Azure subscription: $SUBSCRIPTION_INFO"

# Auto-detect resource group if not specified
if [ -z "$RESOURCE_GROUP_NAME" ]; then
    print_status "Auto-detecting resource group for storage account..."
    RESOURCE_GROUP_NAME=$(az storage account show --name $STORAGE_ACCOUNT_NAME --query "resourceGroup" -o tsv 2>/dev/null || echo "")
    
    if [ -z "$RESOURCE_GROUP_NAME" ]; then
        print_error "Could not find storage account '$STORAGE_ACCOUNT_NAME' or auto-detect resource group."
        print_error "Please ensure the storage account exists and you have access to it."
        exit 1
    fi
    
    print_success "Found storage account in resource group: $RESOURCE_GROUP_NAME"
fi

# Verify storage account exists and has static website enabled
print_status "Verifying storage account configuration..."
STATIC_WEBSITE_ENABLED=$(az storage blob service-properties show --account-name $STORAGE_ACCOUNT_NAME --query "staticWebsite.enabled" -o tsv 2>/dev/null || echo "false")

if [ "$STATIC_WEBSITE_ENABLED" != "true" ]; then
    print_warning "Static website hosting is not enabled on storage account"
    print_status "Enabling static website hosting..."
    
    az storage blob service-properties update \
        --account-name $STORAGE_ACCOUNT_NAME \
        --static-website \
        --404-document "404.html" \
        --index-document "index.html"
    
    print_success "Static website hosting enabled"
fi

# Get storage account URL
WEBSITE_URL=$(az storage account show --name $STORAGE_ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --query "primaryEndpoints.web" -o tsv)
print_success "Website URL: $WEBSITE_URL"

# Navigate to app directory
print_status "Navigating to app directory: $APP_PATH"
if [ ! -d "$APP_PATH" ]; then
    print_error "App directory does not exist: $APP_PATH"
    exit 1
fi

cd "$APP_PATH"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing npm dependencies..."
    npm install
    print_success "Dependencies installed"
fi

# Build the React app
print_status "Building React app..."
npm run build

if [ ! -d "build" ]; then
    print_error "Build directory not found. Build may have failed."
    exit 1
fi

print_success "React app built successfully"

# Deploy to Azure Storage
print_status "Deploying to Azure Storage Account..."

# Clear existing files in $web container (optional - uncomment if you want to clean before deploy)
# print_status "Clearing existing files..."
# az storage blob delete-batch --account-name $STORAGE_ACCOUNT_NAME --source '$web' --pattern "*" 2>/dev/null || true

# Upload build files to $web container
print_status "Uploading files to \$web container..."
az storage blob upload-batch \
    --account-name $STORAGE_ACCOUNT_NAME \
    --destination '$web' \
    --source "./build" \
    --overwrite \
    --no-progress

print_success "Files uploaded successfully"

# Set proper content types for common file types
print_status "Setting content types..."

# Set content type for HTML files
az storage blob update-batch \
    --account-name $STORAGE_ACCOUNT_NAME \
    --source '$web' \
    --pattern "*.html" \
    --content-type "text/html" \
    --content-cache-control "no-cache" \
    > /dev/null 2>&1 || true

# Set content type for CSS files
az storage blob update-batch \
    --account-name $STORAGE_ACCOUNT_NAME \
    --source '$web' \
    --pattern "*.css" \
    --content-type "text/css" \
    --content-cache-control "max-age=31536000" \
    > /dev/null 2>&1 || true

# Set content type for JS files
az storage blob update-batch \
    --account-name $STORAGE_ACCOUNT_NAME \
    --source '$web' \
    --pattern "*.js" \
    --content-type "application/javascript" \
    --content-cache-control "max-age=31536000" \
    > /dev/null 2>&1 || true

print_success "Content types set"

# Final success message
echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📱 Your analog clock app is now live at:"
echo "🔗 $WEBSITE_URL"
echo ""
echo "📊 Deployment Summary:"
echo "   • Storage Account: $STORAGE_ACCOUNT_NAME"
echo "   • Resource Group: $RESOURCE_GROUP_NAME"
echo "   • App Path: $APP_PATH"
echo "   • Build Size: $(du -sh build | cut -f1)"
echo ""
echo "💡 Tips:"
echo "   • Changes may take a few minutes to propagate"
echo "   • You can run this script again to deploy updates"
echo "   • Monitor your storage account costs in the Azure portal"
echo ""
