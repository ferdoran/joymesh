package main

import (
	"github.com/ferdoran/go-sro/agent-server/navmeshv2"
	"github.com/labstack/echo/v4"
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
	e.GET("/api/regions", getRegions)
	e.Logger.Fatal(e.Start(":8080"))
}

func getRegions(c echo.Context) error {
	regions := make([]navmeshv2.Region, 0)
	for _, v := range loader.RegionData {
		regions = append(regions, v.Region)
	}

	return c.JSON(http.StatusOK, &regions)
}
