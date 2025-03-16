// Example of a class that extends base_level
class level extends base_level {
    // Extend the base_level constructor
    constructor(...args) {
        super(...args);
        this.score = 0;
        this.constants.score = this.get_score();
        this.functions.harvest = this.harvest;
        this.functions.swap = this.swap;
        this.functions.get_score = this.get_score;
        this.functions.measure = this.measure;
        this.size = 10;
    }

    measure(direction) {
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
        }
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            return false;
        }
        return this.grid[x][y].stage;
    }

    get_score() {
        return this.score;
    }
    // Replacing the clear function with one that generates a 10x10 grid of tiles with random stage 0-9, ground set to 'dirt', and plant set to 'cactus'.
    clear() {
        this.grid = [];
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                const newTile = new tile();
                newTile.stage = Math.floor(Math.random() * 10);
                newTile.ground = 'dirt';
                newTile.plant = 'numbers';
                this.grid[i][j] = newTile;
            }
        }
    }

    swap(direction) {
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
        }
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            return false;
        }
        const temp = this.grid[x][y];
        this.grid[x][y] = this.grid[this.player.x][this.player.y];
        this.grid[this.player.x][this.player.y] = temp;
        return true;
    }
    // New harvest function that propagates all correctly sorted cacti.
    // It selects inner grid tiles with a 'cactus' plant, sorts them by their stage in ascending order,
    // and for each cactus, it propagates (plants a new cactus with a random stage)
    // into any adjacent tile that is empty.
    harvest() {
        this.visited = Array.from({ length: this.size }, () => Array(this.size).fill(false));
        this._harvest(this.player.x, this.player.y);
    }

    _harvest(x,y) {
        const current_stage = this.grid[x][y].stage;
        this.visited[x][y] = true;
        // north tile bigger or equal
        if (y + 1 < this.size && current_stage <= this.grid[x][y + 1].stage && !this.visited[x][y + 1]) {
            this._harvest(x, y + 1);
            this.score++;
        }
        // south tile smaller or equal
        if (y - 1 >= 0 && current_stage >= this.grid[x][y - 1].stage && !this.visited[x][y - 1]) {
            this._harvest(x, y - 1);
            this.score++;
        }
        // east tile bigger or equal
        if (x + 1 < this.size && current_stage <= this.grid[x + 1][y].stage && !this.visited[x + 1][y]) {
            this._harvest(x + 1, y);
            this.score++;
        }
        // west tile smaller or equal
        if (x - 1 >= 0 && current_stage >= this.grid[x - 1][y].stage && !this.visited[x - 1][y]) {
            this._harvest(x - 1, y);
            this.score++;
        }
        this.grid[x][y].plant = null;
        this.grid[x][y].stage = null;
    }
}
