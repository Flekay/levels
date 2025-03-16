class base_level {
    constructor() {
        this.player = new Player();
        this.constants = {
            North: "North",
            South: "South",
            East: "East",
            West: "West",
        };
        this.size = 10;
        this.grid = [];
        this.functions = {
            clear: this.clear,
            get_pos: this.get_pos,
            get_world_size: this.get_world_size,
            move: this.move,
            num_items: this.num_items,
        };
        this.tick_cost = {
            clear: 1000,
            get_pos: 50,
            get_world_size: 50,
            move: 200,
        };
        this.inventory = new InventoryManager();
    }

    num_items(item) {
        return this.inventory.getItemCount(item, 0);
    }

    clear() {
        this.grid = Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => new tile()));
        this.player.x = 0;
        this.player.y = 0;
        return true;
    }

    get_world_size() {
        return this.size;
    }

    get_pos() {
        return [this.player.x, this.player.y];
    }

    move(direction) {
        let x = this.player.x;
        let y = this.player.y;
        switch (direction) {
            case this.constants.North:
                y++;
                break;
            case this.constants.South:
                y--;
                break;
            case this.constants.East:
                x++;
                break;
            case this.constants.West:
                x--;
                break;
            default:
                throw new Error("Invalid direction");
        }
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            return false;
        }
        this.player.x = x;
        this.player.y = y;
        return true;
    }
}
