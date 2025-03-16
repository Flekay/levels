class level extends base_level {
    constructor(...args) {
        super(...args);
        this.size = 16; // set grid size
    }

    // Generate a fillomino puzzle board.
    clear() {
        const grounds = ['snow', 'summer', 'fall', 'ice', 'sand', 'spring'];
        // Initialize grid with new tiles.
        this.grid = [];
        for (let y = 0; y < this.size; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.size; x++) {
                const t = new tile();
                t.assigned = false;
                t.bl = new Set(); // temporary blacklist for unassigned cells
                this.grid[y][x] = t;
            }
        }

        // Allowed region numbers (also representing target sizes)
        const allowedNumbers = [1, 2, 3, 4, 5, 6, 7];
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        // Process each cell; if unassigned, grow a region.
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (!this.grid[y][x].assigned) {
                    // Build initial blacklist from this tile: include any already fixed neighbor numbers.
                    const neighborBlacklist = new Set(this.grid[y][x].bl);
                    for (const [dx, dy] of dirs) {
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                            const nTile = this.grid[ny][nx];
                            if (nTile.assigned && nTile.plant === 'number') {
                                neighborBlacklist.add(nTile.stage);
                            }
                        }
                    }
                    // Determine available numbers for this region.
                    const available = allowedNumbers.filter(n => !neighborBlacklist.has(n));
                    const chosenNumber = available.length > 0
                        ? available[Math.floor(Math.random() * available.length)]
                        : allowedNumbers[Math.floor(Math.random() * allowedNumbers.length)];

                    // Flood-fill to capture as many cells as possible up to chosenNumber.
                    const regionCells = [];
                    const queue = [{ x, y }];
                    this.grid[y][x].assigned = true;
                    regionCells.push({ x, y });
                    while (regionCells.length < chosenNumber && queue.length) {
                        const cell = queue.shift();
                        // Randomize neighbor order.
                        const randomDirs = dirs.slice();
                        for (let i = randomDirs.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [randomDirs[i], randomDirs[j]] = [randomDirs[j], randomDirs[i]];
                        }
                        for (const [dx, dy] of randomDirs) {
                            const nx = cell.x + dx, ny = cell.y + dy;
                            if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                                const nTile = this.grid[ny][nx];
                                if (!nTile.assigned) {
                                    // If this cell’s blacklist forbids the chosenNumber, skip it.
                                    if (nTile.bl && nTile.bl.has(chosenNumber)) continue;
                                    nTile.assigned = true;
                                    regionCells.push({ x: nx, y: ny });
                                    queue.push({ x: nx, y: ny });
                                    if (regionCells.length >= chosenNumber) break;
                                }
                            }
                        }
                    }

                    // Let groupSize be the count captured (it may be less than chosenNumber).
                    let groupSize = regionCells.length;
                    // Recompute neighbor blacklist from already assigned cells (outside this region).
                    const newBlacklist = new Set();
                    for (const cell of regionCells) {
                        for (const [dx, dy] of dirs) {
                            const nx = cell.x + dx, ny = cell.y + dy;
                            if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                                const neighborTile = this.grid[ny][nx];
                                // Only consider tiles not in the current region.
                                if (neighborTile.plant === 'number' &&
                                    !regionCells.find(c => c.x === nx && c.y === ny)) {
                                    newBlacklist.add(neighborTile.stage);
                                }
                            }
                        }
                    }
                    // If groupSize appears among neighbors, pick an alternative if available.
                    if (newBlacklist.has(groupSize)) {
                        const alternative = allowedNumbers.find(n => !newBlacklist.has(n));
                        if (alternative !== undefined) {
                            groupSize = alternative;
                        }
                    }

                    // Assign the final group size to each cell in the region.
                    for (const cell of regionCells) {
                        const t = this.grid[cell.y][cell.x];
                        t.plant = 'number';
                        t.stage = groupSize;
                        t.ground = groupSize === 1 ? 'dirt' : grounds[groupSize - 2];
                    }
                    // Update neighboring unassigned tiles: add groupSize to their blacklist.
                    for (const cell of regionCells) {
                        for (const [dx, dy] of dirs) {
                            const nx = cell.x + dx, ny = cell.y + dy;
                            if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                                const nTile = this.grid[ny][nx];
                                if (!nTile.assigned) {
                                    if (!nTile.bl) nTile.bl = new Set();
                                    nTile.bl.add(groupSize);
                                }
                            }
                        }
                    }
                }
            }
        }

        // Clean up temporary properties.
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                delete this.grid[y][x].assigned;
                delete this.grid[y][x].bl;
            }
        }

        // Reset player position.
        this.player.x = 0;
        this.player.y = 0;
        return true;
    }

    // New function to verify the grid is validly sorted.
    // It checks that each group (connected via the four cardinal directions)
    // of 'number' tiles has a size equal to their stage value.
    verifyGrid() {
        const visited = Array.from({ length: this.size }, () => Array(this.size).fill(false));
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (!visited[y][x] && this.grid[y][x].plant === 'number') {
                    const regionNumber = this.grid[y][x].stage;
                    const queue = [{ x, y }];
                    const regionCells = [];
                    while (queue.length) {
                        const cell = queue.shift();
                        const cx = cell.x, cy = cell.y;
                        if (visited[cy][cx]) continue;
                        visited[cy][cx] = true;
                        regionCells.push({ x: cx, y: cy });
                        for (const [dx, dy] of dirs) {
                            const nx = cx + dx, ny = cy + dy;
                            if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                                if (!visited[ny][nx] &&
                                    this.grid[ny][nx].plant === 'number' &&
                                    this.grid[ny][nx].stage === regionNumber) {
                                    queue.push({ x: nx, y: ny });
                                }
                            }
                        }
                    }
                    if (regionCells.length !== regionNumber) return false;
                }
            }
        }
        return true;
    }
}
