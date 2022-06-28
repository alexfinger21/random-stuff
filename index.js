let carCanvas = document.getElementById("carCanvas")
carCanvas.height = window.innerHeight
carCanvas.width = 200;

let networkCanvas = document.getElementById("networkCanvas")
networkCanvas.height = window.innerHeight

console.log(window.innerWidth)

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

function generateCars(N) {
    let cars = []

    for (let i = 0; i<N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 5))
    }
    
    return cars
}

const road = new Road(carCanvas.width/2, carCanvas.width*0.9)
let cars = generateCars(100)
let traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY")
]

function animate(time) {//time is how much time has passed since the programs started

    bestCar = cars.reduce((a, b) => {best = a.y == Math.min(a.y, b.y) ? a : b; return best})

    /* I could also do:
    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)))
    */
    console.log(bestCar)

    for (let i = 0; i<traffic.length; i++) {
        traffic[i].update(road.borders, [])
    }

    for (i = 0; i<cars.length; i++) {
        cars[i].update(road.borders, traffic)
    }

    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight
    networkCanvas.width = window.innerWidth - carCanvas.width - 5;

    carCtx.save()
    carCtx.translate(0, -bestCar.y + carCanvas.height/1.2)
    road.draw(carCtx)

    for (let i = 0; i<traffic.length; i++) {
        traffic[i].draw(carCtx)
    }

    carCtx.globalAlpha = 0.2

    for (i = 0; i<cars.length; i++) {
        cars[i].draw(carCtx, "red")
    }

    carCtx.globalAlpha = 1
    bestCar.draw(carCtx, "blue", true)

    carCtx.restore()
    
    //console.log(time)

    networkCtx.lineDashOffset = -time/50
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate)
}

animate()
