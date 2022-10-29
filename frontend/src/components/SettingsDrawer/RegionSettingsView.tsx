import {Checkbox, FormControlLabel, FormGroup, Stack, Typography} from "@mui/material";
import {SettingsContext} from "../../App";
import {useContext} from "react";
import {RegionSettings} from "./Settings";


export default function RegionSettingsView() {
    const {settings, setSettings} = useContext(SettingsContext)
    const updateRegionSettings = (regionSettings: RegionSettings) => {
        setSettings({
            ...settings,
            regionSettings: regionSettings
        })
    }

    return (
        <Stack direction="column">
            <Typography variant="h6">Region Settings</Typography>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={(event) => updateRegionSettings({
                                    ...settings.regionSettings,
                                enableRenderTerrain: event.target.checked
                            })}
                            checked={settings.regionSettings.enableRenderTerrain}
                        />
                    }
                    label="Enable Terrain Rendering"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={(event) => updateRegionSettings({
                                ...settings.regionSettings,
                                enableRenderCells: event.target.checked
                            })}
                            checked={settings.regionSettings.enableRenderCells}
                        />
                    }
                    label="Enable Cell Rendering"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={(event) => updateRegionSettings({
                                ...settings.regionSettings,
                                enableBlockedEdges: event.target.checked
                            })}
                            checked={settings.regionSettings.enableBlockedEdges}
                        />
                    }
                    label="Enable Rendering of Blocked Edges"
                />
            </FormGroup>
        </Stack>
    )
}