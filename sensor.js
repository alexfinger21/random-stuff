class Sensor {
    constructor(car, rayCount = 5, rayLength = 100) {

        this.car = car
        this.rayCount = rayCount
        this.rayLength = rayLength
        this.raySpread = Math.PI/2 //45 deg

        this.rays = []
        this.readings = []
    }

    #castRays() {
        this.rays = []

        for (let i = 0; i<this.rayCount; i++) {

            const rayAngle = lerp(-this.raySpread/2, 
                this.raySpread/2,
                this.rayCount == 1 ? 0.5 : i/(this.rayCount - 1)
            ) + this.car.angle

            const start = {x: this.car.x, y: this.car.y}
            //we subtrtact math.sin and math.cos because to move up you have to subtract and to move to the left you have to subtract (the angle increments when turning to the left)
            const end = {x: this.car.x - Math.sin(rayAngle) * this.rayLength, y: this.car.y - Math.cos(rayAngle) * this.rayLength}

            this.rays.push([start, end])
        }
    }

    #getReading(ray, roadBorders, traffic) {
        let touches = []

        for (let i = 0; i<roadBorders.length; i++) {
            const touch = getIntersection( //ray[0] is the beginning of the ray while ray[1] is the ending of the ray
                ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]
            )

            if (touch) {
                touches.push(touch)
            }
        }

        for (let i = 0; i<traffic.length; i++) {
            const poly = traffic[i].polygon

            for (let j = 0; j<poly.length; j++) {
                const touch = getIntersection(
                    ray[0], ray[1], poly[j], poly[(j+1) % poly.length]
                )

                if (touch) {
                    touches.push(touch)
                }
            }
        }

        if (touches.length == 0) {
            return null
        } else {
               
            const offsets = touches.map(e => e.offset) //e is the element, and it goes through all the elements 
            const minOffset = Math.min(...offsets) //... unpacks the array
            return  touches.find(e => e.offset == minOffset)
        }
    }

    update(roadBorders, traffic) {
        this.#castRays()
        this.readings = []

        for (let i = 0; i<this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffic)
            )
        }
    }

    draw(ctx) {
        for (let i = 0; i<this.rayCount; i++) {

            let end = this.rays[i][1]

            if (this.readings[i]) {
                end = this.readings[i]
            }

            //where the actual line reaches
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = "blue"
            
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            )
            
            ctx.lineTo(
                end.x,
                end.y
            )

            ctx.stroke()

            //additional line that shows the whole ray
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = "yellow"
            
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            )
            
            ctx.lineTo(
                end.x,
                end.y
            )

            ctx.stroke()

        }
    }
}