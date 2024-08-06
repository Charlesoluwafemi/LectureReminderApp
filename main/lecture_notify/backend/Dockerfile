# Use the official Python image as a base
FROM python:3.11

# Set the working directory
WORKDIR /app


# Install the dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Run database migrations and collect static files
RUN python manage.py migrate
RUN python manage.py collectstatic --noinput

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "LECTURENOTIFY.wsgi:application"]
