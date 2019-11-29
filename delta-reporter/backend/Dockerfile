FROM golang:1.13.4-alpine
RUN apk add bash ca-certificates git gcc g++ libc-dev
RUN mkdir /app
ADD ./ /app
WORKDIR /app
RUN go mod download
RUN go get github.com/githubnemo/CompileDaemon

ENTRYPOINT CompileDaemon --build="go build main.go" --command=./main
