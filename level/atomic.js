// Example of a class that extends base_level
class level extends base_level {
    // Extend the base_level constructor
    constructor(...args) {
        super(...args);
        this.size = 13;
        this.removeBoxes = 13;
        this.grid = [];
        this.isDead = false;
    }

    // Override the clear method to add extra behavior
    clear() {
        this.grid = [];
        this.isDead = false;
        for (let y = 0; y < this.size; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.size; x++) {
                const tileObj = new tile();
                if (x % 2 && y % 2) {
                    tileObj.walls = { North: true, South: true, East: true, West: true };
                    tileObj.ground = 'snow';
                } else {
                    tileObj.ground = 'dirt';
                    tileObj.plant = 'box';
                }
                this.grid[y][x] = tileObj;
            }
        }

        // Spawn player at a random corner
        const spawnPoints = [
            [0, 0],
            [0, this.size - 1],
            [this.size - 1, 0],
            [this.size - 1, this.size - 1]
        ];
        const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
        this.player.x = spawnPoint[0];
        this.player.y = spawnPoint[1];

        // clear all corners
        // bottom left
        this.grid[0][0].plant = null;
        this.grid[1][0].plant = null;
        this.grid[0][1].plant = null;
        // top left
        this.grid[0][this.size - 1].plant = null;
        this.grid[0][this.size - 2].plant = null;
        this.grid[1][this.size - 1].plant = null;
        // bottom right
        this.grid[this.size - 1][0].plant = null;
        this.grid[this.size - 2][0].plant = null;
        this.grid[this.size - 1][1].plant = null;
        // top right
        this.grid[this.size - 1][this.size - 1].plant = null;
        this.grid[this.size - 2][this.size - 1].plant = null;
        this.grid[this.size - 1][this.size - 2].plant = null;

        // remove random boxes
        let boxesRemoved = 0;
        while (boxesRemoved < this.removeBoxes) {
            const boxX = Math.floor(Math.random() * this.size);
            const boxY = Math.floor(Math.random() * this.size);
            if (this.grid[boxY][boxX].plant === 'box') {
                this.grid[boxY][boxX].plant = null;
                boxesRemoved++;
            }
        }

        this.player.bombs = 3;
        this.player.power = 1;
        this.player.speed = 1;
        this.player.isDead = false;

        return true;
    }

    move(...args) {
        if (this.isDead) return false;
        return super.move(...args);
    }

    plant() {
    }
}
