const dev = false // gitignore#
let host = ""
if (dev) {
    host = "http://localhost:8080"
}
export function fetchContinents() {
    return fetch(host + '/api/continents').then(resp => resp.json() as Promise<string[]>)
}

export function fetchRegionsForContinent(continent: string) {
    return fetch(host + '/api/regions?' + new URLSearchParams({
        continent
    })).then(resp => resp.json() as Promise<Region[]>)
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
    meta: Region,
    tiles: Tile[],
    heights: Float32Array
    planes: Plane[]
    objects: ObjectInstance[]
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