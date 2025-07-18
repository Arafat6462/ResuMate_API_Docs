# 🏗️ ResuMate System Architecture

!!! abstract "Architecture Overview"
    Modern, scalable Django REST API with AI integration, containerized deployment, and enterprise-grade database design.

---

## 🎯 High-Level Architecture

!!! note "System Components"
    ResuMate follows a **3-tier architecture** with clear separation of concerns, microservices-ready design, and horizontal scalability.

```mermaid
graph TB
    subgraph Client["Client Layer"]
        WEB["Web Client<br/>React/Angular/Vue"]
        MOB["Mobile App<br/>Flutter/React Native"]
        API_CLIENT["External API<br/>Third-party integrations"]
    end
    
    subgraph Gateway["API Gateway Layer"]
        NGINX["Nginx<br/>Load Balancer & Reverse Proxy"]
        RATE["Rate Limiting<br/>DRF Throttling"]
    end
    
    subgraph App["Application Layer"]
        AUTH["Authentication<br/>JWT Tokens"]
        RESUME["Resume Service<br/>CRUD Operations"]
        AI_SVC["AI Service<br/>Content Generation"]
        JOB["Job Tracker<br/>Application Management"]
    end
    
    subgraph External["External AI Services"]
        GEMINI["Google Gemini<br/>Premium AI Model"]
        OPENROUTER["OpenRouter<br/>Multiple AI Models"]
    end
    
    subgraph Data["Data Layer"]
        POSTGRES[("PostgreSQL<br/>Primary Database")]
        REDIS[("Redis<br/>Caching & Sessions")]
        FILES["File Storage<br/>Static/Media Files"]
    end
    
    WEB --> NGINX
    MOB --> NGINX
    API_CLIENT --> NGINX
    
    NGINX --> RATE
    RATE --> AUTH
    RATE --> RESUME
    RATE --> AI_SVC
    RATE --> JOB
    
    AI_SVC --> GEMINI
    AI_SVC --> OPENROUTER
    
    AUTH --> POSTGRES
    RESUME --> POSTGRES
    JOB --> POSTGRES
    
    AUTH --> REDIS
    RESUME --> FILES
    
    style POSTGRES fill:#336791,color:#fff
    style GEMINI fill:#4285f4,color:#fff
    style OPENROUTER fill:#ff6b6b,color:#fff
    style NGINX fill:#009639,color:#fff
```

---

## 📊 Database Schema (ERD)

!!! info "Entity Relationship Diagram"
    PostgreSQL database with optimized relationships, soft deletes, and audit trails.

```mermaid
erDiagram
    User {
        int id PK
        string username UK
        string email
        string password_hash
        boolean is_active
        boolean is_staff
        boolean is_superuser
        datetime date_joined
        datetime last_login
    }
    
    Resume {
        int id PK
        int user_id FK
        string title
        text content
        datetime created_at
        datetime updated_at
    }
    
    JobApplication {
        int id PK
        int user_id FK
        int resume_used_id FK
        string job_title
        string company_name
        text original_job_description
        date date_applied
        string status
        text notes
        boolean is_deleted
        boolean is_example
        datetime created_at
        datetime updated_at
    }
    
    AIModel {
        int id PK
        string display_name UK
        string model_name
        string api_provider
        string api_key_name
        boolean is_active
        boolean login_required
        int daily_limit
        string response_time_info
        text description
        datetime created_at
        datetime updated_at
    }
    
    User ||--o{ Resume : "owns"
    User ||--o{ JobApplication : "creates"
    Resume ||--o{ JobApplication : "used_in"
```

**Key Database Features:**

=== "🔑 Primary Relationships"
    
    - **User ↔ Resume**: One-to-Many (User can have multiple resumes)
    - **User ↔ JobApplication**: One-to-Many (User can have multiple applications) 
    - **Resume ↔ JobApplication**: One-to-Many (Resume can be used for multiple applications)
    - **Anonymous User Support**: Special user account for non-authenticated resume generation

=== "🛡️ Data Integrity"
    
    - **Soft Deletes**: JobApplication uses `is_deleted` flag instead of hard deletion
    - **Audit Trails**: All models include `created_at` and `updated_at` timestamps
    - **Cascade Protection**: Resume deletion sets JobApplication.resume_used to NULL
    - **Unique Constraints**: Username and AI model display names enforced at DB level

=== "⚡ Performance Optimizations"
    
    - **Indexed Fields**: Foreign keys automatically indexed for fast joins
    - **Selective Queries**: Default filtering excludes soft-deleted records
    - **Connection Pooling**: PostgreSQL with psycopg2-binary for optimized connections
    - **Query Optimization**: Django ORM with select_related and prefetch_related

---

## 🔄 API Request Flow

