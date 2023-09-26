class Ray {
    constructor(stPos, angle) {
        this.startPos = stPos;
        const stpos = this.startPos.copy();
        stpos.add(Vector2d.vecFrom(angle));
        this.endPos = stpos;
        this.color = "rgba(255, 255, 255, 0.3)";
        this.angle = angle;
    }
    lookAt(pos) {
        const dir = pos.sub(this.startPos);
        dir.setMag(30);
        const stPos = this.startPos.copy();
        stPos.add(dir);
        this.endPos = stPos;
    }
    cast(line) {
        const x1 = this.startPos.x;
        const y1 = this.startPos.y;
        const x2 = this.endPos.x;
        const y2 = this.endPos.y;
        const x3 = line.startPos.x;
        const y3 = line.startPos.y;
        const x4 = line.endPos.x;
        const y4 = line.endPos.y;

        const tNumerator = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
        const uNumerator = (x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2);
        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denominator == 0) {
            return;
        }

        const t = tNumerator/denominator;
        const u = uNumerator/denominator;

        if (u >0 && u <=1 && t > 0) {
            const point = new Vector2d(x3 + u * (x4 - x3), y3 + u * (y4 - y3));
            return point;
        }
    }
    render(ctx) {
        drawLine(this.startPos, this.endPos, ctx, 1, this.color);
    }
}

class Particle {
    constructor(pos, radius, numberOfRays, raysMagnitude) {
        this.angle = 0;
        this.radius = radius;
        this.pos = pos;
        this.color = 'white';
        this.raysMagnitude = raysMagnitude;
        this.rays = [];
        this.fov = 90;
        this.keysPressed = [];
        this.rotationSpeed = 0.01;
        this.speed = 1.0;
        this.resolution = numberOfRays;
        this.initializeRays(numberOfRays);

    }
    initializeRays(numberOfRays) {
        for (let i = radiansToDegrees(this.angle) - this.fov/2; i < radiansToDegrees(this.angle) + this.fov/2; i += this.fov/numberOfRays) {
            let angle = degreesToRadians(i);
            const ray = new Ray(this.pos, angle);
            this.rays.push(ray);
        }
    }
    updateRays(ctx) {
        this.rays.forEach(ray=>{
            const stpos = this.pos.copy();
            const dir = Vector2d.vecFrom(ray.angle);
            dir.setMag(this.raysMagnitude);
            stpos.add(dir);
            ray.endPos = stpos;

            ray.render(ctx);
        })
        

    }
    check(walls, ctx = null) {
        let distances = [];
        this.rays.forEach(ray=>{
            let closestWall = null;
            walls.forEach(wall=>{
                const pt = ray.cast(wall);
                if (pt) {
                    if (!closestWall || closestWall && pt.dist(this.pos) < closestWall.dist(this.pos)) {
                        closestWall = pt;
                    }
                }
            })
            if (closestWall) {
                if (ctx) {
                    drawLine(ray.startPos, closestWall, ctx, 1, ray.color);
                }
                //the dist is being multiplied by the cosine of the subtraction of the angles to correct fisheye effect
                distances.push(closestWall.dist(this.pos) * Math.cos(this.angle - ray.angle));
            }
        })
        return distances;
    }
    render(ctx) {
        drawCircle(this.pos, this.radius, ctx);
        this.updateRays(ctx);
    }
}

class Wall {
    constructor(startPos, endPos, color) {
        this.startPos = startPos;
        this.endPos = endPos;
        this.color = color;
    }

    render(ctx) {
        drawLine(this.startPos, this.endPos, ctx, 1, this.color);
    }
}


function drawLine(stPos, edPos, ctx, thickness, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(stPos.x, stPos.y);
    ctx.lineTo(edPos.x, edPos.y);
    ctx.stroke();
}
function drawCircle(position, radius, ctx) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2*Math.PI);
    ctx.fill(); // Fill the circle
    ctx.stroke(); // Add a border
}
  

function generateWalls(quantity, list) {
    for (let i = 0; i < quantity; i++) {
        const wall = new Wall(Vector2d.randomPos(canvas), Vector2d.randomPos(canvas), 'white');
        list.push(wall);
    }
    //create walls for the edges of the canvas
    const wall1 = new Wall(new Vector2d(0, 0), new Vector2d(canvas.width, 0), 'black');
    const wall2 = new Wall(new Vector2d(canvas.width, 0), new Vector2d(canvas.width, canvas.height), 'black');
    const wall3 = new Wall(new Vector2d(canvas.width, canvas.height), new Vector2d(0, canvas.height), 'black');
    const wall4 = new Wall(new Vector2d(0, canvas.height), new Vector2d(0, 0), 'black');
    list.push(wall1, wall2, wall3, wall4);
}



