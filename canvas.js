class Canvas {
    constructor(canvasid, width, height, backgroundColor) {
        this.canvas = document.getElementById(canvasid);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.height = height;
        this.canvas.width = width;
        this.height =  this.canvas.height;
        this.width = this.canvas.width;
        this.middle = new Vector2d(this.canvas.width / 2, this.canvas.height / 2);
        this.backgroundColor = backgroundColor;
        
    }
    clear() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.strokeStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.height);
        this.ctx.strokeRect(0, 0, this.canvas.width, this.height);

    }
    loop(shouldClear, callback = null) {
        const self = this;
        function animate() {
            if (shouldClear) {
                self.clear();
            }
            if (callback) {
                callback();
            }
            requestAnimationFrame(animate);
        }
        animate();
    }
}




