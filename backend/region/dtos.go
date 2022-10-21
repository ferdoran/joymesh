package region

import (
	"github.com/ferdoran/go-sro/agent-server/navmeshv2"
	"github.com/g3n/engine/math32"
)

type TerrainDetails struct {
	Meta          navmeshv2.Region                 `json:"meta"`
	Tiles         [navmeshv2.TilesTotal]Tile       `json:"tiles"`
	Heights       [navmeshv2.VerticesTotal]float32 `json:"heights"`
	Planes        [navmeshv2.BlocksTotal]Plane     `json:"planes"`
	Cells         []Cell                           `json:"cells"`
	Objects       []ObjectInstance                 `json:"objects"`
	InternalEdges []InternalEdge                   `json:"internalEdges"`
	GlobalEdges   []GlobalEdge                     `json:"globalEdges"`
}

type Tile struct {
	CellID int    `json:"cellId"`
	Flag   uint16 `json:"flag"`
}

type Cell struct {
	ID      int             `json:"id"`
	Min     *math32.Vector2 `json:"min"`
	Max     *math32.Vector2 `json:"max"`
	Objects []int
}

type InternalEdge struct {
	ID        int             `json:"id"`
	Flag      byte            `json:"flag"`
	EventData byte            `json:"eventData"`
	SrcCellID int             `json:"srcCellId"`
	DstCellID int             `json:"dstCellId"`
	SrcDir    byte            `json:"srcDir"`
	DstDir    byte            `json:"dstDir"`
	A         *math32.Vector3 `json:"a"`
	B         *math32.Vector3 `json:"b"`
}

type GlobalEdge struct {
	ID          int             `json:"id"`
	Flag        byte            `json:"flag"`
	EventData   byte            `json:"EventData"`
	SrcCellID   int             `json:"srcCellId"`
	DstCellID   int             `json:"dstCellId"`
	SrcDir      byte            `json:"srcDir"`
	DstDir      byte            `json:"dstDir"`
	SrcRegionID int             `json:"srcRegionId"`
	DstRegionID int             `json:"dstRegionId"`
	A           *math32.Vector3 `json:"a"`
	B           *math32.Vector3 `json:"b"`
}

type ObjectInstance struct {
	ID            int                `json:"id"`
	Position      *math32.Vector3    `json:"position"`
	Scale         *math32.Vector3    `json:"scale"`
	Rotation      *math32.Quaternion `json:"rotation"`
	Cells         []ObjectCell       `json:"cells"`
	InternalEdges []InternalEdge     `json:"internalEdges"`
	GlobalEdges   []GlobalEdge       `json:"globalEdges"`
	LocalToWorld  *math32.Matrix4    `json:"localToWorld"`
	WorldToLocal  *math32.Matrix4    `json:"worldToLocal"`
}

type ObjectCell struct {
	ID   int             `json:"id"`
	Flag int             `json:"flag"`
	A    *math32.Vector3 `json:"a"`
	B    *math32.Vector3 `json:"b"`
	C    *math32.Vector3 `json:"c"`
}

type Plane struct {
	Height  float32 `json:"height"`
	Surface byte    `json:"surface"`
}

func MapTerrainDetails(terrain navmeshv2.RtNavmeshTerrain) TerrainDetails {
	details := TerrainDetails{}
	details.Meta = terrain.Region

	details.Tiles = MapTiles(terrain.TileMap)
	details.Heights = terrain.HeightMap
	details.Planes = MapPlanes(terrain.PlaneMap)
	details.Cells = MapCells(terrain.Cells)
	details.Objects = MapObjects(terrain.Objects)
	details.InternalEdges = MapInternalEdges(terrain.InternalEdges)
	details.GlobalEdges = MapGlobalEdges(terrain.GlobalEdges)

	return details
}

