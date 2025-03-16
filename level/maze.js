// Example of a class that extends base_level
class level extends base_level {
    // New maze generator using recursive backtracking.
    clear() {
        // Create grid with dimensions: (this.x+2) x (this.y+2)
        const grid = [];
        for (let i = 0; i < this.x + 2; i++) {
            grid[i] = [];
            for (let j = 0; j < this.y + 2; j++) {
                grid[i][j] = new tile();
                // Set border tiles to be empty with no walls.
                if (i === 0 || j === 0 || i === this.x + 1 || j === this.y + 1) {
                    grid[i][j].ground = 'empty';
                    grid[i][j].walls = {};
                } else {
                    // Inner cells get a default ground (for example: 'dirt') and all walls.
                    // grid[i][j].ground = 'dirt';
                    grid[i][j].walls = { North: true, South: true, East: true, West: true };
                }
            }
        }

        // Create a visited array for the inner grid only (indices 0 to this.x-1, 0 to this.y-1)
        const visited = Array.from({ length: this.x }, () => Array(this.y).fill(false));
        const stack = [];

        // Helper to check boundaries for inner cells (1-indexed)
        const inBounds = (x, y) => x >= 1 && y >= 1 && x <= this.x && y <= this.y;
        const directions = [
            { dx: 0, dy: 1, wall: 'North', opp: 'South' },
            { dx: 0, dy: -1,  wall: 'South', opp: 'North' },
            { dx: 1, dy: 0,  wall: 'East',  opp: 'West'  },
            { dx: -1, dy: 0, wall: 'West',  opp: 'East'  }
        ];

        // Start maze generation at (1,1) in grid, mark visited at index (0,0)
        const startX = 1, startY = 1;
        visited[startX - 1][startY - 1] = true;
        stack.push({ x: startX, y: startY });

        while (stack.length) {
            const current = stack[stack.length - 1];
            const cx = current.x, cy = current.y;
            const neighbors = [];

            // List unvisited neighbors in the inner grid.
            directions.forEach(dir => {
                const nx = cx + dir.dx, ny = cy + dir.dy;
                if (inBounds(nx, ny) && !visited[nx - 1][ny - 1]) {
                    neighbors.push({ x: nx, y: ny, dir });
                }
            });

            if (neighbors.length > 0) {
                // Pick a random neighbor.
                const randIndex = Math.floor(Math.random() * neighbors.length);
                const { x: nx, y: ny, dir } = neighbors[randIndex];

                // Remove walls between current and neighbor.
                grid[cx][cy].walls[dir.wall] = false;
                grid[nx][ny].walls[dir.opp] = false;

                // Mark neighbor as visited and add it to the stack.
                visited[nx - 1][ny - 1] = true;
                stack.push({ x: nx, y: ny });
            } else {
                stack.pop();
            }
        }

        // Place one random treasure in the maze (using inner grid coordinates).
        const treasureX = Math.floor(Math.random() * this.x) + 1;
        const treasureY = Math.floor(Math.random() * this.y) + 1;
        grid[treasureX][treasureY].plant = 'treasure';

        grid[3][3].plant = 'tree';
        return grid;
    }
}
