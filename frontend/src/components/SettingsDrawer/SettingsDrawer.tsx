import {Drawer, IconButton} from "@mui/material";
import styles from "./SettingsDrawer.module.scss"
import Box from "@mui/material/Box"
import ObjectSettingsView from "./ObjectSettingsView";
import {ChevronRight} from "@mui/icons-material";


type SettingsWindowProps = {
    open: boolean
    onClose: () => void
}
export default function SettingsDrawer({open, onClose}: SettingsWindowProps) {
    return (
        <Drawer elevation={0} anchor="right" open={open} onClose={onClose} className={styles.drawer}>
                <IconButton className={styles.drawer__closeButton} onClick={onClose} edge="start">
                    <ChevronRight fontSize="large" />
                </IconButton>
            <Box component="form" className={styles.drawer__content}>
                <ObjectSettingsView />
            </Box>
        </Drawer>
    )
}