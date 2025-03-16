class level extends base_level {
    // ...existing code...
    constructor(...args) {
        super(...args);
        this.size = 9;
        this.grid = [];
        this.functions.harvest = this.harvest;
        this.functions.clear = this.clear;
        this.functions.plant = this.plant;
        this.functions.measure = this.measure;
        this.tick_cost.harvest = 200;
        this.tick_cost.plant = 200;
        this.tick_cost.measure = 50;
        this.tick_cost.move = 600;
    }

    // Generate a full sudoku solution and then create a puzzle with exactly 17 given numbers.
    clear() {
        const base = 3, side = base * base;
        // helper: shuffle an array
        const shuffle = arr => arr.sort(() => Math.random() - 0.5);

        // generate shuffled indices for rows and columns (swapping inside groups)
        const rBase = [0, 1, 2];
        const rows = [];
        const cols = [];
        // group rows by base groups (0-2,3-5,6-8) and shuffle within groups and shuffle the groups order
        shuffle(rBase).forEach(g => {
            const group = [0, 1, 2].map(r => g * base + r);
            rows.push(...shuffle(group));
        });
        shuffle(rBase).forEach(g => {
            const group = [0, 1, 2].map(c => g * base + c);
            cols.push(...shuffle(group));
        });
        // shuffle numbers 1-9
        const nums = shuffle([...Array(side)].map((_, i) => i + 1));
        // baseline pattern for a valid solution from pattern(r, c) = (base*(r % base) + Math.floor(r/base) + c) % side
        const pattern = (r, c) => (base * (r % base) + Math.floor(r / base) + c) % side;
        const solution = [];
        for (let r = 0; r < side; r++) {
            solution[r] = [];
            for (let c = 0; c < side; c++) {
                solution[r][c] = nums[pattern(rows[r], cols[c])];
            }
        }

        // Select 17 unique positions for givens
        const totalCells = side * side;
        const positions = new Set();
        while (positions.size < 17) {
            positions.add(Math.floor(Math.random() * totalCells));
        }

        // Initialize grid: set given cells with 'snow' and others as 'dirt'
        this.grid = [];
        for (let r = 0; r < side; r++) {
            this.grid[r] = [];
            for (let c = 0; c < side; c++) {
                const tileObj = new tile();
                // default ground and empty tile
                tileObj.ground = 'ice';
                tileObj.plant = null;
                tileObj.stage = null;
                // tileObj.plant = 'number';
                // tileObj.stage = solution[r][c];
                // if the cell is a given, update properties
                if (positions.has(r * side + c)) {
                    tileObj.ground = 'snow';
                    tileObj.plant = 'number';
                    tileObj.stage = solution[r][c];
                }
                this.grid[r][c] = tileObj;
            }
        }

        // add walls for the 3x3 groups
        for (let r = 0; r < side; r++) {
            for (let c = 0; c < side; c++) {
                this.grid[r][c].wall = 'line';
                if (r % base === 0 && r > 0) {
                    this.grid[r][c].walls.West = true;
                }
                if (c % base === 0 && c > 0) {
                    this.grid[r][c].walls.South = true;
                }
            }
        }
        return true;
    }

    // Verifies that the filled grid is a correct sudoku solution.
    // For any non-given tile (ground !== "snow") that conflicts with another tile
    // in its row, column, or 3x3 block, its ground is set to "fall".
    harvest() {
        const side = this.size;
        let valid = true;
        for (let i = 0; i < side; i++) {
            for (let j = 0; j < side; j++) {
                const cell = this.grid[i][j];
                // Skip given positions
                if (cell.ground === "snow") continue;
                if (cell.stage == null) {
                    this.grid[i][j].ground = "fall";
                    valid = false;
                    continue;
                }
                // Check row for conflicts
                for (let col = 0; col < side; col++) {
                    if (col === j) continue;
                    if (this.grid[i][col].stage === cell.stage) {
                        this.grid[i][j].ground = "fall";
                        valid = false;
                        break;
                    }
                }
                if (cell.ground === "fall") continue;
                // Check column for conflicts
                for (let row = 0; row < side; row++) {
                    if (row === i) continue;
                    if (this.grid[row][j].stage === cell.stage) {
                        this.grid[i][j].ground = "fall";
                        valid = false;
                        break;
                    }
                }
                if (cell.ground === "fall") continue;
                // Check 3x3 block for conflicts
                const br = Math.floor(i / 3) * 3;
                const bc = Math.floor(j / 3) * 3;
                for (let r = br; r < br + 3; r++) {
                    for (let c = bc; c < bc + 3; c++) {
                        if (r === i && c === j) continue;
                        if (this.grid[r][c].stage === cell.stage) {
                            this.grid[i][j].ground = "fall";
                            valid = false;
                            break;
                        }
                    }
                    if (cell.ground === "fall") break;
                }
            }
        }
        console.log(valid);
        return valid;
    }

    // Plant a number in the selected cell.
    plant(stage) {
        const [x, y] = this.get_pos();
        if (this.grid[x][y].ground === "snow") return false;
        this.grid[x][y].plant = "number";
        this.grid[x][y].stage = stage;
        return true;
    }

    // Measure the number of filled cells.
    measure() {
        const [x, y] = this.get_pos();
        return this.grid[x][y].stage;
    }
}
