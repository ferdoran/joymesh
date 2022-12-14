package main

import (
	middleware2 "backend/middleware"
	"backend/region"
	"github.com/ferdoran/go-sro/agent-server/navmeshv2"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sirupsen/logrus"
	"net/http"
)

var loader *navmeshv2.Loader

func main() {
	loadNavmeshes()
	startEcho()
}

func loadNavmeshes() {
	logrus.Infoln("loading navmeshes")

	loader = navmeshv2.NewLoader("data/Data.pk2")
	loader.LoadNavMeshInfos()
	progressChan := make(chan int, loader.MapProjectInfo.ActiveRegionsCount)
	loader.LoadTerrainMeshes(progressChan)
	println()
	logrus.Infoln("finished loading navmeshes")
}

func startEcho() {
	e := echo.New()
	e.Use(middleware.CORS())
	e.Use(middleware2.BrotliWithConfig(middleware2.BrotliConfig{Level: 5}))
	e.GET("/health", healthHandler)
	api := e.Group("/api")

	region.RegisterRoutes(api, loader)

	e.Logger.Fatal(e.Start(":8080"))
}

func healthHandler(c echo.Context) error {
	return c.String(http.StatusOK, `{"status":"UP"}`)
}
