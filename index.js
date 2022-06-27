let carCanvas = document.getElementById("carCanvas")
carCanvas.height = window.innerHeight
carCanvas.width = 200;

let networkCanvas = document.getElementById("networkCanvas")
networkCanvas.height = window.innerHeight

console.log(window.innerWidth)

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width/2, carCanvas.width*0.9)
let car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 5)
let traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY")
]

function animate() {

    for (let i = 0; i<traffic.length; i++) {
        traffic[i].update(road.borders, [])
    }

    car.update(road.borders, traffic)

    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight
    networkCanvas.width = window.innerWidth - carCanvas.width - 5;

    carCtx.save()
    carCtx.translate(0, -car.y + carCanvas.height/1.2)
    road.draw(carCtx)

    for (let i = 0; i<traffic.length; i++) {
        traffic[i].draw(carCtx)
    }

    car.draw(carCtx, "red")

    carCtx.restore()

    Visualizer.drawNetwork(networkCtx, car.brain)
    requestAnimationFrame(animate)
}

animate()
