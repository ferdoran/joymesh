import {Divider, List, ListItem, ListItemButton, ListItemText, ListSubheader} from "@mui/material";
import {useEffect, useState} from "react";
import {fetchContinents} from "../../api/ApiClient";
import styles from "./ContinentList.module.scss"

type ContinentListProps = {
    onContinentSelected: (continent: string) => void
}

export default function ContinentList({onContinentSelected}: ContinentListProps) {
    const [currentContinent, setCurrentContinent] = useState<string>()
    const [continents, setContinents] = useState<string[]>([])

    const handleContinentSelected = (continent: string) => {
        setCurrentContinent(continent)
        onContinentSelected(continent)
    }

    useEffect(() => {
        fetchContinents().then(c => setContinents(c))
    }, [])

    return (
        <List className={styles.list} dense>
            <ListSubheader className={styles.list__header} color="default">Continents</ListSubheader>
            <Divider className={styles.list__divider}/>
            {continents.sort().map(continent => (
                <ListItem key={continent} className={styles.list__item} disablePadding>
                    <ListItemButton onClick={() => handleContinentSelected(continent)} selected={continent === currentContinent}>
                        <ListItemText primary={continent}></ListItemText>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}