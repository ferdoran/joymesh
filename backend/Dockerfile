FROM golang:1.19-bullseye as build

WORKDIR /go/src/app
ADD . /go/src/app

RUN go get -d -v ./...
RUN go vet -v

RUN CGO_ENABLED=0 go build -o /go/bin/app

FROM gcr.io/distroless/static
COPY --from=build /go/bin/app /
COPY region/continents.csv /region/continents.csv
CMD ["/app"]