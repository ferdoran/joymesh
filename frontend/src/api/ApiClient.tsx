export function fetchContinents() {
    return fetch('/api/continents').then(resp => resp.json() as Promise<string[]>)
}

export function fetchRegionsForContinent(continent: string) {
    return fetch('/api/regions?' + new URLSearchParams({
        continent
    })).then(resp => resp.json() as Promise<Region[]>)
}

export function fetchRegionDetails(regionId: number) {
    return fetch(`/api/regions/${regionId}`)
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