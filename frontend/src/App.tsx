import React, {createContext} from 'react';
import {CssBaseline, Stack, StyledEngineProvider, ThemeProvider} from "@mui/material";
import Theme from "./theme";
import styles from './App.module.scss'
import {useRoutes} from "react-router-dom";
import {routesConfig} from "./routes/Config";
import Header from "./components/Header";

export const FilesContext = createContext<Map<string, File>>(new Map<string, File>())
export default function App() {
    const routesElement = useRoutes(routesConfig)
    return (
        <React.StrictMode>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={Theme}>
                    <CssBaseline/>
                    <Stack direction="column" className={styles.app}>
                        <div className={styles.app__header}><Header /></div>
                        <div className={styles.app__content}>{routesElement}</div>
                    </Stack>
                </ThemeProvider>
            </StyledEngineProvider>
        </React.StrictMode>
    )
}