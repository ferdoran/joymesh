import {useState} from "react";
import ContinentList from "../components/ContinentList";
import {Grid} from "@mui/material";
import NavmeshViewer from "../components/NavmeshViewer";

export default function Editor() {
    const [activeContinent, setActiveContinent] = useState<string>()

    const onContinentSelected = (continent: string) => {
        setActiveContinent(continent)
    }

    return (
        <Grid container alignItems="stretch">
            <Grid item xs={2}>
                <ContinentList onContinentSelected={onContinentSelected}/>
            </Grid>
            <Grid item xs={10}>
                <NavmeshViewer continent={activeContinent}></NavmeshViewer>
            </Grid>
        </Grid>
    )
}