export interface GraphNode {
    getId(): number
    equals(other: GraphNode): boolean
}