FROM python:3.10-bullseye

RUN python -m pip install --upgrade pip

WORKDIR /app

COPY accounts accounts
COPY games games
COPY co_op_catalog co_op_catalog
COPY common common
COPY manage.py manage.py
COPY requirements.txt ./

RUN pip install -r requirements.txt

CMD gunicorn --bind 0.0.0.0:8000 co_op_catalog.wsgi
