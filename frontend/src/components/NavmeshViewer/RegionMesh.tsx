import * as THREE from 'three'
import {Euler} from 'three'
import {useRef} from "react";
import {Region} from "../../api/ApiClient";
import {Line, Text} from "@react-three/drei"
import {extend} from "@react-three/fiber";
import {ScaleFactor} from "./NavmeshViewer";

extend({Line, Text})

type RegionProps = {
    region: Region
}

const toWorld = (num: number) => num * 1920 * ScaleFactor

export function RegionMesh({region}: RegionProps) {
    const ref = useRef<THREE.Group>(null!)

    const p1 = new THREE.Vector3(
        toWorld(region.X),
        0,
        toWorld(region.Y)
    )

    const p2 = new THREE.Vector3(
        toWorld(region.X),
        0,
        toWorld(region.Y+1)
    )

    const p3 = new THREE.Vector3(
        toWorld(region.X+1),
        0,
        toWorld(region.Y)
    )

    const p4 = new THREE.Vector3(
        toWorld(region.X+1) ,
        0,
        toWorld(region.Y+1)
    )

    const textRotation = new Euler(-Math.PI/2, 0, 0, 'XYZ')
    const textPosition = p1.clone().add(new THREE.Vector3(toWorld(.5), 0, toWorld(.5)))

    return (
        <group ref={ref}>
            <Line points={[p1, p2]} color="lightgray" lineWidth={1}/>
            <Line points={[p1, p3]} color="lightgray" lineWidth={1}/>
            <Line points={[p2, p4]} color="lightgray" lineWidth={1}/>
            <Line points={[p4, p3]} color="lightgray" lineWidth={1}/>
            <Text position={textPosition} fontSize={2} rotation={textRotation} color="lightgray" >Region: {region.ID}</Text>
        </group>
    )
}