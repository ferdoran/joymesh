import {Canvas, extend} from "@react-three/fiber";
import styles from "./NavmeshViewer.module.scss"
import {useEffect, useRef, useState} from "react";
import {fetchRegionsForContinent, Region, RegionCell, RegionDetails} from "../../api/ApiClient";
import {RegionMesh} from "./RegionMesh";
import {FlyControls, Line, MapControls, Text} from "@react-three/drei";
import type {FlyControls as FlyControlsImpl} from 'three-stdlib';
import {AxesHelper, PerspectiveCamera} from "three";
import {Backdrop, CircularProgress} from "@mui/material";
import {RegionPathFinder} from "../../model/RegionPathFinder";
import {CellPathFinder} from "../../model/CellPathFinder";

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
    const [regionPathFinder, setRegionPathFinder] = useState<RegionPathFinder>()
    const [cellPathFinder, setCellPathFinder] = useState<CellPathFinder>()
    const [fromRegion, setFromRegion] = useState<RegionDetails>()
    const [toRegion, setToRegion] = useState<RegionDetails>()
    const [fromCell, setFromCell] = useState<{ cell: RegionCell, region: Region }>()
    const [toCell, setToCell] = useState<{ cell: RegionCell, region: Region }>()
    const [selectedRegions, setSelectedRegions] = useState<Map<number, boolean>>(new Map())

    const handleRegionClicked = (region: RegionDetails) => {
        if (fromRegion === undefined) {
            console.log("Setting from region: ", region.meta.ID)
            // setFromRegion(region)
        } else if (toRegion === undefined) {
            console.log("Setting to region: ", region.meta.ID)
            // setToRegion(region)
            // const path = regionPathFinder?.findPath(fromRegion, region!)
            // const selecteds = new Map<number, boolean>()
            // path?.forEach(r => selecteds.set(r, true))
            // console.log("found path", path?.map(r => r))
            // setSelectedRegions(selecteds)
        } else {
            console.log("clearing regions")
            // setFromRegion(undefined)
            // setToRegion(undefined)
            // setSelectedRegions(new Map())
        }
    }

    const handleCellClicked = (region: Region, cell: RegionCell) => {
        if (fromCell === undefined) {
            console.log("Setting from cell: ", region.ID, cell.id)
            setFromCell({cell, region})
        } else if (toCell === undefined) {
            console.log("Setting to cell: ", region.ID, cell.id)
            const tc = { cell, region }
            setToCell(tc)
            const path = cellPathFinder?.findPath(fromCell, tc)
            const selecteds = new Map<number, boolean>()
            path?.forEach(r => selecteds.set(r.region.ID, true))
            console.log("found path", path?.map(r => {
                return {reg: r.region.ID, ce: r.cell.id}
            }))
            setSelectedRegions(selecteds)
        } else {
            console.log("clearing regions")
            setFromCell(undefined)
            setToCell(undefined)
            setSelectedRegions(new Map())
        }
    }

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
                    const y = 100 + resolvedDetails[median].heights![0] * ScaleFactor
                    const z = (metas[median].Y + 1) * 1920 * ScaleFactor

                    controls.current!.object.position.set(x, y, z)
                    controls.current!.object.lookAt(x, 0, z)
                    controls.current!.object.updateMatrix()
                    axesHelper.current.position.set(x, 0, z)
                    setLoading(false)
                    // setRegionPathFinder(new RegionPathFinder(resolvedDetails))
                    setCellPathFinder(new CellPathFinder(resolvedDetails))
                    const selecteds = new Map<number, boolean>()
                    resolvedDetails.forEach(r => selecteds.set(r.meta.ID, false))
                    setSelectedRegions(selecteds)
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
                    <RegionMesh key={reg.meta.ID} region={reg}
                                selected={
                                    selectedRegions.has(reg.meta.ID)
                                        ? selectedRegions.get(reg.meta.ID)!
                                        : fromRegion?.meta.ID === reg.meta.ID || toRegion?.meta.ID === reg.meta.ID
                                }
                                onClick={handleRegionClicked}
                                onCellClicked={handleCellClicked}
                    />
                ))}
            </Canvas>
        </>
    )
}