!!! success "Request Processing Pipeline"
    Complete request lifecycle from client to response with security, validation, and AI integration.

```mermaid
sequenceDiagram
    participant Client
    participant Nginx
    participant Django
    participant JWT
    participant AI
    participant DB
    participant External
    
    Note over Client,External: AI Resume Generation Flow
    
    Client->>Nginx: POST /api/ai/generate/
    Nginx->>Django: Forward Request
    
    Django->>JWT: Validate Token (Optional)
    alt Authenticated User
        JWT-->>Django: Valid User
    else Anonymous User
        JWT-->>Django: Anonymous Access
    end
    
    Django->>Django: Validate Request Data
    Django->>DB: Check AI Model Permissions
    DB-->>Django: Model Configuration
    
    Django->>AI: Process Generation Request
    AI->>External: Call AI API (Gemini/OpenRouter)
    External-->>AI: AI Response
    AI-->>Django: Processed Content
    
    Django->>DB: Save Resume
    DB-->>Django: Resume ID
    
    Django-->>Client: Response with resume_id and content
    
    Note over Client,External: Error Handling
    
    alt API Error
        External-->>AI: AI Service Error
        AI-->>Django: Exception
        Django-->>Client: 503 Service Unavailable
    else Rate Limit Exceeded
        Django-->>Client: 429 Too Many Requests
    else Authentication Required
        JWT-->>Django: Invalid/Missing Token
        Django-->>Client: 401 Unauthorized
    end
```

**Flow Breakdown:**

=== "1️⃣ Authentication Layer"
    
    ```python
    # JWT Token Validation
    if token_provided:
        user = authenticate_jwt(token)
        permissions = get_user_permissions(user)
    else:
        user = AnonymousUser()
        permissions = get_anonymous_permissions()
    ```

=== "2️⃣ Business Logic Layer"
    
    ```python
    # AI Model Selection & Validation
    model = AIModel.objects.get(
        display_name=request_data['model'],
        is_active=True
    )
    
    if model.login_required and not user.is_authenticated:
        raise PermissionError("Authentication required")
    ```

=== "3️⃣ External Service Integration"
    
    ```python
    # AI API Call with Error Handling
    try:
        ai_response = generate_resume_content(
            model_instance=model,
            user_input=request_data['user_input']
        )
    except Exception as e:
        return Response(
            {"error": "AI service unavailable"}, 
            status=503
        )
    ```

---

## 🔧 Technology Stack

!!! note "Modern Tech Stack"
    Enterprise-grade technologies chosen for scalability, performance, and maintainability.

=== "🎯 Backend Core"
    
    | Component | Technology | Version | Purpose |
    |-----------|------------|---------|---------|
    | **Framework** | Django | 5.0.14 | Web framework & ORM |
    | **API Layer** | Django REST Framework | Latest | RESTful API development |
    | **Database** | PostgreSQL | 16+ | Primary data storage |
    | **Caching** | Redis | 7+ | Session & query caching |
    | **Authentication** | JWT | djangorestframework-simplejwt | Stateless authentication |

=== "🤖 AI Integration"
    
    | Service | Provider | Model | Access Level |
    |---------|----------|-------|--------------|
    | **Google Gemini** | Google AI | gemini-2.0-flash-exp | 🔐 Authenticated (5/day) |
    | **Deepseek** | OpenRouter | deepseek/deepseek-r1 | 🌐 Public (Unlimited) |
    | **Cypher** | OpenRouter | teknium/openhermes-2.5 | 🌐 Public (Unlimited) |

=== "🐳 DevOps & Infrastructure"
    
    | Component | Technology | Purpose |
    |-----------|------------|---------|
    | **Containerization** | Docker + Compose | Development & deployment |
    | **CI/CD** | GitHub Actions | Automated testing & deployment |
    | **Web Server** | Gunicorn + Nginx | Production WSGI server |
    | **Monitoring** | Django Logging | Error tracking & performance |
    | **Static Files** | WhiteNoise | Static asset serving |

---

## 🛡️ Security Architecture

!!! warning "Security Features"
    Multi-layered security approach with authentication, authorization, and data protection.

```mermaid
graph LR
    subgraph Security["Security Layers"]
        subgraph Network["Network Security"]
            HTTPS["HTTPS/TLS"]
            CORS["CORS Policy"]
            NGINX_SEC["Nginx Security Headers"]
        end
        
        subgraph Application["Application Security"]
            JWT["JWT Tokens"]
            RATE_LIMIT["Rate Limiting"]
            VALIDATION["Input Validation"]
        end
        
        subgraph DataSec["Data Security"]
            DB_ENCRYPT["DB Encryption"]
            SOFT_DELETE["Soft Deletes"]
            API_KEYS["API Key Management"]
        end
    end
    
    HTTPS --> JWT
    CORS --> RATE_LIMIT
    NGINX_SEC --> VALIDATION
    JWT --> DB_ENCRYPT
    RATE_LIMIT --> SOFT_DELETE
    VALIDATION --> API_KEYS
    
    style HTTPS fill:#d73027,color:#fff
    style JWT fill:#1a9850,color:#fff
    style DB_ENCRYPT fill:#313695,color:#fff
```

