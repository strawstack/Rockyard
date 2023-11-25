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

    // Matter.Vector.create(x, y)
    // Matter.Body.setVelocity(body, velocity)

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

    ctx.fillStyle = "#DDD";
    ctx.strokeStyle = "#777";
    Events.on(render, "afterRender", ({timestamp}) => {
        const pos = player.position;
        const gun = {
            width: 10,
            height: 30,
            offset: {
                x: 0, 
                y: -40
            }
        };
        ctx.fillRect(pos.x - gun.width/2, pos.y - gun.height/2 + gun.offset.y, gun.width, gun.height);
        ctx.lineWidth = 2;
        ctx.strokeRect(pos.x - gun.width/2, pos.y - gun.height/2 + gun.offset.y, gun.width, gun.height);
    });

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
    }

})();