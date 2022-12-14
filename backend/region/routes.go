package region

import (
	"fmt"
	"github.com/ferdoran/go-sro/agent-server/navmeshv2"
	"github.com/gocarina/gocsv"
	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
	"net/http"
	"os"
	"strconv"
)

type ContinentRecord struct {
	Name     string `csv:"ContinentName"`
	RegionID int16  `csv:"wRegionId"`
}

var (
	continents = make(map[string][]int16)
	regionData map[int16]navmeshv2.RtNavmeshTerrain
)

func loadContinents() {
	f, err := os.OpenFile("region/continents.csv", os.O_RDONLY, os.ModePerm)
	if err != nil {
		logrus.Panic(err)
	}
	var continentRecords []*ContinentRecord
	if err = gocsv.UnmarshalFile(f, &continentRecords); err != nil {
		logrus.Panic(err)
	}

	for _, cr := range continentRecords {
		continents[cr.Name] = append(continents[cr.Name], cr.RegionID)
	}

}

func RegisterRoutes(apiGroup *echo.Group, loader *navmeshv2.Loader) {
	regionData = loader.RegionData
	loadContinents()

	regionsGroup := apiGroup.Group("/regions")
	regionsGroup.GET("", getRegions)
	regionsGroup.GET("/:id", getRegionDetails)

	continentsGroup := apiGroup.Group("/continents")
	continentsGroup.GET("", getContinents)
	continentsGroup.GET("/:continent", getRegionDetailsForContinent)
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

	continent := c.QueryParam("continent")
	if continent == "" {
		for _, v := range regionData {
			regions = append(regions, v.Region)
		}
		return c.JSON(http.StatusOK, &regions)
	}

	if continentRegions, exist := continents[continent]; exist {
		for _, r := range continentRegions {
			if data, dataExists := regionData[r]; dataExists {
				regions = append(regions, data.Region)
			}
		}
	}

	return c.JSON(http.StatusOK, &regions)
}

func getContinents(c echo.Context) error {
	var cs []string

	for c := range continents {
		regions := continents[c]
		regionDataExists := false
		for _, r := range regions {
			if _, exists := regionData[r]; exists {
				regionDataExists = true
				break
			}
		}

		if len(continents[c]) > 0 && regionDataExists {
			cs = append(cs, c)
		}
	}

	return c.JSON(http.StatusOK, &cs)
}

func getRegionDetailsForContinent(c echo.Context) error {
	continent := c.Param("continent")

	regions := make([]TerrainDetails, 0)
	if continentRegions, exist := continents[continent]; exist {
		for _, r := range continentRegions {
			if data, dataExists := regionData[r]; dataExists {
				mappedData := MapTerrainDetails(data)
				regions = append(regions, mappedData)
			}
		}
	}

	return c.JSON(http.StatusOK, regions)
}
