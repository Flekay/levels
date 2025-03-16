class tile {
    constructor() {
        this.plant = null;
        this.stage = 0;
        this.ground = 'grass';
        this.wall = 'fence';
        this.walls = { North: false, South: false, East: false, West: false };
        this.scale = 1;
        this.plantType = 'static'; // static, animated, animal
    }
}
