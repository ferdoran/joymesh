import {Graph} from "./Graph";
import {Scorer} from "./Scorer";
import {GraphNode} from "./GraphNode";
import {getRouteNodeComparator, RouteNode} from "./RouteNode";
import PriorityQueue from "priorityqueuejs";

export class RouteFinder<T extends GraphNode> {
    private readonly graph: Graph<T>
    private readonly nextNodeScorer: Scorer<T>
    private readonly targetScorer: Scorer<T>

    constructor(graph: Graph<T>, nextNodeScorer: Scorer<T>, targetScorer: Scorer<T>) {
        this.graph = graph;
        this.nextNodeScorer = nextNodeScorer;
        this.targetScorer = targetScorer;
    }

    findRoute(from: T, to: T): T[] {
        const openSet = new PriorityQueue<RouteNode<T>>(getRouteNodeComparator())
        const allNodes = new Map<T, RouteNode<T>>()

        const start = new RouteNode(from, undefined, 0, this.targetScorer.computeCost(from, to))
        openSet.enq(start)
        allNodes.set(from, start)

        while (!openSet.isEmpty()) {
            const next = openSet.deq()
            if (next!.current.equals(to)) {
                let route: T[] = []
                let current = next!
                do {
                    route = [current.current, ...route]
                    current = allNodes.get(current.previous!)!
                } while (current !== undefined)
                return route
            }

            const neighbours = this.graph.getConnectedNodes(next!.current)
            Array.from(neighbours).forEach(connection => {
                    const newScore = next!.routeScore + this.nextNodeScorer.computeCost(next!.current, connection)
                    const nextNode = allNodes.has(connection) ? allNodes.get(connection)! : RouteNode.createEmpty(connection)
                    allNodes.set(connection, nextNode)
                    if (nextNode.routeScore > newScore) {
                        nextNode.previous = next!.current
                        nextNode.routeScore = newScore
                        nextNode.estimatedScore = newScore + this.targetScorer.computeCost(connection, to)
                        openSet.enq(nextNode)
                    }
                })
        }

        throw Error("no route found")
    }
}