<div align="center">
  <img src="https://via.placeholder.com/150x150.png?text=AyurWell+Logo" alt="AyurWell Logo" width="150" height="150" />
  <h1>AyurWell</h1>
  <p><strong>Bridging Traditional Ayurvedic Wisdom with Modern AI Technology</strong></p>
</div>

---

AyurWell is an intelligent, full-stack web application designed to empower users to explore Ayurvedic remedies, search for natural products with advanced fuzzy-matching, and consume authentic, peer-reviewed knowledge from trusted medical domains. Built with security, performance, and best software development practices in mind.

## 🚀 Features

- **Intelligent Product Search**: A backend-powered search engine utilizing hybrid retrieval pipelines and fuzzy matching to rank and retrieve Ayurvedic products intelligently, even when there are spelling mistakes.
- **Authentic Knowledge Hub**: An integrated knowledge base that securely fetches live, peer-reviewed medical and Ayurvedic research directly from authoritative sources (e.g., NIH, ScienceDirect, WHO) via secure web scraping.
- **Dynamic Frontend**: A beautifully designed React interface using Tailwind CSS and Framer Motion, delivering a smooth, responsive, and glassmorphic user experience.
- **Secure Architecture**: Implements security best practices including parameterized ORM queries to prevent SQL injection, configurable CORS, and strict environment variable management.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & Framer Motion
- **Architecture**: Modular functional components with encapsulated API service hooks.

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite3 via SQLAlchemy ORM (SQL Injection safe)
- **Search Logic**: `thefuzz` (for string matching), `ddgs` (for authentic web scraping)
- **Architecture**: Object-Oriented Principles (OOP) applied strategically to Service layers, Database Managers, and Retrieval Pipelines.

## 📂 Project Structure

```text
Ayurwell_website/
├── backend/
│   ├── api/               # FastAPI routing and service abstractions
│   ├── db/                # Database models and configuration
│   ├── hybrid/            # AI pipelines and query processing
│   ├── response/          # Explainability engine
│   └── main.py            # Application entry point
├── src/                   # React Frontend
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application route pages
│   ├── hooks/             # Custom React hooks
│   └── App.tsx            # Main application layout
└── .env.example           # Example environment variables template
```

## 🔐 Security Best Practices Implemented
- **CORS Protection**: Restricted Cross-Origin Resource Sharing based on environment configuration.
- **SQL Injection Prevention**: Exclusive use of SQLAlchemy ORM parameterized queries.
- **Secret Management**: API keys and Database URLs are loaded securely via `.env`.
- **Clean Git History**: Strict `.gitignore` to prevent leaking caches, local databases, or build artifacts.

## 💻 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn thefuzz[speedup] ddgs pydantic sqlalchemy

# Start FastAPI server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

## 📖 API Documentation
Once the backend is running, explore the interactive API documentation (Swagger UI):
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
When contributing, please adhere to our architectural standards by avoiding raw SQL queries and encapsulating complex logic into service classes.

## 📜 License
This project is open-source and available under the MIT License.
