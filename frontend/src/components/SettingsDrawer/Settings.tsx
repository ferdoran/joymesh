export class Settings {
    objectSettings: ObjectSettings

    constructor() {
        this.objectSettings = {
            enableRenderCells: true
        }
    }
}

export interface ObjectSettings {
    enableRenderCells: boolean
}