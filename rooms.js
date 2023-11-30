function rooms({width, height}, Bodies) {

    const WALL_SIZE = {
        short: 24,
        long: 64,
    };

    const walls = [];

    function make_rooms() {

        // top
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

        // right
        make(
            width - WALL_SIZE.short/2, 
            (3 * WALL_SIZE.long)/2 + WALL_SIZE.short,
            WALL_SIZE.short,
            3 * WALL_SIZE.long
        );

        make(
            width - WALL_SIZE.short/2, 
            height - (3 * WALL_SIZE.long)/2,
            WALL_SIZE.short,
            3 * WALL_SIZE.long
        );

        // bottom
        make(
            (7 * WALL_SIZE.long)/2, 
            height - WALL_SIZE.short/2,
            7 * WALL_SIZE.long, 
            WALL_SIZE.short
        );

        make(
            (7 * WALL_SIZE.long)/2 + (13 * WALL_SIZE.long), 
            height - WALL_SIZE.short/2,
            7 * WALL_SIZE.long, 
            WALL_SIZE.short
        );

        // left
        make(
            WALL_SIZE.short/2, 
            (3 * WALL_SIZE.long)/2 + WALL_SIZE.short,
            WALL_SIZE.short,
            3 * WALL_SIZE.long
        );

        make(
            WALL_SIZE.short/2, 
            height - (3 * WALL_SIZE.long)/2,
            WALL_SIZE.short,
            3 * WALL_SIZE.long
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