**Security Implementation:**

=== "🔐 Authentication"
    
    - **JWT Tokens**: Stateless, secure token-based authentication
    - **Token Refresh**: Automatic token renewal for seamless UX
    - **Anonymous Access**: Limited functionality for non-authenticated users
    - **Permission Levels**: Granular access control per endpoint

=== "🛡️ Data Protection"
    
    - **Environment Variables**: Sensitive data stored securely
    - **API Key Rotation**: Support for key rotation without downtime
    - **Soft Deletes**: Data retention for audit and recovery
    - **SQL Injection Protection**: Django ORM prevents SQL injection

=== "⚡ Performance Security"
    
    - **Rate Limiting**: Per-user and per-endpoint throttling
    - **Request Size Limits**: Protection against large payload attacks
    - **Connection Pooling**: Efficient database connection management
    - **Static File Security**: Secure serving of user-generated content

---

## 📈 Scalability Design

!!! tip "Horizontal Scaling"
    Designed for growth with microservices-ready architecture and cloud deployment.

```mermaid
graph TB
    subgraph LoadBalancer["Load Balancer"]
        LB["Load Balancer<br/>Nginx/HAProxy"]
    end
    
    subgraph AppServers["Application Servers"]
        APP1["Django Instance 1"]
        APP2["Django Instance 2"]
        APP3["Django Instance 3"]
    end
    
    subgraph DataLayer["Data Layer"]
        DB_MASTER[("PostgreSQL Master")]
        DB_READ1[("Read Replica 1")]
        DB_READ2[("Read Replica 2")]
        REDIS_CLUSTER[("Redis Cluster")]
    end
    
    subgraph AIServices["AI Services"]
        AI_POOL["AI Service Pool<br/>Multiple API Keys"]
    end
    
    LB --> APP1
    LB --> APP2
    LB --> APP3
    
    APP1 --> DB_MASTER
    APP2 --> DB_READ1
    APP3 --> DB_READ2
    
    APP1 --> REDIS_CLUSTER
    APP2 --> REDIS_CLUSTER
    APP3 --> REDIS_CLUSTER
    
    APP1 --> AI_POOL
    APP2 --> AI_POOL
    APP3 --> AI_POOL
    
    style LB fill:#2ecc71,color:#fff
    style DB_MASTER fill:#e74c3c,color:#fff
    style DB_READ1 fill:#3498db,color:#fff
    style DB_READ2 fill:#3498db,color:#fff
    style REDIS_CLUSTER fill:#e67e22,color:#fff
```

**Scalability Features:**

=== "🔧 Application Scaling"
    
    - **Stateless Design**: No server-side sessions, JWT for authentication
    - **Docker Containers**: Easy horizontal scaling with container orchestration
    - **Load Balancing**: Multiple Django instances behind load balancer
    - **Microservices Ready**: Clear service boundaries for future splitting

=== "💾 Database Scaling"
    
    - **Read Replicas**: Separate read and write database instances
    - **Connection Pooling**: Efficient database connection management
    - **Query Optimization**: Indexed queries and relationship optimization
    - **Caching Strategy**: Redis for session and query result caching

=== "🤖 AI Service Scaling"
    
    - **Multiple API Keys**: Round-robin across different API keys
    - **Model Selection**: Dynamic AI model selection based on load
    - **Retry Logic**: Automatic retry with exponential backoff
    - **Circuit Breaker**: Fail-fast pattern for external service calls

---

## 🚀 Deployment Architecture

!!! success "Production Deployment"
    Docker-based deployment with CI/CD automation and environment management.

```mermaid
graph TB
    subgraph Development["Development"]
        DEV_CODE["Local Development<br/>Docker Compose"]
        GIT["Git Repository<br/>GitHub"]
    end
    
    subgraph CICD["CI/CD Pipeline"]
        ACTIONS["GitHub Actions"]
        TESTS["Automated Tests"]
        BUILD["Docker Build"]
        REGISTRY["Docker Hub<br/>Image Registry"]
    end
    
    subgraph Production["Production Environment"]
        PROD_SERVER["Production Server<br/>Linux/Cloud"]
        PROD_DB[("PostgreSQL<br/>Production")]
        PROD_REDIS[("Redis<br/>Production")]
        NGINX_PROD["Nginx<br/>Reverse Proxy"]
    end
    
    DEV_CODE --> GIT
    GIT --> ACTIONS
    ACTIONS --> TESTS
    TESTS --> BUILD
    BUILD --> REGISTRY
    
    REGISTRY --> PROD_SERVER
    PROD_SERVER --> PROD_DB
    PROD_SERVER --> PROD_REDIS
    NGINX_PROD --> PROD_SERVER
    
    style ACTIONS fill:#2ecc71,color:#fff
    style REGISTRY fill:#0db7ed,color:#fff
    style PROD_SERVER fill:#e74c3c,color:#fff
    style NGINX_PROD fill:#009639,color:#fff
```

