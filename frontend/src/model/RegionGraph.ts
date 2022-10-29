import {Graph} from "./Graph";
import {RegionDetails} from "../api/ApiClient";
import {RegionNode} from "./RegionNode";

export class RegionGraph extends Graph<RegionNode> {
    // TODO include internal cell graph
    constructor(regions: RegionDetails[]) {
        const nodesSet = new Set<RegionNode>()
        const regionMap = new Map<number, RegionNode>()
        regions.map(r => new RegionNode(r.meta))
            .forEach(n => {
                nodesSet.add(n)
                regionMap.set(n.region.ID, n)
            })
        const edges = new Map<number, Set<number>>()

        regions.flatMap(r => r.globalEdges)
            .forEach(ge => {
                if (!regionMap.has(ge.srcRegionId) || !regionMap.has(ge.dstRegionId)) return
                if ((ge.flag & 2) !== 0) return
                if (edges.has(ge.srcRegionId)) {
                    edges.get(ge.srcRegionId)!.add(ge.dstRegionId)
                } else {
                    const s = new Set<number>()
                    s.add(ge.dstRegionId)
                    edges.set(ge.srcRegionId, s)
                }
            })

        super(nodesSet, edges);
    }
}