function path() {

    const WIDTH  = 40;
    const HEIGHT = 20;

    const grid = (() => {
        const grid = {};
        for (let h = 0; h < HEIGHT; h++) {
            for (let w = 0; w < WIDTH; w++) {
                grid[hash({x: w, y: h})] = true;
            }
        }
        return grid;
    })();

    const {union, find} = union_find();
    
    function path(grid) {
        const doors = (() => {
            const doors = [];
            for (let h = 0; h < HEIGHT; h++) {
                for (let w = 0; w < WIDTH; w++) {
                    if ((h % 2 === 0) && (w % 2 === 1)) {
                        doors.push(hash({x: w, y: h}));

                    } else if ((h % 2 === 1) && (w % 2 === 0)) {
                        doors.push(hash({x: w, y: h}));

                    }
                }
            }
            return doors.sort((a, b) => {
                return Math.random() < 0.5 ? -1 : 1;
            });
        })();

        for (let door of doors) {
            const {room_a, room_b} = getRooms(door);
            if (find(room_a) !== find(room_b)) {
                union(room_a, room_b);
                grid[door] = false;
            }
        }
    }

    path(grid);
    
    // Render
    function render() {
        let show = [];
        for (let h = 0; h < HEIGHT; h++) {
            const row = [];
            for (let w = 0; w < WIDTH; w++) {

                if ((h % 2 === 0) && (w % 2 === 0)) {
                    row.push("#");
    
                } else if (((h - 1) % 2 === 0) && ((w - 1) % 2 === 0)) {
                    row.push(" ");

                } else {
                    const grid_value = grid[hash({x: w, y: h})];
                    if (grid_value) {
                        const type = (h % 2 === 0) ? 1 : 2; 
                        row.push("#");
                    } else {
                        row.push(" ");
                    }
                }

            }
            show.push(row);
        }
    
        show = show.map(row => row.join(""));
        console.log(show.join("\n"));
    }
    render();

    return {grid, width: WIDTH, height: HEIGHT, hash};

    function mod(n, m) {
        const a = n % m;
        return (a < 0) ? a + m : a;
    }
    function hash(item) {
        return JSON.stringify(item);
    }
    function unhash(itemHash) {
        return JSON.parse(itemHash);
    }
    function getRooms(door) {
        const {x: dx, y: dy} = unhash(door);
        if (dy % 2 === 0) {
            return {
                room_a: hash({x: dx, y: mod(dy - 1, HEIGHT)}),
                room_b: hash({x: dx, y: mod(dy + 1, HEIGHT)})
            };

        } else {
            return {
                room_a: hash({x: mod(dx - 1, WIDTH), y: dy}),
                room_b: hash({x: mod(dx + 1, WIDTH), y: dy})
            };

        }
    }
    function union_find() {
        const rooms = {};
        
        for (let h = 0; h < HEIGHT; h++) {
            for (let w = 0; w < WIDTH; w++) {
                if (((h - 1) % 2 === 0) && ((w - 1) % 2 === 0)) {
                    const hh = hash({x: w, y: h});
                    rooms[hh] = hh;
                }
            }
        }

        function union(a, b) {
            const g1 = find(a);
            const g2 = find(b);
            rooms[g1] = g2;
        }
        function find(a) {
            let g = a;
            while (rooms[g] != g) {
                g = rooms[g];
            }
            rooms[a] = g;
            return g;
        }

        function test() {
            for (let i = 0; i < 10; i++) {
                rooms[i] = i;
            }
            console.log(find(0));
            console.log(find(4));

            union(0, 2);
            union(0, 4);
            union(4, 6);
            
            union(1, 3);
            union(3, 5);

            console.log(find(4));
            console.log(find(1));

            union(0, 5);

            console.log("here");
            for (let i = 0; i < 10; i++) {
                console.log(find(i));
            }
        }
        //test();
        //return {union: () => {}, find: () => {}};
        return {union, find};
    }
}
path();