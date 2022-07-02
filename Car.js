class Car {
    constructor (x, y, width, height, controlType, topSpeed = 3) {

        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.speed = 0
        this.acceleration = 0.2
        this.topSpeed = topSpeed
        this.frictionFactor = 0.05
        this.angle = 0
        this.damaged = false

        this.useBrain = controlType == "AI"

        if (controlType !== "DUMMY") {
            this.sensor = new Sensor(this)
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4])
        }

        this.controls = new Controls(controlType)
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

        //positive angle increments to the left
        this.x -= Math.sin(this.angle) * this.speed
        this.y -= Math.cos(this.angle) * this.speed
    }

    #createPolygon(vertices = 4) {
        const points = [] //1:10:00
        const rad = Math.sqrt(Math.pow((this.width/2), 2) + Math.pow((this.height/2), 2))
        const alpha = Math.asin(this.width/2/rad)

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad, //Right-upper angle, 
            y: this.y - Math.cos(this.angle - alpha) * rad
        })

        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad, //Left-upper angle, 
            y: this.y - Math.cos(this.angle + alpha) * rad
        })

        points.push({
            x: this.x + Math.sin(this.angle - alpha) * rad, //left-lower angle, 
            y: this.y + Math.cos(this.angle - alpha) * rad
        })

        points.push({
            x: this.x + Math.sin(this.angle + alpha) * rad, //Right-lower angle, 
            y: this.y + Math.cos(this.angle + alpha) * rad
        })

        return points
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i<roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true
            }
        }

        for (let i = 0; i<traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true
            }
        }

        return false
    }

    update(roadBorders, traffic) {

        if (!this.damaged) {
            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assessDamage(roadBorders, traffic)
        }

        if (this.sensor) { 

            this.sensor.update(roadBorders, traffic)
            const offsets = this.sensor.readings.map(s => s == null ? 0 : 1-s.offset) //reversing offset so if the car is close the value will be closer to 1
            const outputs = NeuralNetwork.feedForward(offsets, this.brain)
            //console.log(outputs)

            if (this.useBrain) {
                this.controls.forward = outputs[0]
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.reverse = outputs[3]
            }
        }
    }
    //ctx is the context we're drawing the car in
    draw(ctx, color = "orange",drawSensors = false) {
        
        if (this.damaged) {
            ctx.fillStyle = "gray"
        } else {
            //ctx.fillStyle = "black" //we don't need this b/c ctx resets every time we run ctx.restore
            ctx.fillStyle = color
        }

        const img = new Image()
        img.src = "./img/mustang top down.png"

        //console.log(this.height)

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle)

        ctx.drawImage(img,-this.width/2, -this.height/2, this.width, this.height);
        
        /*
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)

        for (let i = 1; i<this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }

        ctx.fill()
        */

        ctx.restore()

        if (this.sensor && drawSensors) {
            this.sensor.draw(ctx)
        }
    }
}