func MapObjects(objects []navmeshv2.RtNavmeshInstObj) []ObjectInstance {
	os := make([]ObjectInstance, 0)

	for _, o := range objects {
		mappedObject := ObjectInstance{
			ID:            int(o.ID),
			Position:      o.Position,
			Rotation:      o.Rotation,
			Scale:         o.Scale,
			Cells:         MapObjectCells(o.Object.Cells),
			InternalEdges: MapInternalEdges(o.Object.InternalEdges),
			GlobalEdges:   MapGlobalEdges(o.Object.GlobalEdges),
			LocalToWorld:  o.LocalToWorld,
			WorldToLocal:  o.WorldToLocal,
		}

		os = append(os, mappedObject)
	}

	return os
}

func MapObjectCells(cells []navmeshv2.RtNavmeshCellTri) []ObjectCell {
	oCells := make([]ObjectCell, 0)

	for _, c := range cells {
		mappedCell := ObjectCell{
			ID:   c.Index,
			Flag: int(c.Flag),
			A:    c.Triangle.A.Clone(),
			B:    c.Triangle.B.Clone(),
			C:    c.Triangle.C.Clone(),
		}

		oCells = append(oCells, mappedCell)
	}

	return oCells
}

func MapGlobalEdges(edges []navmeshv2.RtNavmeshEdgeGlobal) []GlobalEdge {
	gEdges := make([]GlobalEdge, 0)
	for _, e := range edges {
		mappedEdge := GlobalEdge{
			ID:          e.Index,
			Flag:        byte(e.Flag),
			EventData:   e.EventData,
			SrcCellID:   e.SrcCellIndex,
			DstCellID:   e.DstCellIndex,
			SrcDir:      byte(e.SrcDirection),
			DstDir:      byte(e.DstDirection),
			SrcRegionID: e.SrcMeshIndex,
			DstRegionID: e.DstMeshIndex,
			A:           e.Line.A.Clone(),
			B:           e.Line.B.Clone(),
		}

		gEdges = append(gEdges, mappedEdge)
	}

	return gEdges
}

func MapInternalEdges(edges []navmeshv2.RtNavmeshEdgeInternal) []InternalEdge {
	iEdges := make([]InternalEdge, 0)
	for _, e := range edges {
		mappedEdge := InternalEdge{
			ID:        e.Index,
			Flag:      byte(e.Flag),
			EventData: e.EventData,
			SrcCellID: e.SrcCellIndex,
			DstCellID: e.DstCellIndex,
			SrcDir:    byte(e.SrcDirection),
			DstDir:    byte(e.DstDirection),
			A:         e.Line.A.Clone(),
			B:         e.Line.B.Clone(),
		}

		iEdges = append(iEdges, mappedEdge)
	}

	return iEdges
}

func MapPlanes(planeMap [navmeshv2.BlocksTotal]navmeshv2.RtNavmeshPlane) (planes [navmeshv2.BlocksTotal]Plane) {
	for i, p := range planeMap {
		planes[i] = Plane{
			Height:  p.Height,
			Surface: byte(p.SurfaceType),
		}
	}

	return planes
}

func MapCells(cells []navmeshv2.RtNavmeshCellQuad) []Cell {
	c := make([]Cell, 0)
	for _, cell := range cells {
		mappedCell := Cell{
			ID:      cell.Index,
			Min:     cell.Rect.Min,
			Max:     cell.Rect.Max,
			Objects: MapCellObjects(cell.Objects),
		}
		c = append(c, mappedCell)
	}

	return c
}

func MapCellObjects(objects []navmeshv2.RtNavmeshInstObj) []int {
	ids := make([]int, 0)
	for _, o := range objects {
		ids = append(ids, int(o.ID))
	}
	return ids
}

func MapTiles(tileMap [navmeshv2.TilesTotal]navmeshv2.RtNavmeshTile) (tiles [navmeshv2.TilesTotal]Tile) {
	for i, t := range tileMap {
		tiles[i] = Tile{
			CellID: t.CellIndex,
			Flag:   uint16(t.Flag),
		}
	}

	return tiles
}
