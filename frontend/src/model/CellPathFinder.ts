import {CellGraph} from "./CellGraph"
import {RouteFinder} from "./RouteFinder";
import {CellNode} from "./CellNode";
import {Region, RegionCell, RegionDetails} from "../api/ApiClient";
import {CellScorer} from "./CellScorer";

export class CellPathFinder {
    private readonly graph: CellGraph
    private pathFinder: RouteFinder<CellNode>

    constructor(regions: RegionDetails[]) {
        this.graph = new CellGraph(regions)
        this.pathFinder = new RouteFinder<CellNode>(
            this.graph,
            new CellScorer(),
            new CellScorer(),
        );
    }

    findPath(from: {cell: RegionCell, region: Region}, to: {cell: RegionCell, region: Region}): CellNode[] {
        const fromNode = new CellNode(from.cell, from.region)
        const toNode = new CellNode(to.cell, to.region)
        return this.pathFinder.findRoute(fromNode, toNode)
    }
}