import {Checkbox, FormControlLabel, FormGroup, Stack, Typography} from "@mui/material";
import {SettingsContext} from "../../App";
import {useContext} from "react";
import {ObjectSettings} from "./Settings";


export default function ObjectSettingsView() {
    const {settings, setSettings} = useContext(SettingsContext)
    const updateObjectSettings = (objectSettings: ObjectSettings) => {
        setSettings({
            ...settings,
            objectSettings: objectSettings
        })
    }

    return (
        <Stack direction="column">
            <Typography variant="h6">Object Settings</Typography>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={(event) => updateObjectSettings({
                                    ...settings.objectSettings,
                                    enableRenderCells: event.target.checked
                            })}
                            checked={settings.objectSettings.enableRenderCells}
                        />
                    }
                    label="Enable Cell Rendering"
                />
            </FormGroup>
        </Stack>
    )
}