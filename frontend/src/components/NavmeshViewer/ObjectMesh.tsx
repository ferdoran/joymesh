import {useMemo, useRef, useState} from "react";
import {ObjectInstance, Point, Region} from "../../api/ApiClient";
import {ScaleFactor} from "./NavmeshViewer";
import {Matrix4, Quaternion, Vector3} from "three";

type ObjectMeshProps = {
    instance: ObjectInstance
    regionMeta: Region
}

const toVector3 = (p: Point) => new Vector3(p.X, p.Y, p.Z)
const toNumberArray = (v: Vector3) => [v.x, v.y, v.z]
const defaultColor = "yellow"
export default function ObjectMesh({instance, regionMeta}: ObjectMeshProps) {
    const ref = useRef(null)
    const [color, setColor] = useState(defaultColor)
    const cellVertices = useMemo(() => {
        const pos = toVector3(instance.position).multiplyScalar(ScaleFactor)
        const scale = toVector3(instance.scale).multiplyScalar(ScaleFactor)
        const rot = new Quaternion(instance.rotation.X, instance.rotation.Y, instance.rotation.Z, instance.rotation.W)
        const l2w = new Matrix4().compose(pos, rot, scale)
        return new Float32Array(instance.cells.flatMap(cell => {
            const a = new Vector3(cell.a.X, cell.a.Y, cell.a.Z).applyMatrix4(l2w)
            const b = new Vector3(cell.b.X, cell.b.Y, cell.b.Z).applyMatrix4(l2w)
            const c = new Vector3(cell.c.X, cell.c.Y, cell.c.Z).applyMatrix4(l2w)


            return [a,b,c].flatMap(toNumberArray)
        }))
    }, [instance, regionMeta])

    return (
        <mesh ref={ref} onPointerOver={() => setColor("hotpink")} onPointerOut={() => setColor(defaultColor)}>
            <bufferGeometry attach="geometry">
                <bufferAttribute array={cellVertices} itemSize={3} count={cellVertices.length / 3} attach="attributes-position" />
            </bufferGeometry>
            <meshBasicMaterial wireframe={true} attach="material" color={color}/>
        </mesh>
    )
}