import {AppBar, Container, Toolbar, Typography} from "@mui/material";
import MapIcon from "@mui/icons-material/Map"
import styles from "./Header.module.scss"

export default function Header() {
    return (
        <AppBar position="static" color="secondary" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <MapIcon />
                    <Typography variant="h6" noWrap className={styles.title}>JOYMESH</Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}