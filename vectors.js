class Vector2d {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y
    };
    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y
    };
    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
    }
    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    getDotProduct(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    dist(pos) {
        const dist = new Vector2d(this.x - pos.x, this.y - pos.y);
        return dist.mag();
    }
    normalize() {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (mag != 0) {
            this.x /= mag;
            this.y /= mag;
        }
        
    }
    mag () {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    setMag(magNum) {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        this.x = this.x / mag * magNum;
        this.y = this.y / mag * magNum;
    }
    limit(magLimit) {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (mag > magLimit) {
            this.x = this.x/mag * magLimit;
            this.y = this.y/mag * magLimit;
        }
    }
    copy() {
        return new Vector2d(this.x, this.y);
    }
    setNew(x, y) {
        this.x = x;
        this.y = y;
    }
    rotateV(origin, angle) {
        const dx = this.x - origin.x;
        const dy = this.y - origin.y;
    
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
    
        const rotatedX = cosAngle * dx - sinAngle * dy;
        const rotatedY = sinAngle * dx + cosAngle * dy;
    
        this.setNew(new Vector2d(rotatedX + origin.x, rotatedY + origin.y));
    }
    heading() {
        return Math.atan2(this.y, this.x);
    }
    static randomDir() {
        const x = getRandomInt(-10, 10);
        const y = getRandomInt(-10, 10);
        const dir = new Vector2d(x, y);
        dir.normalize();
        return dir;
    }
    static randomPos(canvas) {
        const x = getRandomInt(10, canvas.width - 10);
        const y = getRandomInt(10, canvas.height - 10);
        return new Vector2d(x, y);
    }
    static vecFrom(angle) {
        return new Vector2d(Math.cos(angle), Math.sin(angle));
    }
    static getPerpendicularDirection(vector) {
        // Ensure the facing direction is normalized
        const normalizedFacingDirection = vector;
        normalizedFacingDirection.normalize();

        // Calculate the perpendicular direction
        const perpendicularDirection = new Vector2d(-normalizedFacingDirection.y, normalizedFacingDirection.x)

    
        return perpendicularDirection;
    }
}


function getRandomInt(min, max) {
    // Generate a random integer between min (inclusive) and max (inclusive)
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function constrain(value, minValue,maxValue) {
    if (value < minValue) {
        return minValue;
    }
    else if (value > maxValue) {
        return maxValue;
    }
    return value;
}

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

function degreesToRadians(degrees) {
    // Formula to convert degrees to radians: radians = degrees * (Math.PI / 180)
    return degrees * (Math.PI / 180);
  }
  
  function getRandomFloatInRange(min, max, decimalPlaces) {
    const randomValue = Math.random() * (max - min) + min;
    return parseFloat(randomValue.toFixed(decimalPlaces));
}

function mapValue(value, start1, stop1, start2, stop2) {
    // Ensure the value is within the input range
    value = Math.min(Math.max(value, start1), stop1);
    
    // Map the value to the output range based on the linear interpolation formula:
    const mappedValue = ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    
    return mappedValue;
}
  

function applyForce(force, target) {
    target.acceleration.add(force);
}