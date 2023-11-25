(() => {

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext('2d');
    canvas.width = "1280px";
    canvas.height = "720px";

    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse
        Events = Matter.Events,
        Constraint = Matter.Constraint;

    // create an engine
    var engine = Engine.create({
        gravity: {
            scale: 0
        }
    });

    // create a renderer
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

    var player = Bodies.circle(640, 360, 40, {
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

    // add all of the bodies to the world
    Composite.add(engine.world, [player, wall]);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    const mouse = Mouse.create(render.canvas);

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
        const speed = 8;
        const nvec = Matter.Vector.mult(
            Matter.Vector.normalise(vec),
            speed
        );
        Matter.Body.setVelocity(player, nvec);
    });

    Events.on(render, "afterRender", ({timestamp}) => {
        ctx.fillStyle = "#DDD";
        ctx.strokeStyle = "#777";
        const gun = {
            width: 10,
            height: 30
        };
        
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        const {pos, rot, aimDir} = aimInfo();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(rot);
        ctx.fillRect(-gun.width/2, -gun.height/2, gun.width, gun.height);
        ctx.lineWidth = 2;
        ctx.strokeRect(-gun.width/2, -gun.height/2, gun.width, gun.height);
        ctx.rotate(-rot);
        ctx.translate(-pos.x, -pos.y);

        const pt = rayCast(
            Matter.Vector.add(
                pos,
                Matter.Vector.mult(aimDir, 15)
            ), 
            aimDir
        );
        if (pt) {
            ctx.fillStyle = "green";
            ctx.fillRect(pt.x - 5, pt.y - 5, 10, 10);
        }
    });

    //
    // Helpers
    //
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
        const m = mouse.position;
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
            const pos = mouse.position;
            //console.log(pos)
        });
        window.addEventListener("mousemove", e => {

        });        
    }

})();