// Example of a class that extends base_level
class level extends base_level {
    // Extend the base_level constructor
    constructor(...args) {
        super(...args);
        this.size = 16;
        this.mines = 40;
        this.mineStage = 1;
        this.remainingNonMines = this.size * this.size - this.mines;
        this.grid = [];
        this.functions.till = this.till;
        this.functions.measure = this.measure;
        this.functions.get_entity_type = this.get_entity_type;
        this.functions.harvest = this.harvest;
        this.constants.cauliflower = 'cauliflower';
        this.tick_cost.till = 400;
        this.tick_cost.measure = 50;
        this.tick_cost.move = 600;
        this.tick_cost.harvest = 800;
        this.tick_cost.get_entity_type = 50;
    }

    get_entity_type() {
        const x = this.player.x;
        const y = this.player.y;
        return this.grid[x][y].plant;
    }

    harvest() {
        const x = this.player.x;
        const y = this.player.y;
        if (this.grid[x][y].plant === 'cauliflower') {
            if (this.remainingNonMines === 0) {
                this.grid[x][y].plant = null;
                this.inventory.addItem('cauliflower', 0, 1);
                return true;
            } else {
                this.grid[x][y].plant = null;
                this.grid[x][y].ground = 'fall';
            }
        }
        return false;
    }

    // Override the clear method to add extra behavior
    clear() {
        this.remainingNonMines = this.size * this.size - this.mines;
        if (this.grid.length > 0) {
            for (let y = 0; y < this.size; y++) {
                for (let x = 0; x < this.size; x++) {
                    this.grid[y][x].ground = 'snow';
                    this.grid[y][x].plant = null;
                    this.grid[y][x].stage = null;
                }
            }
        } else {
            this.grid = [];
            for (let y = 0; y < this.size; y++) {
                this.grid[y] = [];
                for (let x = 0; x < this.size; x++) {
                    const tileObj = new tile();
                    tileObj.ground = 'snow';
                    this.grid[y][x] = tileObj;
                }
            }
        }
        this.player.x = 0;
        this.player.y = 0;
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            // Renamed loop variables to avoid shadowing issues.
            const mineX = Math.floor(Math.random() * this.size);
            const mineY = Math.floor(Math.random() * this.size);

            // Ensure a mine isn't already placed at this position.
            if (!this.grid[mineY][mineX].plant) {
                this.grid[mineY][mineX].plant = 'cauliflower';
                this.grid[mineY][mineX].stage = 1;
                minesPlaced++;
            }
        }
        return true;
    }

    // Helper function to count adjacent mines around a given cell (x, y)
    _countAdjacentMines(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                    if (this.grid[ny][nx].plant === 'cauliflower' || this.grid[ny][nx].ground === 'fall') {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    till() {
        const x = this.player.x;
        const y = this.player.y;
        // If the selected cell is a mine, do not reveal and return false.
        if (this.grid[x][y].plant === 'cauliflower') {
            this.grid[x][y].plant = null;
            this.grid[x][y].ground = 'fall';
            return true;
        }
        const result = this._till(x, y);
        this.updateMineStage();
        return result;
    }

    _changeMinesStage(stage) {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.grid[y][x].plant === 'cauliflower') {
                    this.grid[y][x].stage = stage;
                }
            }
        }
    }

    // New method to update the mine stage based on percentage of opened tiles.
    updateMineStage() {
        const totalOpenable = this.size * this.size - this.mines;
        const opened = totalOpenable - this.remainingNonMines;
        const openPercent = (opened / totalOpenable) * 100;
        let newStage;
        if (this.remainingNonMines === 0) {
            newStage = 0;
        } else if (openPercent < 40) {
            newStage = 1;
        } else if (openPercent < 60) {
            newStage = 2;
        } else if (openPercent < 80) {
            newStage = 3;
        } else {
            newStage = 4;
        }
        if(newStage !== this.mineStage) {
            this.mineStage = newStage;
            this._changeMinesStage(newStage);
        }
    }

    // Propagate till: if the cell is not a mine and has no adjacent mines,
    // recursively reveal its neighbors.
    _till(x = this.player.x, y = this.player.y) {
        // If the cell is out of bounds, return true safely.
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) return true;
        // If the cell is already revealed, skip processing.
        if (this.grid[x][y].ground === 'ice') return true;

        // Reveal the current cell.
        this.grid[x][y].ground = 'ice';
        this.remainingNonMines--;

        // Count adjacent mines and store the count in the tile (optional)
        const adjacentMines = this._countAdjacentMines(y, x);
        // this.grid[x][y].count = adjacentMines; // you can display this count in the UI

        // Plant a numbers plant with correct growth stage if there are adjacent mines.
        if (adjacentMines > 0) {
            this.grid[x][y].plant = 'number';
            this.grid[x][y].stage = adjacentMines;
        }

        // If no adjacent mines, propagate to neighboring cells.
        if (adjacentMines === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                        this._till(nx, ny);
                    }
                }
            }
        }
        return true;
    }

    // move(...args) {
    //     if (this.isDead) return false;
    //     return super.move(...args);
    // }

    measure(direction) {
        let x = this.player.x;
        let y = this.player.y;
        switch (direction) {
            case 'North':
                y++;
                break;
            case 'South':
                y--;
                break;
            case 'East':
                x++;
                break;
            case 'West':
                x--;
                break;
        }

        if (x < 0 || x >= this.size || y < 0 || y >= this.size){
            return null;
        }


        return this.grid[y][x].stage;
    }
}
