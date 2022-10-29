import {RegionGraph} from "./RegionGraph";
import {RouteFinder} from "./RouteFinder";
import {RegionDetails} from "../api/ApiClient";
import {RegionScorer} from "./RegionScorer";
import {RegionNode} from "./RegionNode";

export class RegionPathFinder {
    private readonly graph: RegionGraph
    private pathFinder: RouteFinder<RegionNode>

    constructor(regions: RegionDetails[]) {
        this.graph = new RegionGraph(regions)
        this.pathFinder = new RouteFinder<RegionNode>(
            this.graph,
            new RegionScorer(),
            new RegionScorer(),
        );
    }

    findPath(from: RegionDetails, to: RegionDetails): number[] {
        const fromNode = new RegionNode(from.meta)
        const toNode = new RegionNode(to.meta)
        const route = this.pathFinder.findRoute(fromNode, toNode)
        return route.map(gn => gn.region.ID)
    }
}