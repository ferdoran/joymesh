import {Canvas, extend} from "@react-three/fiber";
import styles from "./NavmeshViewer.module.scss"
import {useEffect, useRef, useState} from "react";
import {fetchRegionDetails, fetchRegionsForContinent, RegionDetails} from "../../api/ApiClient";
import {RegionMesh} from "./RegionMesh";
import {Line, MapControls, OrbitControls, Text} from "@react-three/drei";
import type {OrbitControls as OrbitControlsImpl} from 'three-stdlib';
import {AxesHelper, PerspectiveCamera} from "three";

extend({Line, MapControls, PerspectiveCamera, Text})
type NavmeshViewerProps = {
    continent: string | undefined
}

export const ScaleFactor = .1

export default function NavmeshViewer({continent}: NavmeshViewerProps) {
    const [regionDetails, setRegionDetails] = useState<RegionDetails[]>([])
    const camera = useRef<PerspectiveCamera>(new PerspectiveCamera(25, 1, .1, 100_000))
    const axesHelper = useRef(new AxesHelper(1920 * ScaleFactor * 10))
    const controls = useRef<OrbitControlsImpl>(null)
    useEffect(() => {
        if (continent) {
            document.title = `Joymesh - ${continent}`
            fetchRegionsForContinent(continent).then(regions => {
                return Promise.all(regions.map(r => fetchRegionDetails(r.ID)))
            })
                .then(resolvedDetails => {
                    setRegionDetails(resolvedDetails)
                    const x = resolvedDetails[0]?.meta.X * 1920 * ScaleFactor
                    const z = resolvedDetails[0]?.meta.Y * 1920 * ScaleFactor
                    controls.current!.object.position.set(x, resolvedDetails[0]?.heights[0], z)
                    axesHelper.current.position.set(x, 0, z)
                    controls.current!.target.set(x, 0, z)
                })
        }

    }, [continent])

    return (
        <Canvas className={styles.canvas}>
            <ambientLight />
            <perspectiveCamera ref={camera}/>
            <OrbitControls ref={controls} panSpeed={1.75} zoomSpeed={1.25} />

            <axesHelper ref={axesHelper} />
            {regionDetails.map(reg => (
                <RegionMesh key={reg.meta.ID} region={reg} />
            ))}
        </Canvas>
    )
}