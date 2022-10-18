import {Canvas} from "@react-three/fiber";
import {Box} from "../Box";
import styles from "./NavmeshViewer.module.scss"
import {useEffect} from "react";

type NavmeshViewerProps = {
    file: File | undefined
}

export default function NavmeshViewer({file}: NavmeshViewerProps) {

    useEffect(() => {
        if (file) {
            document.title = `Joymesh - ${file?.name}`
        }
    }, [file])

    return (
        <Canvas className={styles.canvas}>
            Active File: {file ? file.name : "none"}
            <ambientLight/>
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
            <pointLight position={[10, 10, 10]}/>
            <Box position={[-1.2, 0, 0]}/>
            <Box position={[1.2, 0, 0]}/>
        </Canvas>
    )
}