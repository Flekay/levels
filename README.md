# Flekay Custom Levels

This repository contains custom levels for Flekay. Each level provides unique gameplay mechanics and challenges.

## Creating a Custom Level

To create a custom level, follow these guidelines:

### Basic Structure

Create a new JavaScript file in the `levels/level` directory. You can extend `base_level` for easier development, but it's not required:

```javascript
class level extends base_level {
    constructor(...args) {
        super(...args);

        // Set up level properties
        this.size = 10; // Grid size

        // Register custom functions
        this.functions.myCustomFunction = this.myCustomFunction;

        // Set tick costs for operations
        this.tick_cost.myCustomFunction = 200;

        // Define constants
        this.constants.myConstant = "value";
    }

    // Required: clear function to initialize/reset the level
    clear() {
        // Create grid and set initial state
        this.grid = [];
        for (let y = 0; y < this.size; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.size; x++) {
                const tileObj = new tile();
                tileObj.ground = 'dirt';
                this.grid[y][x] = tileObj;
            }
        }

        // Reset player position
        this.player.x = 0;
        this.player.y = 0;

        return true;
    }

    // Custom functions
    myCustomFunction() {
        // Implement custom behavior
        return true;
    }
}
```

### Key Components

1. **Constructor**: Initialize your level with properties, register functions, set tick costs, and define constants.
2. **Functions Registry**: Add custom functions to `this.functions` to make them accessible.
3. **Tick Costs**: Define the cost of operations with `this.tick_cost`.
4. **Constants**: Define level-specific constants with `this.constants`.
5. **Clear Method**: Required - Initializes and resets the level.
6. **Grid**: Use the 2D array `this.grid` to store your level's tiles. Note that once initialized, you cannot change the grid's size, but you can assign new tiles to reset it.

### Tile Properties

Each tile can have the following properties:
- `ground`: The ground type ('dirt', 'grass', 'snow', 'ice', 'sand', etc.)
- `plant`: The plant/object on the tile ('number', 'tree', 'cauliflower', etc.)
- `stage`: Numeric value for growth stages or other state
- `walls`: Object defining walls in cardinal directions

### Inventory Management

The level has access to an inventory system to track items:

```javascript
// Initialize in constructor
// not needed if extending base_level or not using inventory
this.inventory = new InventoryManager();

// Add items to inventory
this.inventory.addItem('cauliflower', 0, 1); // (itemName, itemProperty, quantity)

// Check item count
const count = this.inventory.getItemCount('cauliflower', 0);
```

### Examples

Check the existing levels for examples of different mechanics:
- `sudoku.js`: Number puzzle with validation
- `minesweeper.js`: Classic minesweeper gameplay
- `maze.js`: Procedurally generated maze with treasure
- `fillomino.js`: Number-based region-filling puzzle
- `cactus.js`: Tile swapping and scoring mechanics
- `atomic.js`: Bomberman-style gameplay

## Contributing

To contribute your level:
1. Create your level file following the guidelines above
2. Test thoroughly to ensure it works as expected
3. Submit a pull request or contact the repository owner

## Level Documentation

Consider adding a HTML description file in `level-description/[LANGUAGE]` to explain your level's rules and mechanics to players.
