# CanWeatherWatch

A mobile-friendly web application providing real-time weather alerts and traffic camera monitoring across Canada.

## Features
- Interactive map of Canada with weather alerts
- Real-time Environment Canada weather warnings
- Traffic camera integration
- Location search and favorites
- Mobile-optimized interface

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Development Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd canweatherwatch

# Start with Docker Compose
docker-compose up --build

# Or run locally:
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (in another terminal)
cd frontend
npm install
npm start