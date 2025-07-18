FROM python:3.11-slim

WORKDIR /docs

# Install MkDocs and dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy documentation files
COPY . .

# Expose port for development server
EXPOSE 8000

# Command to run MkDocs development server
CMD ["mkdocs", "serve", "--dev-addr=0.0.0.0:8000"]
