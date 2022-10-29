export class Settings {
    objectSettings: ObjectSettings
    regionSettings: RegionSettings

    constructor() {
        this.objectSettings = {
            enableRenderCells: true
        }
        this.regionSettings = {
            enableRenderTerrain: false,
            enableBlockedEdges: true,
            enableRenderCells: true
        }
    }
}

export interface ObjectSettings {
    enableRenderCells: boolean
}

export interface RegionSettings {
    enableBlockedEdges: boolean
    enableRenderTerrain: boolean
    enableRenderCells: boolean
}