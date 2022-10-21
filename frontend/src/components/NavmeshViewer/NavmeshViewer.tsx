import {Canvas, extend} from "@react-three/fiber";
import styles from "./NavmeshViewer.module.scss"
import {useEffect, useRef, useState} from "react";
import {fetchRegionsForContinent, RegionDetails} from "../../api/ApiClient";
import {RegionMesh} from "./RegionMesh";
import {FlyControls, Line, MapControls, Text} from "@react-three/drei";
import type {FlyControls as FlyControlsImpl} from 'three-stdlib';
import {AxesHelper, PerspectiveCamera} from "three";
import {Backdrop, CircularProgress} from "@mui/material";

extend({Line, MapControls, PerspectiveCamera, Text})
type NavmeshViewerProps = {
    continent: string | undefined
}

export const ScaleFactor = .1

export default function NavmeshViewer({continent}: NavmeshViewerProps) {
    const [regionDetails, setRegionDetails] = useState<RegionDetails[]>([])
    const camera = useRef<PerspectiveCamera>(new PerspectiveCamera(25, 1, .1, 5))
    const axesHelper = useRef(new AxesHelper())
    const controls = useRef<FlyControlsImpl>(null)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        if (continent) {
            document.title = `Joymesh - ${continent}`
            setLoading(true)
            fetchRegionsForContinent(continent)
                .then(resolvedDetails => {
                    setRegionDetails(resolvedDetails)
                    const metas = resolvedDetails.map(r => r.meta).sort((a, b) => a.X - b.X)
                    const median = Math.floor(metas.length * .5)


                    const x = (metas[median].X + 1) * 1920 * ScaleFactor
                    const y = 100 + resolvedDetails[median].heights[0] * ScaleFactor
                    const z = (metas[median].Y + 1) * 1920 * ScaleFactor

                    controls.current!.object.position.set(x, y, z)
                    controls.current!.object.lookAt(x, 0, z)
                    controls.current!.object.updateMatrix()
                    axesHelper.current.position.set(x, 0, z)
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }

    }, [continent])


    return (
        <>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
                // onClick={handleClose}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Canvas className={styles.canvas}>
                <ambientLight/>
                <perspectiveCamera ref={camera} far={5}/>
                {/*<OrbitControls ref={controls} panSpeed={1.75} zoomSpeed={1.25} />*/}
                <FlyControls ref={controls} dragToLook={true} rollSpeed={.5} movementSpeed={150}/>

                <axesHelper ref={axesHelper} scale={1920 * ScaleFactor * 200}/>
                {regionDetails.map(reg => (
                    <RegionMesh key={reg.meta.ID} region={reg}/>
                ))}
            </Canvas>
        </>
    )
}