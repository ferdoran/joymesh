package region

import (
	"fmt"
	"github.com/ferdoran/go-sro/agent-server/navmeshv2"
	"github.com/labstack/echo/v4"
	"net/http"
	"strconv"
)

var regionData map[int16]navmeshv2.RtNavmeshTerrain

func RegisterRoutes(apiGroup *echo.Group, loader *navmeshv2.Loader) {
	regionData = loader.RegionData

	regionsGroup := apiGroup.Group("/regions")
	regionsGroup.GET("", getRegions)
	regionsGroup.GET("/:id", getRegionDetails)
}

func getRegionDetails(c echo.Context) error {
	regionIdString := c.Param("id")
	regionId, err := strconv.Atoi(regionIdString)
	if err != nil {
		return c.String(http.StatusBadRequest, "invalid region id")
	}

	if terrain, exists := regionData[int16(regionId)]; exists {
		return c.JSON(http.StatusOK, MapTerrainDetails(terrain))
	}

	return c.String(http.StatusNotFound, fmt.Sprintf("region %s not found", regionIdString))
}

func getRegions(c echo.Context) error {
	regions := make([]navmeshv2.Region, 0)
	for _, v := range regionData {
		regions = append(regions, v.Region)
	}

	return c.JSON(http.StatusOK, &regions)
}
