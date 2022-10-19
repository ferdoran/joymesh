import {Canvas, extend} from "@react-three/fiber";
import styles from "./NavmeshViewer.module.scss"
import {useEffect, useRef, useState} from "react";
import {fetchRegionsForContinent, Region} from "../../api/ApiClient";
import {RegionMesh} from "./RegionMesh";
import {Line, MapControls, OrbitControls, PerspectiveCamera, Text} from "@react-three/drei";
import type {OrbitControls as OrbitControlsImpl} from 'three-stdlib';
import * as THREE from "three";

extend({Line, MapControls, PerspectiveCamera, Text})
type NavmeshViewerProps = {
    continent: string | undefined
}

export const ScaleFactor = .1

export default function NavmeshViewer({continent}: NavmeshViewerProps) {
    const [regions, setRegions] = useState<Region[]>([])
    const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(75, 1, .1, 50_000))
    const controls = useRef<OrbitControlsImpl>(null)
    useEffect(() => {
        if (continent) {
            document.title = `Joymesh - ${continent}`
            fetchRegionsForContinent(continent).then(regions => {
                setRegions(regions)

                const x = calcCenterX(regions)
                const z = calcCenterY(regions)
                controls.current!.object.position.set(x, 20, z)
                controls.current!.target.set(x, 0, z)

            })
        }

    }, [continent])

    const calcCenterX = (regions: Region[]) => {
        const avgX = regions.map(r => r.X).reduce((a, b) => a + b, 0) / regions.length

        return Math.floor(avgX) * 192
    }

    const calcCenterY = (regions: Region[]) => {
        const avgY = regions.map(r => r.Y).reduce((a, b) => a + b, 0) / regions.length
        return Math.floor(avgY) * 192
    }

    return (
        <Canvas className={styles.canvas}>
            <PerspectiveCamera ref={camera}/>
            <OrbitControls ref={controls} panSpeed={1.25} zoomSpeed={1.25} />
            <ambientLight/>
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
            <pointLight position={[10, 10, 10]}/>
            <gridHelper args={[1920 * ScaleFactor * 20, 40]}/>
            <axesHelper args={[1920 * ScaleFactor * 20]}/>
            {regions.map(reg => (
                <RegionMesh key={reg.ID} region={reg}></RegionMesh>
            ))}
        </Canvas>
    )
}