const screenWidth = window.innerWidth; //get the screen size;
const screenHeight = window.innerHeight;
const canvasWidth = screenWidth/2.4;//arbitrary value so that its close to 800 of size in all computers screens sizes;
const canvasHeight = canvasWidth; //make it so that it's a square


const canvas = new Canvas("canvas1", canvasWidth, canvasHeight, "black");
const particle = new Particle(Vector2d.randomPos(canvas), 1, 360, 1);
const walls = [];

generateWalls(4, walls);
canvas.loop(true, ()=>{   
    if (particle.keysPressed.includes('w')) {
        const dir = Vector2d.vecFrom(particle.angle);
        dir.setMag(particle.speed);
        particle.pos.add(dir);
    }
    if (particle.keysPressed.includes('a')) {
        particle.angle -= particle.rotationSpeed;
        particle.rays.forEach(ray=>{
            ray.angle -= particle.rotationSpeed;
        })
    }
    if (particle.keysPressed.includes('d')) {
        particle.angle += particle.rotationSpeed;
        particle.rays.forEach(ray=>{
            ray.angle += particle.rotationSpeed;
        })
    }
    if (particle.keysPressed.includes('ArrowRight')) {
        const facingDir = Vector2d.vecFrom(particle.angle);
        const dir = Vector2d.getPerpendicularDirection(facingDir);
        dir.setMag(particle.speed);
        particle.pos.add(dir);
    }
    if (particle.keysPressed.includes('ArrowLeft')) {
        const facingDir = Vector2d.vecFrom(particle.angle);
        const dir = Vector2d.getPerpendicularDirection(facingDir);
        dir.setMag(particle.speed);
        particle.pos.sub(dir);
    }

    walls.forEach(wall=>{
        wall.render(canvas.ctx);
    })
    particle.render(canvas.ctx);
    particle.check(walls, canvas.ctx);

    
})

document.addEventListener('keydown', (e)=>{
    if (e.key == 'a' && !particle.keysPressed.includes(e.key)) {
       particle.keysPressed.push(e.key)
    }
    if (e.key == 'd' && !particle.keysPressed.includes(e.key)) {
        particle.keysPressed.push(e.key)
    }
    if (e.key == "w" && !particle.keysPressed.includes(e.key)) {
        particle.keysPressed.push(e.key)
    }
    if (e.key == "ArrowLeft" && !particle.keysPressed.includes(e.key)) {
        particle.keysPressed.push(e.key);
    }
    if (e.key == "ArrowRight" && !particle.keysPressed.includes(e.key)) {
        particle.keysPressed.push(e.key);
    }
})
document.addEventListener('keyup', (e)=>{
    if (particle.keysPressed.includes(e.key)) {
        const index = particle.keysPressed.indexOf(e.key);
        particle.keysPressed.splice(index, 1);
    }
})

const canvas2 = new Canvas("canvas2", canvasWidth, canvasHeight, "black");
const canvas2ctx = canvas2.ctx;
const canvasSlices = particle.fov;
const smoothingValue = 3;
function renderSlices3d(xPos, color, width, height) {
    canvas2ctx.save();
    canvas2ctx.translate(xPos, canvas2.middle.y);
    canvas2ctx.fillStyle = color;
    canvas2ctx.strokeStyle = "transparent"
    canvas2ctx.fillRect(0 - width/2, 0 - height/2, width * smoothingValue, height);
    canvas2ctx.strokeRect(0 - width/2, 0 - height/2, width * smoothingValue, height);
    canvas2ctx.restore();
}

canvas2.loop(true, ()=>{
    // this will return an array with the length of the particle's number of rays with a distance value from the closest walls;
    const wallsDistances = particle.check(walls); //this returns distances recorded from each ray;
    let width = canvas2.width/particle.resolution; //this is the number of rays
    let xPos = 0;
    wallsDistances.forEach(distance=>{  
        const heightScale = 60; //scales the height to correct distance perception, this was chosen arbitrarily by experimenting
        const height = (canvas2.height * heightScale) / distance;
        //mapValue(wallsDistances[wallDistIndex], 0, canvas2.width, canvas2.height, 0);
        const brightness = mapValue(distance, 0, canvas2.width, 1/smoothingValue, 0);
        const sliceColor = `rgba(255, 255, 255, ${brightness})`;
        renderSlices3d(xPos, sliceColor, width, height);
        xPos += width;
    })

});

function updateResolution(newResolution) {
    particle.rays = []
    particle.resolution = newResolution;
    particle.initializeRays(newResolution); // Reinitialize rays with the new resolution
}

//update html elements value and resolution according to slider
const resolutionLabel = document.getElementById('resVal');
const slider = document.querySelector('input');
resolutionLabel.innerHTML = particle.resolution;
slider.value = particle.resolution;

slider.addEventListener("input", ()=>{
    resolutionLabel.innerHTML = slider.value;
    updateResolution(slider.value);
});
resolutionLabel.innerHTML = particle.resolution;

