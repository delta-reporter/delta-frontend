FROM python:3.6-alpine as base

FROM base as builder 
RUN mkdir /install
RUN apk update && apk add postgresql-dev gcc musl-dev
WORKDIR /install
COPY requirements.txt /requirements.txt
RUN pip install --install-option="--prefix=/install" -r /requirements.txt  

FROM base
COPY --from=builder /install /usr/local
ADD . /app
WORKDIR /app
EXPOSE 5000
CMD ["python3", "app.py"]
