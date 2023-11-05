FROM golang:1.21.3 as base
WORKDIR /app

FROM base as builder
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server ./cmd/server 

FROM base as runner
COPY --from=builder /app/server .
EXPOSE 8000
CMD ["./server"]