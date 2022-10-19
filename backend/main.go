package main

import (
	"github.com/ferdoran/go-sro/agent-server/navmeshv2"
	"github.com/ferdoran/joymesh/backend/region"
	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
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
	api := e.Group("/api")

	region.RegisterRoutes(api, loader)

	e.Logger.Fatal(e.Start(":8080"))
}
