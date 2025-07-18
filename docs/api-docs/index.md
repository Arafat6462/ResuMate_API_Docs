# 🔌 ResuMate API Documentation

!!! info "API Configuration"
    **Base URL**
    ```
    https://arafat2.me/api/
    ```
    **Content Type:** `application/json` | **Authentication:** JWT Tokens

---

## 🎯 Overview

ResuMate API provides **user management**, **resume CRUD operations**, **AI-powered resume generation** (Google Gemini, OpenRouter), **job application tracking**, and **PostgreSQL persistence** with both authenticated and anonymous access.

**Key Features:** :material-shield-check:{ style="color: #666" } JWT Authentication • :material-file-document-multiple:{ style="color: #666" } Full Resume Management • :material-brain:{ style="color: #666" } Multiple AI Models • :material-briefcase:{ style="color: #666" } Job Tracking • :material-eye:{ style="color: #666" } Example Data

!!! tip "Live Testing"
    Try the API instantly: [List AI Models](https://arafat2.me/api/ai/models/) • [Example Applications](https://arafat2.me/api/example-job-applications/) • [API Root](https://arafat2.me/api/)

---

## 🔐 Authentication

!!! warning "Authentication Required"
    Most endpoints require JWT authentication. Anonymous access is limited to certain AI models and example data.

### JWT Token Authentication

The API uses JSON Web Tokens (JWT) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

!!! example ""
    === ":material-account-plus: **Register**"
        
        !!! success "POST `/api/auth/register/`"
        
        Create a new user account.
        
        **Request Body:**
        ```json
        {
          "username": "string",
          "email": "string",
          "password": "string",
          "password2": "string"
        }
        ```
        
        **Response (201 Created):**
        ```json
        {
          "id": 1,
          "username": "john_doe",
          "email": "john@example.com"
        }
        ```

    === ":material-login: **Login**"
        
        !!! info "POST `/api/auth/token/`"
        
        Obtain access and refresh tokens.
        
        **Request Body:**
        ```json
        {
          "username": "string",
          "password": "string"
        }
        ```
        
        **Response (200 OK):**
        ```json
        {
          "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
          "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
        }
        ```

    === ":material-refresh: **Refresh**"
        
        !!! tip "POST `/api/auth/token/refresh/`"
        
        Refresh your access token.
        
        **Request Body:**
        ```json
        {
          "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
        }
        ```

---

## 🚀 API Endpoints

### 📄 Resume Management

!!! abstract "Resume Operations"
    Manage your resume documents with full CRUD operations.

!!! example ""
    === ":material-format-list-bulleted: **List Resumes**"
        
        !!! info "GET `/api/resumes/`"
            **Authentication:** :material-shield-check:{ .auth-required } Required  
            **Description:** Retrieve all resumes for the authenticated user
        
        **Sample Request:**
        ```bash
        curl -H "Authorization: Bearer <token>" https://arafat2.me/api/resumes/
        ```
        
        **Response (200 OK):**
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

    === ":material-plus: **Create Resume**"
        
        !!! success "POST `/api/resumes/`"
            **Authentication:** :material-shield-check:{ .auth-required } Required
        
        **Request Body:**
        ```json
        {
          "title": "Software Engineer Resume",
          "content": "# John Doe\n\n## Experience\n..."
        }
        ```

    === ":material-file-document: **Get Resume**"
        
        !!! info "GET `/api/resumes/{id}/`"
            **Authentication:** :material-shield-check:{ .auth-required } Required

    === ":material-pencil: **Update Resume**"
        
        !!! warning "PUT/PATCH `/api/resumes/{id}/`"
            **Authentication:** :material-shield-check:{ .auth-required } Required

    === ":material-delete: **Delete Resume**"
        
        !!! danger "DELETE `/api/resumes/{id}/`"
            **Authentication:** :material-shield-check:{ .auth-required } Required

### 🤖 AI-Powered Resume Generation

!!! tip "AI Features"
    Generate professional resumes using advanced AI models with different capabilities and access levels.

!!! example ""
    === ":material-brain: **List AI Models**"
        
        !!! success "GET `/api/ai/models/`"
            **Authentication:** :material-shield-off:{ .auth-optional } Not Required
        
        **Sample Request:**
        ```bash
        curl https://arafat2.me/api/ai/models/
        ```
        
        **Response (200 OK):**
        ```json
        [
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
        ```

    === ":material-auto-fix: **Generate Resume**"
        
        !!! info "POST `/api/ai/generate/`"
            **Authentication:** :material-shield-half-full:{ .auth-conditional } Optional (depends on selected model)
        
        **Request Body:**
        ```json
        {
          "model": "Deepseek",
          "user_input": "Software engineer with 5 years experience in Python, Django, React. Worked at tech startups building scalable web applications. Expert in cloud deployment and database optimization.",
          "title": "Senior Software Engineer Resume"
        }
        ```
        
        **Response (201 Created):**
        ```json
        {
          "resume_id": 15,
          "content": "# John Doe\n\n## Professional Summary\nExperienced Software Engineer with 5+ years of expertise in Python, Django, and React...\n\n## Technical Skills\n- **Backend:** Python, Django, RESTful APIs\n- **Frontend:** React, JavaScript, HTML5, CSS3\n..."
        }
        ```

### 📊 Job Application Tracking

!!! note "Job Management"
    Track your job applications with comprehensive status management and soft delete functionality.

!!! example ""
    === ":material-clipboard-list: **List Applications**"
        
        !!! info "GET `/api/job-applications/`"
            **Authentication:** :material-shield-check:{ .auth-required } Required
        
        **Sample Request:**
        ```bash
        curl -H "Authorization: Bearer <token>" https://arafat2.me/api/job-applications/
        ```
        
        **Response (200 OK):**
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

    === ":material-plus: **Create Application**"
        
        !!! success "POST `/api/job-applications/`"
            **Authentication:** :material-shield-check:{ .auth-required } Required
        
        **Request Body:**
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

    === ":material-pencil: **Update Application**"
        
        !!! warning "PUT/PATCH `/api/job-applications/{id}/`"
            **Authentication:** :material-shield-check:{ .auth-required } Required

    === ":material-delete: **Delete Application**"
        
        !!! danger "DELETE `/api/job-applications/{id}/`"
            **Authentication:** :material-shield-check:{ .auth-required } Required  
            **Note:** This performs a soft delete (sets `is_deleted=true`)

    === ":material-eye: **Example Applications**"
        
        !!! tip "GET `/api/example-job-applications/`"
            **Authentication:** :material-shield-off:{ .auth-optional } Not Required  
            **Description:** Returns up to 5 sample job applications for demo purposes

---

## 📊 Data Models

!!! abstract "Database Schema"
    Complete data model specifications for all API resources.

=== "User Model"
    
    ```json
    {
      "id": "integer",
      "username": "string (unique)",
      "email": "string",
      "is_active": "boolean",
      "date_joined": "datetime"
    }
    ```

=== "Resume Model"
    
    ```json
    {
      "id": "integer",
      "user": "foreign_key (User)",
      "title": "string (max_length: 255)",
      "content": "text",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

=== "AIModel Configuration"
    
    ```json
    {
      "display_name": "string (unique)",
      "model_name": "string",
      "api_provider": "choice (google_gemini, open_router)",
      "api_key_name": "string",
      "is_active": "boolean",
      "login_required": "boolean",
      "daily_limit": "positive_integer",
      "response_time_info": "string",
      "description": "text"
    }
    ```

=== "JobApplication Model"
    
    ```json
    {
      "id": "integer",
      "user": "foreign_key (User)",
      "job_title": "string",
      "company_name": "string",
      "original_job_description": "text",
      "resume_used": "foreign_key (Resume, nullable)",
      "date_applied": "date",
      "status": "choice (Applied, Interviewing, Offer, Rejected)",
      "notes": "text",
      "is_deleted": "boolean",
      "is_example": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

---

## ⚠️ Error Handling

!!! failure "Error Response Format"
    Standardized error responses across all endpoints.

### Standard HTTP Status Codes

| Status Code | Description | Status |
|:-----------:|-------------|--------|
| :material-check-circle:{ .status-success } **200** | OK - Request successful | :material-circle:{ .color-success } Success |
| :material-plus-circle:{ .status-success } **201** | Created - Resource created successfully | :material-circle:{ .color-success } Success |
| :material-alert-circle:{ .status-warning } **400** | Bad Request - Invalid request data | :material-circle:{ .color-warning } Warning |
| :material-lock:{ .status-error } **401** | Unauthorized - Authentication required | :material-circle:{ .color-error } Error |
| :material-cancel:{ .status-error } **403** | Forbidden - Insufficient permissions | :material-circle:{ .color-error } Error |
| :material-help-circle:{ .status-info } **404** | Not Found - Resource not found | :material-circle:{ .color-info } Info |
| :material-server-network:{ .status-error } **503** | Service Unavailable - AI service error | :material-circle:{ .color-error } Error |

### Error Response Format
```json
{
  "error": "Error message description",
  "field_errors": {
    "field_name": ["Field-specific error message"]
  }
}
```

### Common Error Examples

=== "Authentication Error"
    
    !!! danger "401 Unauthorized"
    ```json
    {
      "detail": "Given token not valid for any token type"
    }
    ```

=== "Validation Error"
    
    !!! warning "400 Bad Request"
    ```json
    {
      "password": ["Password fields didn't match."],
      "email": ["This field is required."]
    }
    ```

=== "AI Service Error"
    
    !!! failure "503 Service Unavailable"
    ```json
    {
      "error": "An error occurred while communicating with the AI service."
    }
    ```

---

## 🔒 Rate Limiting

!!! info "Rate Limits"
    API usage limits to ensure fair access and service stability.

- :material-robot:{ style="color: #666" } **AI Models**: Some models may have daily limits per user (configurable per model)
- :material-account-off:{ style="color: #666" } **Anonymous Users**: Limited access to certain AI models
- :material-account-check:{ style="color: #666" } **Authenticated Users**: Higher rate limits and access to premium models

---

## 💡 Usage Examples

!!! example "Code Examples"
    Complete integration examples in multiple programming languages.

=== "Python Example"
    
    ```python
    import requests
    
    # 1. Register a new user
    register_data = {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "SecurePass123!",
        "password2": "SecurePass123!"
    }
    response = requests.post("https://arafat2.me/api/auth/register/", json=register_data)
    
    # 2. Get authentication token
    login_data = {
        "username": "john_doe",
        "password": "SecurePass123!"
    }
    response = requests.post("https://arafat2.me/api/auth/token/", json=login_data)
    tokens = response.json()
    access_token = tokens["access"]
    
    # 3. Set up headers for authenticated requests
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # 4. Generate a resume using AI
    ai_data = {
        "model": "Deepseek",
        "user_input": "Software engineer with 5 years experience...",
        "title": "Senior Developer Resume"
    }
    response = requests.post("https://arafat2.me/api/ai/generate/", 
                            json=ai_data, headers=headers)
    resume_data = response.json()
    
    # 5. Create a job application
    job_data = {
        "job_title": "Senior Software Engineer",
        "company_name": "TechCorp Inc.",
        "resume_used": resume_data["resume_id"],
        "status": "Applied",
        "date_applied": "2023-01-15"
    }
    response = requests.post("https://arafat2.me/api/job-applications/", 
                            json=job_data, headers=headers)
    
    # 6. List all your resumes
    response = requests.get("https://arafat2.me/api/resumes/", headers=headers)
    resumes = response.json()
    ```

=== "JavaScript/Frontend"
    
    ```javascript
    // Authentication and API calls
    class ResuMateAPI {
        constructor(baseURL = 'https://arafat2.me/api/') {
            this.baseURL = baseURL;
            this.token = localStorage.getItem('access_token');
        }
    
        async login(username, password) {
            const response = await fetch(`${this.baseURL}auth/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                const tokens = await response.json();
                this.token = tokens.access;
                localStorage.setItem('access_token', this.token);
                return tokens;
            }
            throw new Error('Login failed');
        }
    
        async generateResume(model, userInput, title) {
            const response = await fetch(`${this.baseURL}ai/generate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ model, user_input: userInput, title })
            });
            
            return response.json();
        }
    
        async getResumes() {
            const response = await fetch(`${this.baseURL}resumes/`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            return response.json();
        }
    }
    
    // Usage
    const api = new ResuMateAPI();
    await api.login('john_doe', 'SecurePass123!');
    const resume = await api.generateResume('Deepseek', 'Software engineer...', 'My Resume');
    ```

=== "cURL Examples"
    
    ```bash
    # Get available AI models (no auth required)
    curl https://arafat2.me/api/ai/models/
    
    # Register new user
    curl -X POST https://arafat2.me/api/auth/register/ \
      -H "Content-Type: application/json" \
      -d '{
        "username": "john_doe",
        "email": "john@example.com",
        "password": "SecurePass123!",
        "password2": "SecurePass123!"
      }'
    
    # Get authentication token
    curl -X POST https://arafat2.me/api/auth/token/ \
      -H "Content-Type: application/json" \
      -d '{
        "username": "john_doe",
        "password": "SecurePass123!"
      }'
    
    # Generate resume with AI
    curl -X POST https://arafat2.me/api/ai/generate/ \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer YOUR_TOKEN_HERE" \
      -d '{
        "model": "Deepseek",
        "user_input": "Software engineer with 5 years experience...",
        "title": "Senior Developer Resume"
      }'
    
    # List user resumes
    curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
      https://arafat2.me/api/resumes/
    ```

---

## 🛠️ Development Notes

!!! note "Technical Stack"
    Modern, scalable technology stack with enterprise-grade components.

=== "Backend Technologies"
    
    - :material-language-python:{ style="color: #666" } **Backend**: Django 5.0.14, Django REST Framework
    - :material-database:{ style="color: #666" } **Database**: PostgreSQL with psycopg2-binary  
    - :material-key:{ style="color: #666" } **Authentication**: djangorestframework-simplejwt
    - :material-robot:{ style="color: #666" } **AI Integration**: Google Genai, OpenAI SDK
    - :material-server:{ style="color: #666" } **Deployment**: Gunicorn, WhiteNoise for static files

=== "Environment Variables"
    
    ```bash
    # Database Configuration
    DB_NAME=resumate_db
    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_HOST=localhost
    DB_PORT=5432
    
    # Django Configuration
    SECRET_KEY=your_secret_key
    DEBUG=False
    ALLOWED_HOSTS=arafat2.me,localhost
    
    # AI Services
    GOOGLE_GEMINI_API_KEY=your_gemini_key
    OPENROUTER_API_KEY=your_openrouter_key
    
    # Admin User
    DJANGO_SUPERUSER_USERNAME=admin
    DJANGO_SUPERUSER_EMAIL=admin@example.com
    DJANGO_SUPERUSER_PASSWORD=admin_password
    ```

=== "Setup Commands"
    
    ```bash
    # Database Migrations
    python manage.py makemigrations
    python manage.py migrate
    python manage.py create_superuser_if_not_exists
    
    # Development Server
    python manage.py runserver
    
    # Production Deployment
    gunicorn ResuMate_backend.wsgi:application
    ```

---

## 📞 Support & Contact

!!! tip "Get Help"
    Multiple channels for support, feedback, and collaboration.

=== "Contact Information"
    
    - :material-account:{ style="color: #666" } **Developer**: Arafat Hossain
    - :material-email:{ style="color: #666" } **Email**: [arafat6462@gmail.com](mailto:arafat6462@gmail.com)
    - :material-github:{ style="color: #666" } **GitHub**: [github.com/Arafat6462](https://github.com/Arafat6462)
    - :material-web:{ style="color: #666" } **Live API**: [arafat2.me/api/](https://arafat2.me/api/)
    - :material-book:{ style="color: #666" } **Documentation**: This documentation site

=== "Quick Links"
    
    - [:material-brain:{ style="color: #666" } Try AI Models](https://arafat2.me/api/ai/models/) - No authentication required
    - [:material-eye:{ style="color: #666" } Example Applications](https://arafat2.me/api/example-job-applications/) - Sample data
    - [:material-shield-crown:{ style="color: #666" } API Admin](https://arafat2.me/admin/) - Admin interface
    - [:material-api:{ style="color: #666" } API Root](https://arafat2.me/api/) - Browsable API interface
    - [:material-book-open:{ style="color: #666" } Swagger/OpenAPI](https://arafat2.me/api/docs/) - Interactive API explorer

---

!!! success "Ready to Get Started?"
    :material-rocket:{ style="color: #666" } Start by exploring the [available AI models](https://arafat2.me/api/ai/models/) or dive into the [authentication flow](#authentication) to begin building with ResuMate API.

    **Quick Start Checklist:**
    
    - [ ] Test [AI Models endpoint](https://arafat2.me/api/ai/models/) (no auth required)
    - [ ] Register a new user account
    - [ ] Generate your first resume with AI
    - [ ] Create and track job applications

---

*This API documentation is automatically generated and kept up-to-date with the latest ResuMate API version.*

!!! abstract "API Status"
    :material-check-circle:{ .color-success } **Live** • :material-update:{ style="color: #666" } Last Updated: January 2025 • :material-api:{ style="color: #666" } Version 1.0
