import {Graph} from "./Graph";
import {CellNode, szudzikPairSigned} from "./CellNode";
import {RegionDetails} from "../api/ApiClient";

export class CellGraph extends Graph<CellNode> {
    constructor(regions: RegionDetails[]) {
        const nodes = CellGraph.getCellNodesFromRegions(regions)
        const nodesMap = new Map<number, CellNode>()
        nodes.forEach(n => nodesMap.set(n.getId(), n))

        const edges = CellGraph.getEdgesFromRegions(regions, nodesMap)

        super(nodes, edges);
    }

    private static getCellNodesFromRegions(regions: RegionDetails[]): Set<CellNode> {
        const nodesSet = new Set<CellNode>()

        regions.forEach(r => {
            r.cells.forEach(c => {
                const cn = new CellNode(c, r.meta)
                nodesSet.add(cn)
            })
        })

        return nodesSet
    }

    private static getEdgesFromRegions(regions: RegionDetails[], nodesMap: Map<number, CellNode>): Map<number, Set<number>> {
        const edges = new Map<number, Set<number>>()

        regions.forEach(r => {
            r.internalEdges.forEach(ie => {
                const srcCellId = szudzikPairSigned(r.meta.ID, ie.srcCellId)
                const dstCellId = szudzikPairSigned(r.meta.ID, ie.dstCellId)
                if (!nodesMap.has(srcCellId) || !nodesMap.has(dstCellId)) return
                if ((ie.flag & 2) !== 0) return // blocked
                if (edges.has(srcCellId)) {
                    edges.get(srcCellId)!.add(dstCellId)
                } else {
                    const s = new Set<number>()
                    s.add(dstCellId)
                    edges.set(srcCellId, s)
                }
            })

            r.globalEdges.forEach(ge => {
                const srcCellId = szudzikPairSigned(ge.srcRegionId, ge.srcCellId)
                const dstCellId = szudzikPairSigned(ge.dstRegionId, ge.dstCellId)
                if (!nodesMap.has(srcCellId) || !nodesMap.has(dstCellId)) return
                if ((ge.flag & 2) !== 0) return // blocked
                if (edges.has(srcCellId)) {
                    edges.get(srcCellId)!.add(dstCellId)
                } else {
                    const s = new Set<number>()
                    s.add(dstCellId)
                    edges.set(srcCellId, s)
                }
            })
        })

        return edges
    }
}