import {AppBar, Container, Link, Toolbar} from "@mui/material"
import {Link as RouterLink} from "react-router-dom"
import MapIcon from "@mui/icons-material/Map"
import styles from "./Header.module.scss"

export default function Header() {
    return (
        <AppBar position="static" color="secondary" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <MapIcon />
                    <Link component={RouterLink} to="/" noWrap className={styles.title}>JOYMESH</Link>
                </Toolbar>
            </Container>
        </AppBar>
    )
}