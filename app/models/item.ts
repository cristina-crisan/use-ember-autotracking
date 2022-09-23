import { tracked } from "tracked-built-ins";

export class Item {
    id: number;
    @tracked value?: string | undefined;
    constructor(id: number) {
        this.id = id;
    }
}