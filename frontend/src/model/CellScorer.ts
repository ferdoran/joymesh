import {Scorer} from "./Scorer";
import {CellNode} from "./CellNode";

export class CellScorer implements Scorer<CellNode> {
    computeCost(from: CellNode, to: CellNode): number {
        const fromX = from.region.X * 1920 + from.cell.min.X
        const fromY = from.region.Y * 1920 + from.cell.min.Y
        const toX = to.region.X * 1920     + to.cell.min.X
        const toY = to.region.Y * 1920     + to.cell.min.Y


        const dx = toX - fromX
        const dy = toY - fromY

        return Math.sqrt(dx * dx + dy * dy)
    }
}