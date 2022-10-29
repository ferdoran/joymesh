import * as THREE from 'three'
import {Euler, PlaneGeometry, Vector3} from 'three'
import {useContext, useMemo, useRef, useState} from "react";
import {Point, RegionDetails} from "../../api/ApiClient";
import {Plane, Text} from "@react-three/drei"
import {ScaleFactor} from "./NavmeshViewer";
import ObjectMesh from "./ObjectMesh";
import {SettingsContext} from "../../App";

type RegionProps = {
    region: RegionDetails
    onClick: (region: RegionDetails) => void
    selected: boolean
}

const toWorld = (num: number) => num * 1920 * ScaleFactor
const defaultColor = "#777"
const defaultCellColor = "#556677"
const defaultBlockedEdgeColor = "red"
const toNumberArray = (v: Vector3) => [v.x, v.y, v.z]
const selectedColor = "hotpink"

export function RegionMesh({region, onClick, selected}: RegionProps) {
    const calcHeightForPoint = (p: Point) => {
        const pX = p.X / 20
        const pZ = p.Z / 20

        return region.heights[pZ*97+pX]
    }

    const calcHeightForXZ = (x: number, z: number) => {
        const pX = x / 20
        const pZ = z / 20

        return region.heights[pZ*97+pX]
    }
    const {settings} = useContext(SettingsContext)
    const ref = useRef<THREE.Group>(null!)
    const [p1] = useState<THREE.Vector3>(new THREE.Vector3(
        toWorld(region.meta.X) + (1920 * ScaleFactor * .5),
        0,
        toWorld(region.meta.Y) + (1920 * ScaleFactor * .5)
    ))

    const [textRotation] = useState(new Euler(-Math.PI / 2, 0, 0, 'XYZ'))
    const [color, setColor] = useState(defaultColor)
    const [cellColor, setCellColor] = useState(defaultCellColor)
    const terrainVertices = useMemo(() => {
        const points = []
        for (let x = 0; x < 97; x++) {
            for (let z = 0; z < 97; z++) {
                const y = region.heights![z * 97 + x] * ScaleFactor
                const x1 = (x - 48) * 20 * ScaleFactor
                const z1 = (z - 48) * 20 * ScaleFactor
                points.push(new Vector3(x1, y, z1))
            }
        }

        return points

    }, [region])
    const terrainGeometry = useMemo(() => new PlaneGeometry(
        1920 * ScaleFactor,
        1920 * ScaleFactor,
        96,
        96
    ).setFromPoints(terrainVertices), [terrainVertices])
    const cellVertices = useMemo(() => {
        return new Float32Array(region.cells.flatMap(cell => {
            const hA = calcHeightForXZ(cell.min.X, cell.min.Y)
            const hB = calcHeightForXZ(cell.min.X, cell.max.Y)
            const hC = calcHeightForXZ(cell.max.X, cell.max.Y)
            const hD = calcHeightForXZ(cell.max.X, cell.min.Y)
            const a = new Vector3(cell.min.X, hA, cell.min.Y).multiplyScalar(ScaleFactor)
            const b = new Vector3(cell.min.X, hB, cell.max.Y).multiplyScalar(ScaleFactor)
            const c = new Vector3(cell.max.X, hC, cell.max.Y).multiplyScalar(ScaleFactor)
            const d = new Vector3(cell.max.X, hD, cell.min.Y).multiplyScalar(ScaleFactor)

            return [d, a, b, d, b, c].flatMap(toNumberArray)
        }))
    }, [region])
    const blockedEdgesVertices = useMemo(() => {
        return new Float32Array(region.internalEdges.filter(e => (e.flag & 3) !== 0).flatMap(edge => {
            const hA = calcHeightForPoint(edge.a)
            const hB = calcHeightForPoint(edge.b)

            const a = new Vector3(edge.a.X, hA, edge.a.Z).multiplyScalar(ScaleFactor)
            const b = new Vector3(edge.b.X, hB, edge.b.Z).multiplyScalar(ScaleFactor)

            return [a, b].flatMap(toNumberArray)
        }))
    }, [region])


    return (
        <group ref={ref} position={p1}>
            <Text
                // position={p1}
                fontSize={2}
                rotation={textRotation}
                color={color}
            >Region: {region.meta.ID}
            </Text>
            {settings.regionSettings.enableRenderTerrain
                ? <Plane
                    geometry={terrainGeometry}
                    onPointerOver={() => setColor('hotPink')}
                    onPointerOut={() => setColor(defaultColor)}
                    onClick={() => onClick(region)}>
                    <meshBasicMaterial color={selected ? selectedColor : color} wireframe={true}></meshBasicMaterial>
                </Plane>
                : <></>
            }
            {settings.regionSettings.enableRenderCells
                ? <group>
                    <mesh
                        onPointerOver={() => setCellColor("green")}
                        onPointerOut={() => setCellColor(defaultCellColor)}
                        onClick={(e) => console.log("Cell clicked", e.point.sub(p1))}
                    >
                        <bufferGeometry attach="geometry">
                            <bufferAttribute array={cellVertices} itemSize={3} count={cellVertices.length / 3}
                                             attach="attributes-position"/>
                        </bufferGeometry>
                        <meshBasicMaterial wireframe={true} attach="material" color={cellColor}/>
                    </mesh>
                </group>
                : <></>
            }
            {settings.regionSettings.enableBlockedEdges
                    ? <group>
                        <lineSegments>
                            <bufferGeometry attach="geometry">
                                <bufferAttribute array={blockedEdgesVertices} itemSize={3}
                                                 count={blockedEdgesVertices.length / 3}
                                                 attach="attributes-position"/>
                            </bufferGeometry>
                            <lineBasicMaterial attach="material" color={defaultBlockedEdgeColor}/>
                        </lineSegments>
                    </group>
                    : <></>
            }
            <group>
                {settings.objectSettings.enableRenderCells ? region.objects!.map((object, i) => (
                    <ObjectMesh key={i} regionMeta={region.meta} instance={object}/>
                )) : <></>}
            </group>
        </group>
    )
}