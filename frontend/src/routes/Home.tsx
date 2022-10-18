import {DragEvent, useContext} from "react";
import {Stack} from "@mui/material";
import FileDropper from "../components/FileDropper";
import {useNavigate} from "react-router-dom";
import {FilesContext} from "../App";

export default function Home() {
    const filesContext = useContext(FilesContext)
    const navigate = useNavigate()

    const handleFilesDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();


        Array.from(event.dataTransfer.files).forEach(file => {
            filesContext.set(file.name, file)
        })

        navigate('/editor')
    }

    return (
        <Stack sx={{height: '100%'}} direction="column" justifyContent="center" alignItems="center" spacing={2}>
            <FileDropper onDrop={handleFilesDrop} />
        </Stack>
    )
}