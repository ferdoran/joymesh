import {useContext, useEffect, useState} from "react";
import {FilesContext} from "../App";
import {useNavigate} from "react-router-dom";
import FileList from "../components/FileList";
import {Grid} from "@mui/material";
import NavmeshViewer from "../components/NavmeshViewer";

export default function Editor() {
    const filesContext = useContext(FilesContext)
    const navigate = useNavigate()
    const [activeFile, setActiveFile] = useState<File>()

    useEffect(() => {
        if (filesContext.size === 0) {
            navigate("/")
        }
    }, [filesContext, navigate])

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