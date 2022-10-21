import {useState} from "react";
import ContinentList from "../components/ContinentList";
import {Grid} from "@mui/material";
import NavmeshViewer from "../components/NavmeshViewer";

export default function Editor() {
    const [activeContinent, setActiveContinent] = useState<string>()

    const onContinentSelected = (continent: string) => {
        setActiveContinent(continent)
    }

    const onContinentDeSelected = (_continent: string) => {
        setActiveContinent(undefined)
    }

    return (
        <Grid container alignItems="stretch" columns={16}>
            <Grid item xs={4} lg={2}>
                <ContinentList onContinentSelected={onContinentSelected} onContinentDeSelected={onContinentDeSelected}/>
            </Grid>
            <Grid item xs={12} lg={14}>
                <NavmeshViewer continent={activeContinent}></NavmeshViewer>
            </Grid>
        </Grid>
    )
}