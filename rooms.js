function rooms(Bodies) {

    const WALL_SIZE = {
        short: 24,
        long: 64,
    };

    const walls = [];

    function make_rooms() {

        make(
            (7 * WALL_SIZE.long)/2, 
            WALL_SIZE.short/2,
            7 * WALL_SIZE.long, 
            WALL_SIZE.short
        );

        make(
            (7 * WALL_SIZE.long)/2 + (13 * WALL_SIZE.long), 
            WALL_SIZE.short/2,
            7 * WALL_SIZE.long, 
            WALL_SIZE.short
        );

    }
    make_rooms();

    function make(x, y, width, height) {
        walls.push(
            Bodies.rectangle(x, y, width, height, { 
                isStatic: true,
                render: {
                    fillStyle: '#AAA',
                    strokeStyle: '#777',
                    lineWidth: 1 // Debug only
                }
            })
        );
    }

    return walls;
}