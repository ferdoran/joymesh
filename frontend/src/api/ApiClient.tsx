const dev = false // gitignore#
let host = ""
if (dev) {
    host = "http://localhost:8080"
}
export function fetchContinents() {
    return fetch(host + '/api/continents').then(resp => resp.json() as Promise<string[]>)
}

export function fetchRegionsForContinent(continent: string) {
    return fetch(`${host}/api/continents/${continent}`)
        .then(resp => resp.json() as Promise<RegionDetails[]>)
}

export function fetchRegionDetails(regionId: number) {
    return fetch(host + `/api/regions/${regionId}`)
        .then(resp => resp.json() as Promise<RegionDetails>)
}

export interface Region {
    ID: number
    X: number
    Y: number
}

export interface RegionDetails {
    meta: Region
    tiles: Tile[]
    heights: Float32Array
    planes: Plane[]
    cells: RegionCell[]
    objects: ObjectInstance[]
    internalEdges: InternalEdge[]
    globalEdges: GlobalEdge[]
}

export interface Tile {
    cellId: number
    flag: number
}

export interface Plane {
    height: number,
    surface: SurfaceType
}

export enum SurfaceType {
    None,
    Water,
    Ice
}

export interface ObjectInstance {
    id: number
    position: Point
    scale: Point
    rotation: {X: number, Y: number, Z: number, W: number}
    localToWorld: number[]
    worldToLocal: number[]
    cells: ObjectCell[]
}

export interface ObjectCell {
    id: number
    flag: number
    a: Point
    b: Point
    c: Point
}

export interface Point {
    X: number
    Y: number
    Z: number
}

export interface Point2 {
    X: number
    Y: number
}

export interface RegionCell {
    id: number
    min: Point2
    max: Point2
    objects: number[]
}

export interface InternalEdge {
    id: number
    flag: number
    eventData: number
    srcCellId: number
    dstCellId: number
    srcDir: number
    dstDir: number
    a: Point
    b: Point
}

export interface GlobalEdge {
    id: number
    flag: number
    eventData: number
    srcCellId: number
    dstCellId: number
    srcDir: number
    dstDir: number
    srcRegionId: number
    dstRegionId: number
    a: Point
    b: Point
}