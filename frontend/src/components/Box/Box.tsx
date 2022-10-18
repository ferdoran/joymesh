import * as THREE from 'three'
import { ThreeElements, useFrame } from "@react-three/fiber";
import {useRef, useState} from "react";

export function Box(props: ThreeElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!)
    const [hovered, setHovered] = useState<boolean>(false)
    const [clicked, setClicked] = useState<boolean>(false)
    useFrame((_state, _delta) => (ref.current.rotation.x += 0.01))

    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(_event) => setClicked(!clicked)}
            onPointerOver={(_event) => setHovered(true)}
            onPointerOut={(_event) => setHovered(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}