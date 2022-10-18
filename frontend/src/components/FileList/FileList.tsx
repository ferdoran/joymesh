import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useContext, useState} from "react";
import {FilesContext} from "../../App";

type FileListProps = {
    onFileSelected: (file: File) => void
}

export default function FileList({onFileSelected}: FileListProps) {
    const filesContext = useContext(FilesContext)
    const [currentFile, setCurrentFile] = useState<File>()

    const handleFileSelected = (file: File) => {
        setCurrentFile(file)
        onFileSelected(file)
    }

    return (
        <List>
            {Array.from(filesContext.entries()).map(file => (
                <ListItem key={file[0]} disablePadding>
                    <ListItemButton onClick={() => handleFileSelected(file[1])} selected={file[0] === currentFile?.name}>
                        <ListItemText primary={file[0]}></ListItemText>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}