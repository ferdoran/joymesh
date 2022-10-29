import {GraphNode} from "./GraphNode";

export interface Scorer<T extends GraphNode> {
    computeCost: (from: T, to: T) => number
}