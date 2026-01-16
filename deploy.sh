#!/bin/bash
# Solar Expert - Production Deployment Script (Linux/Mac)
# This script deploys all three applications (backend, frontend, admin-panel)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
TARGET="all"
SKIP_BUILD=false
SKIP_TESTS=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --target)
            TARGET="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║           Solar Expert - Production Deployment                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}\n"

# Function to deploy backend
deploy_backend() {
    echo -e "\n${CYAN}📦 Deploying Backend...${NC}"
    
    cd backend
    
    if [ "$SKIP_TESTS" = false ]; then
        echo -e "${YELLOW}Running backend tests...${NC}"
        npm test || true
    fi
    
    echo -e "${YELLOW}Installing production dependencies...${NC}"
    npm ci --production
    
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    echo -e "\n${CYAN}📦 Deploying User Frontend...${NC}"
    
    cd frontend
    
    if [ "$SKIP_BUILD" = false ]; then
        echo -e "${YELLOW}Building frontend for production...${NC}"
        npm ci
        npm run build
        
        echo -e "${GREEN}✅ Frontend built successfully!${NC}"
        echo -e "${CYAN}Build output: frontend/build/${NC}"
    fi
    
    cd ..
}

# Function to deploy admin panel
deploy_admin() {
    echo -e "\n${CYAN}📦 Deploying Admin Panel...${NC}"
    
    cd admin-panel
    
    if [ "$SKIP_BUILD" = false ]; then
        echo -e "${YELLOW}Building admin panel for production...${NC}"
        npm ci
        npm run build
        
        echo -e "${GREEN}✅ Admin Panel built successfully!${NC}"
        echo -e "${CYAN}Build output: admin-panel/build/${NC}"
    fi
    
    cd ..
}

# Main deployment logic
case $TARGET in
    backend)
        deploy_backend
        ;;
    frontend)
        deploy_frontend
        ;;
    admin)
        deploy_admin
        ;;
    all)
        deploy_backend
        deploy_frontend
        deploy_admin
        ;;
    *)
        echo -e "${RED}Invalid target: $TARGET${NC}"
        echo "Valid targets: all, backend, frontend, admin"
        exit 1
        ;;
esac

echo -e "\n${GREEN}"
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                  Deployment Completed Successfully!                ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "${NC}1. Configure your web server (nginx, Apache)${NC}"
echo -e "${NC}2. Set up environment variables for production${NC}"
echo -e "${NC}3. Configure SSL certificates${NC}"
echo -e "${NC}4. Point domains to the build directories${NC}"
echo -e "${CYAN}   - User Panel: frontend/build/${NC}"
echo -e "${CYAN}   - Admin Panel: admin-panel/build/${NC}"
echo -e "${NC}5. Start the backend server with PM2 or similar process manager${NC}\n"
