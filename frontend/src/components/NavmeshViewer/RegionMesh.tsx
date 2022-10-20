import * as THREE from 'three'
import {Euler} from 'three'
import {useRef} from "react";
import {RegionDetails} from "../../api/ApiClient";
import {Line, Plane, Text} from "@react-three/drei"
import {extend} from "@react-three/fiber";
import {ScaleFactor} from "./NavmeshViewer";

extend({Line})

type RegionProps = {
    region: RegionDetails
}

const toWorld = (num: number) => num * 1920 * ScaleFactor
const defaultColor = "#656767"

export function RegionMesh({region}: RegionProps) {
    const ref = useRef<THREE.Group>(null!)
    const regionColor = defaultColor

    const p1 = new THREE.Vector3(
        toWorld(region.meta.X) + (1920 * ScaleFactor * .5),
        0,
        toWorld(region.meta.Y) + (1920 * ScaleFactor * .5)
    )

    const textRotation = new Euler(-Math.PI/2, 0, 0, 'XYZ')
    const textPosition = p1

    const geom = () => {
        const points = []
        for (let x = 0; x < 97; x++) {
            for (let z = 0; z < 97; z++) {
                const y = region.heights[z*97+x] * ScaleFactor
                const x1 = (x-48) * 20 * ScaleFactor
                const z1 = (z-48) * 20 * ScaleFactor
                points.push(new THREE.Vector3(x1, y, z1))
            }
        }

        const geom = new THREE.PlaneGeometry(1920 * ScaleFactor, 1920 * ScaleFactor, 96, 96)
        geom.setFromPoints(points)
        return geom
    }

    const fixedGeom = geom()
    return (
        <group ref={ref}>
            <Text position={textPosition} fontSize={2} rotation={textRotation} color={regionColor} >Region: {region.meta.ID}</Text>
            <Plane geometry={fixedGeom} position={textPosition}>
                <meshBasicMaterial color={regionColor} wireframe={true}></meshBasicMaterial>
            </Plane>
        </group>
    )
}