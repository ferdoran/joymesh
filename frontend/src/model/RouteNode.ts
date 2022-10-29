import {GraphNode} from "./GraphNode";
import PriorityQueue from "priorityqueuejs";

export class RouteNode<T extends GraphNode> {
    readonly current: T
    previous?: T
    routeScore: number
    estimatedScore: number

    static createEmpty<T extends GraphNode>(current: T): RouteNode<T> {
        return new RouteNode<T>(current, undefined, 1_000_000_000, 1_000_000_000)
    }

    constructor(current: T, previous: T | undefined, routeScore: number, estimatedScore: number) {
        this.current = current
        this.previous = previous
        this.routeScore = routeScore
        this.estimatedScore = estimatedScore
    }

}

export function getRouteNodeComparator<T extends GraphNode>(): PriorityQueue.Comparator<RouteNode<T>> {
    return function (a: RouteNode<T>, b: RouteNode<T>) {
        if (a.estimatedScore > b.estimatedScore) {
            return -1
        } else if (a.estimatedScore < b.estimatedScore) {
            return 1;
        } else {
            return 0;
        }
    }
}
