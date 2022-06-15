class Car {
    constructor (x, y, width, height) {

        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.speed = 0
        this.acceleration = 0.2
        this.topSpeed = 5
        this.frictionFactor = 0.05
        this.angle = 0

        this.sensor = new Sensor(this)
        this.controls = new Controls()
    }

    #move() {

        if (this.controls.forward) {
            this.speed += this.acceleration
        }

        if (this.controls.reverse) {
            this.speed -= this.acceleration
        }
        
        if(this.speed > this.topSpeed) {
            this.speed = this.topSpeed
        }

        if(this.speed < -this.topSpeed/2) {
            this.speed = -this.topSpeed/2
        }

        this.speed -= this.speed * this.frictionFactor

        if (Math.abs(this.speed) <= 0.01) {
            this.speed = 0
        }
        
        if (this.speed != 0) {

            const flip = this.speed >= 0? 1: -1

            if (this.controls.left) {
                this.angle += (0.03 * this.speed/this.topSpeed) * flip
            }
    
            if (this.controls.right) {
                this.angle -= (0.03 * this.speed/this.topSpeed) * flip
            }
        }

        this.x -= Math.sin(this.angle) * this.speed
        this.y -= Math.cos(this.angle) * this.speed
    }

    #createPolygon() {
        const points = []
        const rad = Math.sqrt(Math.pow((this.width/2), 2) + Math.pow((this.height/2), 2))
    }

    update(roadBorders) {
        
        this.#move()
        this.sensor.update(roadBorders)
    }
    //ctx is the context we're drawing the car in
    draw(ctx) {
        
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle)

        ctx.beginPath()
        ctx.rect(
            -this.width/2, //we do this because positions are declared at the top left corner, but the position is originally defined at the middle of the car
            -this.height/2,
            this.width,
            this.height
        )
        ctx.fill()

        ctx.restore()

        this.sensor.draw(ctx)
    }
}