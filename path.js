function path() {

    const WIDTH  = 40;
    const HEIGHT = 20;

     // Doors are true if open
    const doors = (() => {
        const doors = {};
        for (let h = 0; h < HEIGHT; h++) {
            for (let w = 0; w < WIDTH; w++) {
                doors[hash({x: w, y: h})] = false;
            }
        }
        return doors;
    })();

    const {union, find} = union_find();
    
    function path(doors) {
        const door_keys = Object.keys(doors).sort((a, b) => {
            return Math.random() > 0.5 ? -1 : 1;
        });

        for (let door of door_keys) {
            const {room_a, room_b} = getRooms(door);
            // If rooms not connected 
            if (find(room_a) !== find(room_b)) {
                union(room_a, room_b);
                doors[door] = true;
            }
        }
    }

    path(doors);
    
    // Render
    const show = [];
    for (let h = 0; h < 2 * HEIGHT; h++) {
        const row = [];
        for (let w = 0; w < 2 * WIDTH; w++) {
            if ((h % 2 === 0) && (w % 2 === 0)) {
                row.push("#");

            } else if (h % 2 === 1 && (w % 2 === 1)) {
                row.push(" ");
                
            } else {
                const ww = Math.floor(w/2);
                const hh = Math.floor(h/2);
                if (doors[hash({x: ww, y: hh})]) {
                    row.push(" ");
    
                } else {
                    row.push("#");
                }
            }
        }
        show.push(row);
    }
    show.forEach(row => {
        console.log(row.join(""));
    });

    return doors;

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
    function getRooms(door_hash) {
        const {x: dx, y: dy} = unhash(door_hash);
        // If even row
        if ((dy % 2) === 0) {
            const rx = dx;
            const r1y = mod(dy - 1, HEIGHT);
            const r2y = mod(dy + 1, HEIGHT);
            return {
                room_a: hash({x: rx, y: r1y}),
                room_b: hash({x: rx, y: r2y})
            };
        } else {
            const r1x = mod(dx - 1, WIDTH);
            const r2x = mod(dx + 1, WIDTH);
            const ry = dy;
            return {
                room_a: hash({x: r1x, y: ry}),
                room_b: hash({x: r2x, y: ry})
            };
        }
    }
    function union_find() {
        const rooms = {}; // Rooms point to group they are in
        
        for (let h = 0; h < HEIGHT; h++) {
            for (let w = 0; w < WIDTH; w++) {
                const hh = hash({x: w, y: h});
                rooms[hh] = hh;
            }
        }

        function union(a, b) {
            return null;
        }
        function find(a) {
            return null;
        }

        return {
            union,
            find
        };
    }
}
path();