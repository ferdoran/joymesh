import {AppBar, Container, IconButton, Link, Toolbar} from "@mui/material"
import {Link as RouterLink} from "react-router-dom"
import MapIcon from "@mui/icons-material/Map"
import styles from "./Header.module.scss"
import {Settings} from "@mui/icons-material";
import {useState} from "react";
import SettingsDrawer from "../SettingsDrawer";

export default function Header() {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <AppBar position="static" color="secondary" elevation={0}>
            <Container maxWidth={false} disableGutters>
                <Toolbar disableGutters className={styles.toolbar}>
                    <MapIcon/>
                    <Link component={RouterLink} to="/" noWrap className={styles.title}>JOYMESH</Link>
                    <IconButton size="large" className={styles.toolbar__settings} onClick={() => setShowSettings(true)}><Settings /></IconButton>
                </Toolbar>
                <SettingsDrawer open={showSettings} onClose={() => setShowSettings(false)} />
            </Container>
        </AppBar>
    )
}