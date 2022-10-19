export function fetchContinents() {
    return fetch('/api/continents').then(resp => resp.json() as Promise<string[]>)
}

export interface Region {
    ID: number
    X: number
    Y: number
}

export function fetchRegionsForContinent(continent: string) {
    return fetch('/api/regions?' + new URLSearchParams({
        continent
    })).then(resp => resp.json() as Promise<Region[]>)
}
