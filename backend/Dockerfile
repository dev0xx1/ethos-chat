FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main.py .

# Railway provides PORT env variable
ENV PORT=8080

# Run the application using shell to expand $PORT
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
