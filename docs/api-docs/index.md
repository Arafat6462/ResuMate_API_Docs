# 🔗 ResuMate API Documentation

!!! success "Base URL:"
    ```
    https://arafat2.me/api/
    ```  
---

## 🎯 Overview

!!! abstract "About ResuMate API"
    A comprehensive REST API providing user management, resume CRUD operations, AI-powered resume generation with multiple models (Google Gemini, OpenRouter), job application tracking, and PostgreSQL persistence with both authenticated and anonymous access.

!!! tip "Key Features"
    :material-shield-check:{ style="color: #4caf50" } **JWT Authentication** • :material-file-document-multiple:{ style="color: #2196f3" } **Full Resume Management** • :material-brain:{ style="color: #9c27b0" } **Multiple AI Models** • :material-briefcase:{ style="color: #ff9800" } **Job Tracking** • :material-lightning-bolt:{ style="color: #dc382d" } **Redis Caching** • :material-eye:{ style="color: #607d8b" } **Example Data**

!!! example "Quick Start - Try Now!"
    :material-lock-open:{ style="color: #eb7f12ff" } **No auth required:** [:material-brain:{ style="color: #ffff70ff" } AI Models](https://arafat2.me/api/ai/models/) • [:material-eye:{ style="color: #56f80aff" } Example Applications](https://arafat2.me/api/example-job-applications/) • [:material-api:{ style="color: #efe9a3ff" } API Root](https://arafat2.me/api/)

---

## ⚡ Redis Caching System

!!! success "High-Performance Caching"
    ResuMate API implements **Redis caching** for frequently accessed endpoints to deliver lightning-fast responses and reduce database load.

!!! info "Cache Implementation Details"
    **Cached Endpoints:**
    
    - :material-brain:{ style="color: #9c27b0" } **`/api/ai/models/`** - AI model configurations
    - :material-eye:{ style="color: #ff9800" } **`/api/example-job-applications/`** - Demo job application data
    
    **Cache Configuration:**
    
    - **Redis Version:** `7+ Alpine`
    - **Memory Limit:** `256MB`
    - **Eviction Policy:** `allkeys-lru` (Least Recently Used)
    - **Default TTL:** `1 hour (3600 seconds)`
    - **Cache Hit Ratio:** `~85-90%` in production

!!! tip "Cache Response Format"
    All cached endpoints return responses with cache status information:
    
    ```json
    {
      "cache_status": "HIT (Response from Redis cache)",
      "data": { /* actual response data */ }
    }
    ```
    
    **Response Headers:**
    - `X-Cache-Status: HIT` - Data served from Redis cache
    - `X-Cache-Status: MISS` - Data fetched from database

!!! example "Performance Benefits"
    === ":material-speedometer: Response Times"
        - **Cache HIT:** `~10-20ms` average response time
        - **Cache MISS:** `~80-150ms` average response time
        - **Performance Gain:** `85% faster` for cached requests
    
    === ":material-database: Database Impact"
        - **Reduced DB Load:** `90% fewer` database queries for cached endpoints
        - **Improved Scalability:** Better handling of concurrent requests
        - **Cost Efficiency:** Lower server resource utilization
---

## 🔐 Authentication

!!! warning "Authentication Required"
    Most endpoints require JWT authentication. Anonymous access is limited to specific AI models and example data endpoints.

!!! info "JWT Token Authentication"
    The API uses JSON Web Tokens (JWT) for secure authentication. Include your token in the Authorization header:
    
    ```http
    Authorization: Bearer <your-jwt-token>
    ```

### 🔑 Authentication Endpoints

!!! example "Authentication Flow"
    === ":material-account-plus: Register"
        
        !!! success "POST `/api/auth/register/`"
            **Description:** Create a new user account  
            **Authentication:** :material-shield-off:{ style="color: #9e9e9e" } Not Required
        
        **Request Body:**
        ```json
        {
          "username": "string",
          "email": "string",
          "password": "string",
          "password2": "string"
        }
        ```
        
        !!! check "Response (201 Created)"
            ```json
            {
              "id": 1,
              "username": "john_doe",
              "email": "john@example.com"
            }
            ```

    === ":material-login: Login"
        
        !!! info "POST `/api/auth/token/`"
            **Description:** Obtain access and refresh tokens  
            **Authentication:** :material-shield-off:{ style="color: #9e9e9e" } Not Required
        
        **Request Body:**
        ```json
        {
          "username": "string",
          "password": "string"
        }
        ```
        
        !!! check "Response (200 OK)"
            ```json
            {
              "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
              "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
            }
            ```

    === ":material-refresh: Refresh Token"
        
        !!! tip "POST `/api/auth/token/refresh/`"
            **Description:** Refresh your access token  
            **Authentication:** :material-shield-check:{ style="color: #4caf50" } Refresh Token Required
        
        **Request Body:**
        ```json
        {
          "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
        }
        ```
        
        !!! check "Response (200 OK)"
            ```json
            {
              "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
            }
            ```

---

## 🚀 API Endpoints

### 📄 Resume Management

!!! abstract "Resume Operations"
    Complete CRUD operations for managing resume documents with user-specific access control.

!!! example "Resume Endpoints"
    === ":material-format-list-bulleted: List Resumes"
        
        !!! info "GET `/api/resumes/`"
            **Authentication:** :material-shield-check:{ style="color: #4caf50" } Required  
            **Description:** Retrieve all resumes for authenticated user
        
        !!! example "Sample Request"
            ```bash
            curl -H "Authorization: Bearer <token>" \
                 https://arafat2.me/api/resumes/
            ```
        
        !!! check "Response (200 OK)"
            ```json
            [
              {
                "id": 1,
                "user": "john_doe",
                "title": "Software Engineer Resume",
                "content": "# John Doe\n\n## Experience\n...",
                "created_at": "2023-01-15T10:30:00Z",
                "updated_at": "2023-01-16T14:20:00Z"
              }
            ]
            ```

    === ":material-plus: Create Resume"
        
        !!! success "POST `/api/resumes/`"
            **Authentication:** :material-shield-check:{ style="color: #4caf50" } Required  
            **Description:** Create a new resume document
        
        !!! example "Request Body"
            ```json
            {
              "title": "Software Engineer Resume",
              "content": "# John Doe\n\n## Experience\n..."
            }
            ```
        
        !!! check "Response (201 Created)"
            ```json
            {
              "id": 2,
              "user": "john_doe",
              "title": "Software Engineer Resume",
              "content": "# John Doe\n\n## Experience\n...",
              "created_at": "2023-01-15T10:30:00Z",
              "updated_at": "2023-01-15T10:30:00Z"
            }
            ```

    === ":material-file-document: Get Resume"
        
        !!! info "GET `/api/resumes/{id}/`"
            **Authentication:** :material-shield-check:{ style="color: #4caf50" } Required  
            **Description:** Retrieve a specific resume by ID

    === ":material-pencil: Update Resume"
        
        !!! warning "PUT/PATCH `/api/resumes/{id}/`"
            **Authentication:** :material-shield-check:{ style="color: #4caf50" } Required  
            **Description:** Update an existing resume

    === ":material-delete: Delete Resume"
        
        !!! danger "DELETE `/api/resumes/{id}/`"
            **Authentication:** :material-shield-check:{ style="color: #4caf50" } Required  
            **Description:** Delete a resume permanently

### 🤖 AI-Powered Resume Generation

!!! tip "AI Features"
    Generate professional resumes using advanced AI models with varying capabilities and access levels.

!!! example "AI Endpoints"
    === ":material-brain: List AI Models"
        
        !!! success "GET `/api/ai/models/`"
            **Authentication:** :material-shield-off:{ style="color: #9e9e9e" } Not Required  
            **Description:** Get available AI models and their configurations  
            **Caching:** :material-lightning-bolt:{ style="color: #dc382d" } Redis cached for 1 hour
        
        !!! example "Sample Request"
            ```bash
            curl https://arafat2.me/api/ai/models/
            ```
        
        !!! check "Response (200 OK) - Cache HIT"
            ```json
            {
              "cache_status": "HIT (Response from Redis cache)",
              "data": [
                {
                  "display_name": "Deepseek",
                  "description": "Advanced AI model for professional resume generation",
                  "response_time_info": "Fast",
                  "login_required": false
                },
                {
                  "display_name": "GPT-4",
                  "description": "Premium AI model with superior writing quality",
                  "response_time_info": "5-10 seconds",
                  "login_required": true
                }
              ]
            }
            ```
        
        !!! info "Cache Behavior"
            - **Cache Key:** `ai_models_list`
            - **Cache Duration:** 1 hour (3600 seconds)
            - **Cache Status:** Response includes `cache_status` field
            - **Headers:** `X-Cache-Status: HIT` or `X-Cache-Status: MISS`
            - **Performance:** ~85% faster response times for cached requests

    === ":material-auto-fix: Generate Resume"
        
        !!! info "POST `/api/ai/generate/`"
            **Authentication:** :material-shield-half-full:{ style="color: #ff9800" } Model Dependent  
            **Description:** Generate AI-powered resume content
        
        !!! example "Request Body"
            ```json
            {
              "model": "Deepseek",
              "user_input": "Software engineer with 5 years experience in Python, Django, React. Worked at tech startups building scalable web applications. Expert in cloud deployment and database optimization.",
              "title": "Senior Software Engineer Resume"
            }
            ```
        
        !!! check "Response (201 Created)"
            ```json
            {
              "resume_id": 15,
              "content": "# John Doe\n\n## Professional Summary\nExperienced Software Engineer with 5+ years of expertise in Python, Django, and React...\n\n## Technical Skills\n- **Backend:** Python, Django, RESTful APIs\n- **Frontend:** React, JavaScript, HTML5, CSS3\n..."
            }
            ```

### 📊 Job Application Tracking

!!! note "Job Management"
    Comprehensive job application tracking with status management and soft delete functionality.

!!! example "Job Application Endpoints"
    === ":material-clipboard-list: List Applications"
        
        !!! info "GET `/api/job-applications/`"
            **Authentication:** :material-shield-check:{ style="color: #4caf50" } Required  
            **Description:** Retrieve all job applications for authenticated user
        
        !!! example "Sample Request"
            ```bash
            curl -H "Authorization: Bearer <token>" \
                 https://arafat2.me/api/job-applications/
            ```
        
        !!! check "Response (200 OK)"
            ```json
            [
              {
                "id": 1,
                "user": 1,
                "job_title": "Senior Software Engineer",
                "company_name": "TechCorp Inc.",
                "original_job_description": "We are looking for a senior software engineer...",
                "resume_used": 1,
                "date_applied": "2023-01-15",
                "status": "Interviewing",
                "notes": "Had initial phone screening, technical interview scheduled for next week",
                "is_deleted": false,
                "is_example": false,
                "created_at": "2023-01-15T10:30:00Z",
                "updated_at": "2023-01-20T16:45:00Z"
              }
            ]
            ```

    === ":material-plus: Create Application"
        
        !!! success "POST `/api/job-applications/`"
            **Authentication:** :material-shield-check:{ style="color: #4caf50" } Required  
            **Description:** Create a new job application record
        
        !!! example "Request Body"
            ```json
            {
              "job_title": "Senior Software Engineer",
              "company_name": "TechCorp Inc.",
              "original_job_description": "We are looking for a senior software engineer...",
              "resume_used": 1,
              "date_applied": "2023-01-15",
              "status": "Applied",
              "notes": "Applied through company website"
            }
            ```

    === ":material-pencil: Update Application"
        
        !!! warning "PUT/PATCH `/api/job-applications/{id}/`"
            **Authentication:** :material-shield-check:{ style="color: #4caf50" } Required  
            **Description:** Update job application status and details

    === ":material-delete: Delete Application"
        
        !!! danger "DELETE `/api/job-applications/{id}/`"
            **Authentication:** :material-shield-check:{ style="color: #4caf50" } Required  
            **Description:** Soft delete (sets `is_deleted=true`)

    === ":material-eye: Example Applications"
        
        !!! tip "GET `/api/example-job-applications/`"
            **Authentication:** :material-shield-off:{ style="color: #9e9e9e" } Not Required  
            **Description:** Get up to 5 sample job applications for demo  
            **Caching:** :material-lightning-bolt:{ style="color: #dc382d" } Redis cached for 1 hour
        
        !!! example "Sample Request"
            ```bash
            curl https://arafat2.me/api/example-job-applications/
            ```
        
        !!! check "Response (200 OK) - Cache MISS"
            ```json
            {
              "cache_status": "MISS (Response from database)",
              "data": [
                {
                  "id": 1,
                  "job_title": "Senior Software Engineer",
                  "company": "TechCorp Inc.",
                  "status": "Interview Scheduled",
                  "application_date": "2024-12-15",
                  "description": "Full-stack development role..."
                }
              ]
            }
            ```
        
        !!! info "Cache Behavior"
            - **Cache Key:** `example_job_applications_list`
            - **Cache Duration:** 1 hour (3600 seconds)
            - **Cache Status:** Response includes `cache_status` field
            - **Headers:** `X-Cache-Status: HIT` or `X-Cache-Status: MISS`
            - **Performance:** Significantly faster response for demo data

---

## 📊 Data Models

!!! abstract "Database Schema"
    Complete data model specifications for all API resources with field descriptions and constraints.

!!! example "Model Specifications"
    === ":material-account: User Model"
        
        !!! info "User Account Structure"
            Core user model for authentication and authorization.
        
        ```json
        {
          "id": "integer (primary_key, auto_increment)",
          "username": "string (unique, max_length: 150)",
          "email": "string (valid_email, max_length: 254)",
          "is_active": "boolean (default: true)",
          "date_joined": "datetime (auto_now_add)"
        }
        ```

    === ":material-file-document: Resume Model"
        
        !!! success "Resume Document Structure"
            User-specific resume documents with content management.
        
        ```json
        {
          "id": "integer (primary_key, auto_increment)",
          "user": "foreign_key (User, on_delete: cascade)",
          "title": "string (max_length: 255)",
          "content": "text (markdown_supported)",
          "created_at": "datetime (auto_now_add)",
          "updated_at": "datetime (auto_now)"
        }
        ```

    === ":material-brain: AIModel Configuration"
        
        !!! tip "AI Model Settings"
            Configuration for available AI models and their capabilities.
        
        ```json
        {
          "display_name": "string (unique, max_length: 100)",
          "model_name": "string (max_length: 100)",
          "api_provider": "choice ('google_gemini', 'open_router')",
          "api_key_name": "string (max_length: 100)",
          "is_active": "boolean (default: true)",
          "login_required": "boolean (default: false)",
          "daily_limit": "positive_integer (null: unlimited)",
          "response_time_info": "string (max_length: 50)",
          "description": "text"
        }
        ```

    === ":material-briefcase: JobApplication Model"
        
        !!! warning "Job Application Structure"
            Comprehensive job application tracking with status management.
        
        ```json
        {
          "id": "integer (primary_key, auto_increment)",
          "user": "foreign_key (User, on_delete: cascade)",
          "job_title": "string (max_length: 200)",
          "company_name": "string (max_length: 200)",
          "original_job_description": "text",
          "resume_used": "foreign_key (Resume, null: true, blank: true)",
          "date_applied": "date",
          "status": "choice ('Applied', 'Interviewing', 'Offer', 'Rejected')",
          "notes": "text (blank: true)",
          "is_deleted": "boolean (default: false)",
          "is_example": "boolean (default: false)",
          "created_at": "datetime (auto_now_add)",
          "updated_at": "datetime (auto_now)"
        }
        ```

---

## ⚠️ Error Handling

!!! failure "Error Response System"
    Standardized error responses across all endpoints with comprehensive status codes and detailed messages.

### 📋 HTTP Status Codes

!!! example "Status Code Reference"
    === ":material-check-circle: Success Codes"
        
        | Code | Status | Description |
        |:----:|:-------|:-----------|
        | **200** | :material-check-circle:{ style="color: #4caf50" } **OK** | Request successful |
        | **201** | :material-plus-circle:{ style="color: #4caf50" } **Created** | Resource created successfully |
        
    === ":material-alert-circle: Client Error Codes"
        
        | Code | Status | Description |
        |:----:|:-------|:-----------|
        | **400** | :material-alert-circle:{ style="color: #ff9800" } **Bad Request** | Invalid request data |
        | **401** | :material-lock:{ style="color: #f44336" } **Unauthorized** | Authentication required |
        | **403** | :material-cancel:{ style="color: #f44336" } **Forbidden** | Insufficient permissions |
        | **404** | :material-help-circle:{ style="color: #2196f3" } **Not Found** | Resource not found |
        
    === ":material-server-network: Server Error Codes"
        
        | Code | Status | Description |
        |:----:|:-------|:-----------|
        | **503** | :material-server-network:{ style="color: #f44336" } **Service Unavailable** | AI service error |

### 📝 Error Response Format

!!! info "Standard Error Structure"
    All API errors follow this consistent format for easy handling:
    
    ```json
    {
      "error": "Error message description",
      "field_errors": {
        "field_name": ["Field-specific error message"]
      }
    }
    ```

### 🚨 Common Error Examples

!!! example "Error Response Examples"
    === ":material-lock: Authentication Error"
        
        !!! danger "401 Unauthorized"
            When JWT token is invalid or expired:
            
            ```json
            {
              "detail": "Given token not valid for any token type"
            }
            ```

    === ":material-alert-circle: Validation Error"
        
        !!! warning "400 Bad Request"
            When request data fails validation:
            
            ```json
            {
              "password": ["Password fields didn't match."],
              "email": ["This field is required."]
            }
            ```

    === ":material-server-network: AI Service Error"
        
        !!! failure "503 Service Unavailable"
            When AI model is temporarily unavailable:
            
            ```json
            {
              "error": "An error occurred while communicating with the AI service."
            }
            ```

    === ":material-help-circle: Resource Not Found"
        
        !!! info "404 Not Found"
            When requested resource doesn't exist:
            
            ```json
            {
              "detail": "Not found."
            }
            ```

---

## 🔒 Rate Limiting

!!! info "API Usage Limits"
    Fair usage policies and rate limits ensure service stability and equitable access for all users.

!!! example "Rate Limit Types"
    === ":material-robot: AI Model Limits"
        
        !!! warning "Daily Limits"
            - Some AI models have **daily request limits** per user
            - Limits are **configurable per model** in admin panel
            - **Premium models** may have stricter limits
        
    === ":material-account-off: Anonymous Users"
        
        !!! note "Limited Access"
            - **Limited AI models** available without authentication
            - **No job application** or resume management
            - **Example data** endpoints only
        
    === ":material-account-check: Authenticated Users"
        
        !!! tip "Enhanced Access"
            - **Higher rate limits** for all endpoints
            - **Access to premium** AI models
            - **Full feature set** including CRUD operations

---

## 💡 Usage Examples

!!! example "Integration Examples"
    Complete code examples demonstrating API integration in multiple programming languages with authentication flow.

!!! info "Code Samples"
    === ":material-console: cURL Commands"
        
        !!! tip "Command Line Examples"
            Complete workflow using cURL for testing and automation:
        
        ```bash
        #!/bin/bash
        
        # Configuration
        BASE_URL="https://arafat2.me/api"
        
        # 1. Get available AI models (no auth required)
        echo "=== Available AI Models ==="
        curl -s "${BASE_URL}/ai/models/" | jq .
        
        # 2. Register new user
        echo -e "\n=== User Registration ==="
        curl -X POST "${BASE_URL}/auth/register/" \
          -H "Content-Type: application/json" \
          -d '{
            "username": "john_doe",
            "email": "john@example.com",
            "password": "SecurePass123!",
            "password2": "SecurePass123!"
          }' | jq .
        
        # 3. Get authentication token
        echo -e "\n=== Authentication ==="
        TOKEN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/token/" \
          -H "Content-Type: application/json" \
          -d '{
            "username": "john_doe",
            "password": "SecurePass123!"
          }')
        
        ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r .access)
        echo "Access Token: ${ACCESS_TOKEN:0:20}..."
        
        # 4. Generate resume with AI
        echo -e "\n=== AI Resume Generation ==="
        RESUME_RESPONSE=$(curl -s -X POST "${BASE_URL}/ai/generate/" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $ACCESS_TOKEN" \
          -d '{
            "model": "Deepseek",
            "user_input": "Software engineer with 5 years experience in Python, Django, React. Expert in cloud deployment.",
            "title": "Senior Developer Resume"
          }')
        
        RESUME_ID=$(echo $RESUME_RESPONSE | jq -r .resume_id)
        echo "Generated Resume ID: $RESUME_ID"
        
        # 5. Create job application
        echo -e "\n=== Job Application Creation ==="
        curl -s -X POST "${BASE_URL}/job-applications/" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $ACCESS_TOKEN" \
          -d "{
            \"job_title\": \"Senior Software Engineer\",
            \"company_name\": \"TechCorp Inc.\",
            \"resume_used\": $RESUME_ID,
            \"status\": \"Applied\",
            \"date_applied\": \"$(date +%Y-%m-%d)\"
          }" | jq .
        
        # 6. List all user resumes
        echo -e "\n=== User Resumes ==="
        curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
          "${BASE_URL}/resumes/" | jq .
        ```
    === ":material-language-python: Python Integration"
        
        !!! success "Complete Python Example"
            Full workflow from registration to resume generation and job tracking:
        
        ```python
        import requests
        
        # API Configuration
        BASE_URL = "https://arafat2.me/api/"
        
        class ResuMateClient:
            def __init__(self):
                self.base_url = BASE_URL
                self.token = None
                self.headers = {"Content-Type": "application/json"}
        
            def register(self, username, email, password):
                """Register a new user account"""
                data = {
                    "username": username,
                    "email": email,
                    "password": password,
                    "password2": password
                }
                response = requests.post(f"{self.base_url}auth/register/", json=data)
                return response.json()
        
            def login(self, username, password):
                """Authenticate and get tokens"""
                data = {"username": username, "password": password}
                response = requests.post(f"{self.base_url}auth/token/", json=data)
                tokens = response.json()
                self.token = tokens["access"]
                self.headers["Authorization"] = f"Bearer {self.token}"
                return tokens
        
            def generate_resume(self, model, user_input, title):
                """Generate AI-powered resume"""
                data = {
                    "model": model,
                    "user_input": user_input,
                    "title": title
                }
                response = requests.post(
                    f"{self.base_url}ai/generate/", 
                    json=data, 
                    headers=self.headers
                )
                return response.json()
        
            def create_job_application(self, job_data):
                """Create new job application"""
                response = requests.post(
                    f"{self.base_url}job-applications/", 
                    json=job_data, 
                    headers=self.headers
                )
                return response.json()
        
        # Usage Example
        client = ResuMateClient()
        
        # 1. Register and login
        client.register("john_doe", "john@example.com", "SecurePass123!")
        client.login("john_doe", "SecurePass123!")
        
        # 2. Generate resume
        resume = client.generate_resume(
            model="Deepseek",
            user_input="Software engineer with 5 years experience...",
            title="Senior Developer Resume"
        )
        
        # 3. Create job application
        job_app = client.create_job_application({
            "job_title": "Senior Software Engineer",
            "company_name": "TechCorp Inc.",
            "resume_used": resume["resume_id"],
            "status": "Applied",
            "date_applied": "2023-01-15"
        })
        ```

    === ":material-language-javascript: JavaScript/Frontend"
        
        !!! info "Modern JavaScript Class"
            ES6+ implementation with async/await and error handling:
        
        ```javascript
        class ResuMateAPI {
            constructor(baseURL = 'https://arafat2.me/api/') {
                this.baseURL = baseURL;
                this.token = localStorage.getItem('access_token');
            }
        
            async makeRequest(endpoint, options = {}) {
                const url = `${this.baseURL}${endpoint}`;
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    ...options
                };
        
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`;
                }
        
                try {
                    const response = await fetch(url, config);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return await response.json();
                } catch (error) {
                    console.error('API Request failed:', error);
                    throw error;
                }
            }
        
            async register(username, email, password) {
                return this.makeRequest('auth/register/', {
                    method: 'POST',
                    body: JSON.stringify({
                        username, email, 
                        password, password2: password
                    })
                });
            }
        
            async login(username, password) {
                const tokens = await this.makeRequest('auth/token/', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });
                
                this.token = tokens.access;
                localStorage.setItem('access_token', this.token);
                return tokens;
            }
        
            async generateResume(model, userInput, title) {
                return this.makeRequest('ai/generate/', {
                    method: 'POST',
                    body: JSON.stringify({
                        model, user_input: userInput, title
                    })
                });
            }
        
            async getResumes() {
                return this.makeRequest('resumes/');
            }
        
            async createJobApplication(jobData) {
                return this.makeRequest('job-applications/', {
                    method: 'POST',
                    body: JSON.stringify(jobData)
                });
            }
        }
        
        // Usage Example
        const api = new ResuMateAPI();
        
        async function example() {
            try {
                await api.login('john_doe', 'SecurePass123!');
                const resume = await api.generateResume(
                    'Deepseek', 
                    'Software engineer...', 
                    'My Resume'
                );
                console.log('Resume generated:', resume);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        ```
---

## 🛠️ Development Notes

!!! note "Technical Architecture"
    Modern, enterprise-grade technology stack designed for scalability, security, and maintainability.

!!! example "Technology Stack"
    === ":material-server: Backend Technologies"
        
        !!! info "Core Framework"
            **Django 5.0.14** - Robust web framework with built-in admin, ORM, and security features
        
        | Component | Technology | Purpose |
        |:----------|:-----------|:--------|
        | **🐍 Web Framework** | :material-language-python:{ style="color: #3776ab" } Django 5.0.14 | REST API development & admin interface |
        | **🗄️ Database** | :material-database:{ style="color: #336791" } PostgreSQL | Primary data storage with ACID compliance |
        | **🔗 Database Driver** | :material-cable-data:{ style="color: #336791" } psycopg2-binary | High-performance PostgreSQL adapter |
        | **🔐 Authentication** | :material-key:{ style="color: #ff9800" } JWT (Simple JWT) | Stateless token-based authentication |
        | **🤖 AI Integration** | :material-brain:{ style="color: #4285f4" } Google Gemini API | Advanced AI-powered content generation |
        | **🔀 AI Router** | :material-router:{ style="color: #10a37f" } OpenAI SDK | Multi-provider AI model support |
        | **🚀 WSGI Server** | :material-rocket-launch:{ style="color: #e74c3c" } Gunicorn | Production-ready HTTP server |
        | **📁 Static Files** | :material-file-multiple:{ style="color: #795548" } WhiteNoise | Efficient static asset serving |

    === ":material-cog: Environment Configuration"
        
        !!! warning "Required Environment Variables"
            Secure configuration management using environment variables:
        
        ```bash
        # Database Configuration
        DB_NAME=resumate_db              # PostgreSQL database name
        DB_USER=postgres                 # Database username
        DB_PASSWORD=your_password        # Database password
        DB_HOST=localhost                # Database host
        DB_PORT=5432                     # Database port
        
        # Django Configuration
        SECRET_KEY=your_secret_key       # Django secret key (50+ chars)
        DEBUG=False                      # Production: False, Development: True
        ALLOWED_HOSTS=arafat2.me,localhost # Comma-separated allowed hosts
        
        # AI Service Configuration
        GOOGLE_GEMINI_API_KEY=your_gemini_key    # Google Gemini API key
        OPENROUTER_API_KEY=your_openrouter_key   # OpenRouter API key
        
        # Admin User (Auto-created)
        DJANGO_SUPERUSER_USERNAME=admin          # Admin username
        DJANGO_SUPERUSER_EMAIL=admin@example.com # Admin email
        DJANGO_SUPERUSER_PASSWORD=admin_password # Admin password
        ```

    === ":material-console-line: Setup & Deployment"
        
        !!! tip "Development Setup"
            Complete setup process for local development:
        
        ```bash
        # 1. Database Setup
        python manage.py makemigrations     # Create migration files
        python manage.py migrate            # Apply database migrations
        python manage.py create_superuser_if_not_exists  # Create admin user
        
        # 2. Development Server
        python manage.py runserver 0.0.0.0:8000  # Start development server
        
        # 3. Production Deployment
        python manage.py collectstatic --noinput  # Collect static files
        gunicorn ResuMate_backend.wsgi:application # Start production server
        
        # 4. Database Management
        python manage.py dbshell            # Access database shell
        python manage.py shell              # Django shell access
        
        # 5. Maintenance Commands
        python manage.py check              # System check
        python manage.py test               # Run test suite
        ```
        
        !!! success "Production Deployment"
            Recommended production setup:
        
        ```bash
        # Docker Deployment (Recommended)
        docker-compose up -d                # Start all services
        
        # Manual Deployment
        pip install -r requirements.txt    # Install dependencies
        gunicorn --bind 0.0.0.0:8000 ResuMate_backend.wsgi:application
        ```

    === ":material-api: API Features"
        
        !!! abstract "Key Capabilities"
            Comprehensive API features and integrations:
        
        - **🔐 JWT Authentication** - :material-shield-check:{ style="color: #4caf50" } Secure stateless authentication
        - **📄 Resume CRUD** - :material-file-document-multiple:{ style="color: #2196f3" } Complete resume management system
        - **🤖 Multi-AI Support** - :material-brain:{ style="color: #9c27b0" } Google Gemini & OpenRouter integration
        - **📊 Job Tracking** - :material-clipboard-list:{ style="color: #ff9800" } Application status management
        - **🗄️ PostgreSQL** - :material-database:{ style="color: #336791" } Robust data persistence
        - **📖 Browsable API** - :material-api:{ style="color: #607d8b" } Django REST Framework interface
        - **🛡️ Admin Panel** - :material-shield-crown:{ style="color: #e91e63" } Django admin for data management
        - **🚀 Production Ready** - :material-rocket-launch:{ style="color: #4caf50" } Gunicorn + WhiteNoise deployment

---

## 📞 Support & Contact

!!! tip "Get Help & Connect"
    Multiple channels available for support, feedback, collaboration, and API assistance.

!!! example "Contact & Resources"
    === ":material-account-circle: Developer Information"
        
        !!! info "Arafat Hossain"
            **Full-Stack Developer & API Architect**
            
            Experienced in building scalable web applications, REST APIs, and AI-powered solutions.
        
        | Contact Method | Details | Purpose |
        |:---------------|:--------|:--------|
        | **📧 Email** | :material-email:{ style="color: #d44638" } [arafat6462@gmail.com](mailto:arafat6462@gmail.com) | Direct communication & support |
        | **🐙 GitHub** | :material-github:{ style="color: #24292e" } [github.com/Arafat6462](https://github.com/Arafat6462) | Source code & project portfolio |
        | **🌐 Portfolio** | :material-web:{ style="color: #2196f3" } [arafat2.me](https://arafat2.me) | Professional portfolio & projects |

    === ":material-link: API Resources"
        
        !!! success "Live Endpoints"
            Test and explore the API directly:
        
        | Resource | Description | Access Level |
        |:---------|:------------|:-------------|
        | **🧠 AI Models** | [/api/ai/models/](https://arafat2.me/api/ai/models/) ⚡ | :material-shield-off: Public + Cached |
        | **👁️ Examples** | [/api/example-job-applications/](https://arafat2.me/api/example-job-applications/) ⚡ | :material-shield-off: Public + Cached |
        | **🔌 API Root** | [/api/](https://arafat2.me/api/) | :material-shield-off: Browsable |
        | **🛡️ Admin** | [/admin/](https://arafat2.me/admin/) | :material-shield-check: Admin Only |
        | **📚 Swagger** | [/api/docs/](https://arafat2.me/api/docs/) | :material-shield-off: Interactive |
        
        !!! tip "⚡ Redis Cached Endpoints"
            Endpoints marked with ⚡ use Redis caching for enhanced performance:
            
            - **Response Time:** 10-20ms for cache hits
            - **Cache Duration:** 1 hour for optimal freshness
            - **Status Indication:** Response includes cache status information

    === ":material-help-circle: Support Options"
        
        !!! question "Need Help?"
            Choose the best support channel for your needs:
        
        - **� Bug Reports** - GitHub Issues or direct email
        - **💡 Feature Requests** - Email with detailed requirements
        - **📖 API Questions** - Check documentation or contact directly
        - **🤝 Collaboration** - Professional inquiries welcome
        - **📱 Integration Help** - Code examples and guidance available

---

## 🚀 Quick Start Guide

!!! success "Ready to Build?"
    Get up and running with ResuMate API in minutes with our step-by-step guide.

!!! example "Getting Started"
    === ":material-rocket-launch: Immediate Testing"
        
        !!! tip "No Authentication Required"
            Try these endpoints right now in your browser:
        
        1. **🧠 [Available AI Models](https://arafat2.me/api/ai/models/)** - :material-brain:{ style="color: #9c27b0" } Test AI capabilities
        2. **📋 [Example Applications](https://arafat2.me/api/example-job-applications/)** - :material-clipboard-list:{ style="color: #ff9800" } Sample data
        3. **🔌 [API Root Explorer](https://arafat2.me/api/)** - :material-api:{ style="color: #607d8b" } Browse all endpoints

    === ":material-account-plus: Account Setup"
        
        !!! info "Create Your Account"
            **Steps to get authenticated access:**
        
        1. **Register** - :material-account-plus:{ style="color: #4caf50" } Create account via `/api/auth/register/`
        2. **Login** - :material-login:{ style="color: #2196f3" } Get tokens via `/api/auth/token/`
        3. **Generate** - :material-auto-fix:{ style="color: #9c27b0" } Create AI-powered resume
        4. **Track** - :material-clipboard-list:{ style="color: #ff9800" } Manage job applications

    === ":material-code-braces: Integration"
        
        !!! abstract "Development Integration"
            **Choose your preferred method:**
        
        - **Python** - :material-language-python:{ style="color: #3776ab" } Use requests library ([see example](#usage-examples))
        - **JavaScript** - :material-language-javascript:{ style="color: #f7df1e" } Fetch API or axios ([see example](#usage-examples))
        - **cURL** - :material-console:{ style="color: #4caf50" } Command line testing ([see example](#usage-examples))
        - **Other** - :material-code-braces:{ style="color: #607d8b" } Standard HTTP REST API calls

---

!!! abstract "API Status & Information"
    :material-check-circle:{ style="color: #4caf50" } **Status:** Live & Stable  
    :material-update:{ style="color: #2196f3" } **Last Updated:** July 2025  
    :material-api:{ style="color: #9c27b0" } **Version:** 1.0  
    :material-shield-check:{ style="color: #4caf50" } **Security:** JWT Authentication  
    :material-database:{ style="color: #336791" } **Database:** PostgreSQL  
    :material-brain:{ style="color: #9c27b0" } **AI:** Multi-model Support
