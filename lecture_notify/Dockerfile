# Dockerfile
FROM python:3.10.12

WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt


# Install PostgreSQL client tools
RUN apt-get update && apt-get install -y postgresql-client

COPY . /app/

COPY wait-for-it.sh .

RUN chmod +x wait-for-it.sh



CMD ["sh", "-c", "./wait-for-it.sh db -- python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
