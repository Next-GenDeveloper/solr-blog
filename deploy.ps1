# Solar Expert - Production Deployment Script
# This script deploys all three applications (backend, frontend, admin-panel)

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("all", "backend", "frontend", "admin")]
    [string]$Target = "all",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipTests
)

Write-Host "`n╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           Solar Expert - Production Deployment                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites check passed`n" -ForegroundColor Green

# Function to deploy backend
function Deploy-Backend {
    Write-Host "`n📦 Deploying Backend..." -ForegroundColor Cyan
    
    Set-Location backend
    
    if (-not $SkipTests) {
        Write-Host "Running backend tests..." -ForegroundColor Yellow
        npm test
    }
    
    Write-Host "Installing production dependencies..." -ForegroundColor Yellow
    npm ci --production
    
    Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
    Set-Location ..
}

# Function to deploy frontend
function Deploy-Frontend {
    Write-Host "`n📦 Deploying User Frontend..." -ForegroundColor Cyan
    
    Set-Location frontend
    
    if (-not $SkipBuild) {
        Write-Host "Building frontend for production..." -ForegroundColor Yellow
        npm ci
        npm run build
        
        Write-Host "✅ Frontend built successfully!" -ForegroundColor Green
        Write-Host "Build output: frontend/build/" -ForegroundColor Gray
    }
    
    Set-Location ..
}

# Function to deploy admin panel
function Deploy-AdminPanel {
    Write-Host "`n📦 Deploying Admin Panel..." -ForegroundColor Cyan
    
    Set-Location admin-panel
    
    if (-not $SkipBuild) {
        Write-Host "Building admin panel for production..." -ForegroundColor Yellow
        npm ci
        npm run build
        
        Write-Host "✅ Admin Panel built successfully!" -ForegroundColor Green
        Write-Host "Build output: admin-panel/build/" -ForegroundColor Gray
    }
    
    Set-Location ..
}

# Main deployment logic
try {
    switch ($Target) {
        "backend" {
            Deploy-Backend
        }
        "frontend" {
            Deploy-Frontend
        }
        "admin" {
            Deploy-AdminPanel
        }
        "all" {
            Deploy-Backend
            Deploy-Frontend
            Deploy-AdminPanel
        }
    }
    
    Write-Host "`n╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                  Deployment Completed Successfully!                ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green
    
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Configure your web server (nginx, Apache, IIS)" -ForegroundColor White
    Write-Host "2. Set up environment variables for production" -ForegroundColor White
    Write-Host "3. Configure SSL certificates" -ForegroundColor White
    Write-Host "4. Point domains to the build directories" -ForegroundColor White
    Write-Host "   - User Panel: frontend/build/" -ForegroundColor Gray
    Write-Host "   - Admin Panel: admin-panel/build/" -ForegroundColor Gray
    Write-Host "5. Start the backend server with PM2 or similar process manager`n" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Deployment failed: $_" -ForegroundColor Red
    exit 1
}
