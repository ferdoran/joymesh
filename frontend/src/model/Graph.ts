import {GraphNode} from "./GraphNode"

export class Graph<T extends GraphNode> {
    readonly nodes: Set<T> = new Set()
    readonly edges: Map<number, Set<number>> = new Map()

    constructor(nodes: Set<T>, edges: Map<number, Set<number>>) {
        this.nodes = nodes;
        this.edges = edges;
    }

    getNode(id: number): T | undefined {
        return Array.from(this.nodes).find(n => n.getId() === id)!
    }

    getConnectedNodes(node: T): Set<T> {
        if (!this.edges.has(node.getId())) return new Set()
        const set = new Set<T>()
        const edges = this.edges.get(node.getId())!
        Array.from(edges)
            .map(e => this.getNode(e))
            .forEach(n => set.add(n!))

        if (set.size === 0) {
            console.debug(`no connected nodes found for ${node.getId()}`, this.nodes.size)
        }
        return set
    }
}