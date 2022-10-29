import {Scorer} from "./Scorer";
import {RegionNode} from "./RegionNode";

export class RegionScorer implements Scorer<RegionNode> {
    computeCost(from: RegionNode, to: RegionNode): number {
        const dX = to.region.X - from.region.X
        const dY = to.region.Y - from.region.Y

        return Math.sqrt((dX * dX) + (dY * dY))
    }
}