**Deployment Process:**

=== "🔄 Continuous Integration"
    
    ```yaml
    # GitHub Actions Workflow
    name: CI/CD Pipeline
    on: [push, pull_request]
    
    jobs:
      test:
        runs-on: ubuntu-latest
        steps:
          - name: Run Tests
            run: docker-compose -f docker-compose.test.yml up --abort-on-container-exit
      
      build:
        needs: test
        runs-on: ubuntu-latest
        steps:
          - name: Build & Push Docker Image
            run: |
              docker build -t resumate:${{ github.sha }} .
              docker push resumate:${{ github.sha }}
    ```

=== "🐳 Container Strategy"
    
    - **Multi-Stage Builds**: Optimized production images
    - **Environment Separation**: Different configurations for dev/staging/prod
    - **Health Checks**: Container health monitoring and auto-restart
    - **Volume Management**: Persistent data and log volumes

=== "📊 Monitoring & Maintenance"
    
    - **Application Logs**: Structured logging with Django logging framework
    - **Error Tracking**: Centralized error collection and alerting
    - **Performance Metrics**: Database query optimization and response times
    - **Backup Strategy**: Automated database backups and recovery procedures

---

## 💡 Design Decisions & Trade-offs

!!! abstract "Architectural Choices"
    Key decisions made for performance, maintainability, and scalability.

=== "🎯 Framework Choice: Django REST Framework"
    
    **Why Django REST Framework?**
    
    ✅ **Advantages:**
    - Rapid API development with built-in serialization
    - Robust authentication and permission system
    - Extensive ecosystem and community support
    - Built-in admin interface for data management
    - ORM provides database abstraction and migrations
    
    ⚠️ **Trade-offs:**
    - Higher memory footprint compared to FastAPI
    - Python GIL limitations for CPU-intensive tasks
    - Learning curve for Django conventions

=== "🗄️ Database Choice: PostgreSQL"
    
    **Why PostgreSQL over MongoDB?**
    
    ✅ **Advantages:**
    - ACID compliance for data integrity
    - Complex relationships between Users, Resumes, JobApplications
    - Mature ecosystem with excellent Django integration
    - Advanced indexing and query optimization
    - JSON field support for flexible resume content storage
    
    ⚠️ **Trade-offs:**
    - Vertical scaling limitations
    - Schema migrations required for structure changes
    - More complex than NoSQL for simple document storage

=== "🤖 AI Integration Strategy"
    
    **Why Multiple AI Providers?**
    
    ✅ **Advantages:**
    - Risk mitigation - no single point of failure
    - Cost optimization - use free models for anonymous users
    - Performance diversity - different models for different use cases
    - Rate limit distribution across multiple services
    
    ⚠️ **Trade-offs:**
    - Increased complexity in AI service management
    - Multiple API keys and configurations to maintain
    - Inconsistent response formats between providers

=== "🔐 Authentication Strategy: JWT"
    
    **Why JWT over Session-based Authentication?**
    
    ✅ **Advantages:**
    - Stateless - no server-side session storage required
    - Scalable across multiple server instances
    - Mobile-friendly with token-based approach
    - Built-in expiration and refresh token support
    
    ⚠️ **Trade-offs:**
    - Token size larger than session IDs
    - Cannot revoke tokens before expiration
    - More complex client-side token management

---

!!! success "Architecture Summary"
    ResuMate's architecture successfully balances **performance**, **scalability**, and **maintainability** through:
    
    - **🎯 Clear Separation of Concerns**: Distinct layers for presentation, business logic, and data
    - **🔧 Modular Design**: Independent apps that can evolve separately
    - **⚡ Performance Optimization**: Caching, database indexing, and efficient query patterns
    - **🛡️ Security First**: Multi-layered security with authentication, authorization, and data protection
    - **📈 Scalability Ready**: Horizontal scaling support with containerization and load balancing
    - **🚀 DevOps Integration**: Automated CI/CD with testing, building, and deployment pipelines

---

*Architecture documentation automatically updated with latest system design • Last Updated: July 2025*
