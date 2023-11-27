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
            //console.log(door);
            //console.log(room_a);
            //console.log(room_b);
            //console.log("");
            
            //console.log(find(room_a), find(room_b));
            //console.log("");

            if (find(room_a) !== find(room_b)) {
                union(room_a, room_b);
                doors[door] = true;
            }
        }
    }

    path(doors);
    
    // Render
    function render() {
        let show = [];
        for (let h = 0; h < 2 * HEIGHT; h++) {
            const row = [];
            for (let w = 0; w < 2 * WIDTH; w++) {
                if ((h % 2 === 0) && (w % 2 === 0)) {
                    row.push("#");
    
                } else if (h % 2 === 1 && (w % 2 === 1)) {
                    row.push(" ");
    
                } else {
                    const ww = Math.floor(w/2);
                    const hh = Math.floor((h - 1)/2);
                    if (doors[hash({x: ww, y: hh})]) {
                        row.push(" ");
        
                    } else {
                        row.push("#");
                    }
                }
            }
            show.push(row);
        }
    
        show = show.map(row => row.join(""));
        console.log(show.join("\n"));
    }
    render();
    //console.log(find(hash({x: WIDTH - 2, y: HEIGHT - 2})));
    //console.log(find(hash({x: 2, y: 2})));

    return {doors, width: WIDTH, height: HEIGHT, hash};

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
        if (dy % 2 === 0) {
            const ddy = Math.floor(dy/2.0);
            const r1y = mod(ddy - 1, HEIGHT/2);
            const r2y = mod(ddy, HEIGHT/2);
            return {
                room_a: hash({x: dx, y: r1y}),
                room_b: hash({x: dx, y: r2y})
            };

        } else {
            const ddy = Math.floor((dy - 1)/2.0);
            const r1x = mod(dx - 1, WIDTH/2);
            const r2x = mod(dx, WIDTH/2);
            return {
                room_a: hash({x: r1x, y: ddy}),
                room_b: hash({x: r2x, y: ddy})
            };

        }
    }
    function union_find() {
        const rooms = {}; // Rooms point to group they are in
        
        for (let h = 0; h < HEIGHT/2; h++) {
            for (let w = 0; w < WIDTH/2; w++) {
                const hh = hash({x: w, y: h});
                rooms[hh] = hh;
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