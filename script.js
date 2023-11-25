(() => {

    // Constants
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext('2d');
    canvas.width = "1280px";
    canvas.height = "720px";
    const MOVE_SPEED = 8;
    const center = {
        x: 1280/2,
        y: 720/2
    };

    // Module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse
        Events = Matter.Events,
        Constraint = Matter.Constraint;

    // Engine
    var engine = Engine.create({
        gravity: {
            scale: 0
        }
    });

    // Renderer
    var render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: 1280,
            height: 720,
            wireframes: false,
            background: 'transparent'
        }
    });

    // Bodies
    var player = Bodies.circle(center.x, center.y, 40, {
        render: {
            fillStyle: '#DDD',
            strokeStyle: '#777', 
            lineWidth: 4
        }
    });
    var wall = Bodies.rectangle(400, 200, 80, 80, { 
        isStatic: true,
        render: {
            fillStyle: '#AAA',
            strokeStyle: '#777', 
            lineWidth: 4
        }
    });

    // Add Bodies to world
    Composite.add(engine.world, [player, wall]);

    // Run Renderer
    Render.run(render);

    // Runner
    var runner = Runner.create();

    // Run Engine
    Runner.run(runner, engine);

    // Track
    let offset = {
        x: center.x,
        y: center.y
    };

    const keys = {
        'up': false,
        'right': false,
        'down': false,
        'left': false,
        'action': false
    };
    listenForKeys();

    Events.on(runner, "tick", ({timestamp}) => {
        const vec = Matter.Vector.create(0, 0);
        if (keys['up']) {
            vec.y = -1;
        }
        if (keys['right']) {
            vec.x = 1;
        }
        if (keys['down']) {
            vec.y = 1;
        }
        if (keys['left']) {
            vec.x = -1;
        }
        const nvec = Matter.Vector.mult(
            Matter.Vector.normalise(vec),
            MOVE_SPEED
        );
        Matter.Body.setVelocity(player, nvec);
    });

    Events.on(render, "beforeRender", ({timestamp}) => {
        // Camera
        ctx.translate(
            offset.x - player.position.x, 
            offset.y - player.position.y
        );
        offset = {
            x: player.position.x,
            y: player.position.y
        };
    });

    Events.on(render, "afterRender", ({timestamp}) => {
        ctx.fillStyle = "#DDD";
        ctx.strokeStyle = "#777";
        ctx.lineWidth = 2;

        const gun = {
            width: 10,
            height: 30
        };

        const {pos, rot, aimDir} = aimInfo();
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(rot);
        
        ctx.fillRect(-gun.width/2, -gun.height/2, gun.width, gun.height);
        ctx.strokeRect(-gun.width/2, -gun.height/2, gun.width, gun.height);
        ctx.restore();

        const pt = rayCast(
            Matter.Vector.add(
                pos,
                Matter.Vector.mult(aimDir, gun.height/2)
            ), 
            aimDir
        );

        // Debug paint target
        if (pt) {
            ctx.fillStyle = "green";
            ctx.fillRect(pt.x - gun.width/2, pt.y - gun.width/2, gun.width, gun.width);
        }
    });

    //
    // Helpers
    //
    const m = Mouse.create(render.canvas);
    function mouse() {
        const offset = {
            x: player.position.x - center.x,
            y: player.position.y - center.y
        }
        return {
            x: m.position.x + offset.x,
            y: m.position.y + offset.y
        };
    }
    function rayCast(startPoint, normal) {
        const DIST = 1500;
        let lo = 0;
        let hi = DIST;
        let mi = (lo + hi)/2;

        const check = (delta) => {
            const coll = Matter.Query.ray([wall], startPoint, 
                Matter.Vector.add(
                    startPoint,
                    Matter.Vector.mult(normal, delta)
                )
            );
            return coll.length > 0;
        };

        if (!check(DIST)) {
            return null;
        }

        while (lo < hi) {
            mi = (lo + hi)/2;
            if(check(mi)) {
                hi = mi - 1;
            } else {
                lo = mi + 1;
            }
        }
        return Matter.Vector.add(
            startPoint,
            Matter.Vector.mult(normal, mi)
        );
    }
    function aimInfo() {
        const m = mouse();
        const p = player.position;
        const vec = Matter.Vector.sub(m, p);
        const angle = Math.atan2(vec.y, vec.x);
        const rad = player.circleRadius;
        return {
            pos: Matter.Vector.add(
                p,
                Matter.Vector.create(
                    rad * Math.cos(angle),
                    rad * Math.sin(angle),
                )
            ),
            rot: angle + Math.PI/2,
            aimDir: Matter.Vector.normalise(Matter.Vector.sub(m, p))
        };
    }
    function listenForKeys() {
        const lookup = {
            "ArrowUp": "up",
            "ArrowRight": "right",
            "ArrowDown": "down",
            "ArrowLeft": "left",
            "KeyW": "up",
            "KeyD": "right",
            "KeyS": "down",
            "KeyA": "left",
            " ": "action",
            "Enter": "action"
        };
        window.addEventListener("keydown", e => {
            keys[lookup[e.code]] = true;
        });
        window.addEventListener("keyup", e => {
            keys[lookup[e.code]] = false;
        });
        window.addEventListener("mousedown", e => {
            const pos = mouse();
            //console.log(pos)
        });
        window.addEventListener("mousemove", e => {

        });        
    }

})();