import {GraphNode} from "./GraphNode";
import {Region, RegionCell} from "../api/ApiClient";

export class CellNode implements GraphNode {
    cell: RegionCell
    region: Region

    constructor(cell: RegionCell, region: Region) {
        this.cell = cell;
        this.region = region;
    }

    equals(other: GraphNode): boolean {
        return this.getId() === other.getId()
    }

    getId(): number {
        return szudzikPairSigned(this.region.ID, this.cell.id)
    }

}

export function szudzikPair(a: number, b: number): number {
    return (a >= b ? (a * a) + a + b : (b * b) + a)
}

export function szudzikPairSigned(x: number, y: number): number {
    const a = (x >= 0.0 ? 2.0 * x : (-2.0 * x) - 1.0)
    const b = (y >= 0.0 ? 2.0 * y : (-2.0 * y) - 1.0)
    return szudzikPair(a, b) * .5
}