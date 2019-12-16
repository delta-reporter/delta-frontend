FROM python:3.6-alpine
RUN apk add gcc musl-dev

WORKDIR /app
ADD requirements.txt /app/
RUN pip3 install -r requirements.txt

ADD . /app

EXPOSE 5000
CMD ["python3", "app.py"]
