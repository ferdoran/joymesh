import React, {createContext, useState} from 'react';
import {CssBaseline, Stack, StyledEngineProvider, ThemeProvider} from "@mui/material";
import Theme from "./theme";
import styles from './App.module.scss'
import {useRoutes} from "react-router-dom";
import {routesConfig} from "./routes/Config";
import Header from "./components/Header";
import {Settings} from "./components/SettingsDrawer/Settings";

export const SettingsContext = createContext({
    settings: new Settings(),
    setSettings: (_settings: Settings) => {}
})

export default function App() {
    const routesElement = useRoutes(routesConfig)
    const [settings, setSettings] = useState(new Settings())
    const settingsValue = {settings, setSettings}
    return (
        <React.StrictMode>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={Theme}>
                    <SettingsContext.Provider value={settingsValue}>
                        <CssBaseline/>
                        <Stack direction="column" className={styles.app}>
                            <div className={styles.app__header}><Header /></div>
                            <div className={styles.app__content}>{routesElement}</div>
                        </Stack>
                    </SettingsContext.Provider>
                </ThemeProvider>
            </StyledEngineProvider>
        </React.StrictMode>
    )
}