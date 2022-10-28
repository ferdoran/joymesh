import * as THREE from 'three'
import {Euler, PlaneGeometry} from 'three'
import {useContext, useEffect, useRef, useState} from "react";
import {RegionDetails} from "../../api/ApiClient";
import {Line, Text, Plane} from "@react-three/drei"
import {extend} from "@react-three/fiber";
import {ScaleFactor} from "./NavmeshViewer";
import ObjectMesh from "./ObjectMesh";
import {SettingsContext} from "../../App";

extend({Line})

type RegionProps = {
    region: RegionDetails
}

const toWorld = (num: number) => num * 1920 * ScaleFactor
const defaultColor = "#777"

export function RegionMesh({region}: RegionProps) {
    const {settings} = useContext(SettingsContext)
    const ref = useRef<THREE.Group>(null!)
    const [p1] = useState<THREE.Vector3>(new THREE.Vector3(
        toWorld(region.meta.X) + (1920 * ScaleFactor * .5),
        0,
        toWorld(region.meta.Y) + (1920 * ScaleFactor * .5)
    ))

    const [textRotation] = useState(new Euler(-Math.PI / 2, 0, 0, 'XYZ'))
    const [fixedGeom, setFixedGeom] = useState<PlaneGeometry>()

    useEffect(() => {
        const points = []
        for (let x = 0; x < 97; x++) {
            for (let z = 0; z < 97; z++) {
                const y = region.heights[z * 97 + x] * ScaleFactor
                const x1 = (x - 48) * 20 * ScaleFactor
                const z1 = (z - 48) * 20 * ScaleFactor
                points.push(new THREE.Vector3(x1, y, z1))
            }
        }

        const geom = new THREE.PlaneGeometry(1920 * ScaleFactor, 1920 * ScaleFactor, 96, 96)
        geom.setFromPoints(points)
        setFixedGeom(geom)
    }, [region.heights])

    return (
        <group ref={ref}>
            <Text position={p1} fontSize={2} rotation={textRotation}
                  color={defaultColor}>Region: {region.meta.ID}</Text>
            <Plane geometry={fixedGeom} position={p1}>
                <meshBasicMaterial color={defaultColor} wireframe={true}></meshBasicMaterial>
            </Plane>
            <group>
                {settings.objectSettings.enableRenderCells ? region.objects.map((object, i) => (
                    <ObjectMesh key={i} regionMeta={region.meta} instance={object}/>
                )): <></>}
            </group>
        </group>
    )
}