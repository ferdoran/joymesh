import {GraphNode} from "./GraphNode";
import {Region} from "../api/ApiClient";

export class RegionNode implements GraphNode {
    region: Region

    constructor(region: Region) {
        this.region = region;
    }

    getId(): number {
        return this.region.ID;
    }

    equals(other: GraphNode): boolean {
        return this.getId() === other.getId()
    }
}