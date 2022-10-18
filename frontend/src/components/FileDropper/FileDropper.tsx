import {DragEvent, useState} from "react";
import styles from './FileDropper.module.scss'

type FileDropperProps = {
    onDrop: (event:DragEvent<HTMLDivElement>) => void
}

export default function FileDropper({onDrop}: FileDropperProps) {
    const [isBeingDraggedOver, setIsBeingDraggedOver] = useState<boolean>(false)

    const handleDrag = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsBeingDraggedOver(true)
    }

    return (
        <div className={styles.box} data-drop-active={isBeingDraggedOver ? "true" : "false"} onDrop={onDrop} onDragOver={handleDrag} onDragLeave={() => setIsBeingDraggedOver(false)}>
            Drag and drop a SilkRoad Navmesh file into the box
        </div>
    )
}