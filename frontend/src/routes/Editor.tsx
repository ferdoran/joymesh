import {useState} from "react";
import FileList from "../components/FileList";
import {Grid} from "@mui/material";
import NavmeshViewer from "../components/NavmeshViewer";

export default function Editor() {
    const [activeFile, setActiveFile] = useState<File>()

    const onFileSelected = (file: File) => {
        setActiveFile(file)
    }

    return (
        <Grid container alignItems="stretch" sx={{height: '100%'}}>
            <Grid item xs={2}>
                <FileList onFileSelected={onFileSelected}/>
            </Grid>
            <Grid item xs={10}>
                <NavmeshViewer file={activeFile}></NavmeshViewer>
            </Grid>
        </Grid>
    )
}