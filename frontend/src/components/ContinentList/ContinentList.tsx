import {Divider, IconButton, List, ListItem, ListItemText, ListSubheader} from "@mui/material";
import {Add, Remove} from "@mui/icons-material"
import {useEffect, useState} from "react";
import {fetchContinents} from "../../api/ApiClient";
import styles from "./ContinentList.module.scss"

type ContinentListProps = {
    onContinentSelected: (continent: string) => void
    onContinentDeSelected: (continent: string) => void
}

export default function ContinentList({onContinentSelected, onContinentDeSelected}: ContinentListProps) {
    const [currentContinent, setCurrentContinent] = useState<string>()
    const [continents, setContinents] = useState<string[]>([])

    const handleContinentSelected = (continent: string) => {
        setCurrentContinent(continent)
        onContinentSelected(continent)
    }
    const handleContinentDeSelected = (continent: string | undefined) => {
        setCurrentContinent(undefined)
        onContinentDeSelected(continent!)
    }

    useEffect(() => {
        fetchContinents().then(c => setContinents(c))
    }, [])

    return (
        <List className={styles.list} dense>
            {currentContinent && (
                <>
                    <ListSubheader className={styles.list__header} color="default">Active Continent</ListSubheader>
                    <ListItem className={styles.list__item} secondaryAction={
                        <IconButton className={styles.list__button} edge="end" onClick={() => handleContinentDeSelected(currentContinent)} >
                            <Remove />
                        </IconButton>
                    }>
                        <ListItemText primary={currentContinent} />
                    </ListItem>
                    <Divider className={styles.list__divider} />
                </>

            )}
            <ListSubheader className={styles.list__header} color="default">Continents</ListSubheader>
            <Divider className={styles.list__divider}/>
            {continents.filter(c => c !== currentContinent).sort().map(continent => (
                <ListItem key={continent} className={styles.list__item} secondaryAction={
                    <IconButton className={styles.list__button} edge="end" onClick={() => handleContinentSelected(continent)} >
                        <Add />
                    </IconButton>
                }>
                    <ListItemText primary={continent}/>
                </ListItem>
            ))}
        </List>
    )
}