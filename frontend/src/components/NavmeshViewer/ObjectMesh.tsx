import {useEffect, useRef, useState} from "react";
import {ObjectInstance, Point, Region} from "../../api/ApiClient";
import {ScaleFactor} from "./NavmeshViewer";
import {Matrix4, Quaternion, Vector3} from "three";
import {Line} from "@react-three/drei";

type ObjectMeshProps = {
    instance: ObjectInstance
    regionMeta: Region
}

const toVector3 = (p: Point) => new Vector3(p.X, p.Y, p.Z)


export default function ObjectMesh({instance, regionMeta}: ObjectMeshProps) {
    const ref = useRef(null)
    const [cellVertices, setCellVertices] = useState<Vector3[][]>([])

    useEffect(() => {
        const rX = regionMeta.X * 1920
        const rZ = regionMeta.Y * 1920
        const regionOffset = new Vector3(rX, 0, rZ).multiplyScalar(ScaleFactor)
        const pos = toVector3(instance.position).multiplyScalar(ScaleFactor)
        const scale = toVector3(instance.scale).multiplyScalar(ScaleFactor)
        const rot = new Quaternion(instance.rotation.X, instance.rotation.Y, instance.rotation.Z, instance.rotation.W)
        const l2w = new Matrix4().compose(pos, rot, scale)
        const geoms = instance.cells.map(cell => {
            const a = new Vector3(cell.a.X, cell.a.Y, cell.a.Z).applyMatrix4(l2w)
            const b = new Vector3(cell.b.X, cell.b.Y, cell.b.Z).applyMatrix4(l2w)
            const c = new Vector3(cell.c.X, cell.c.Y, cell.c.Z).applyMatrix4(l2w)

            a.add(regionOffset)
            b.add(regionOffset)
            c.add(regionOffset)

            return [a, b, c]
        })


        setCellVertices(geoms)

    }, [instance, regionMeta])

    return (
        <instancedMesh>
            <group ref={ref}>
                {cellVertices.map((v, i) => (
                    <Line key={i} points={v} color="white"/>
                ))}
            </group>
        </instancedMesh>
    )
}