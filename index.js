let carCanvas = document.getElementById("carCanvas")
carCanvas.height = window.innerHeight
carCanvas.width = 200;

let networkCanvas = document.getElementById("networkCanvas")
networkCanvas.height = window.innerHeight

console.log(window.innerWidth)


//{"levels":[{"inputs":[0.6567281040100034,0.35147888492275126,0,0,0],"outputs":[0,0,0,0,0,0],"biases":[0.30201114867390416,0.5455375804727502,0.013536771931987537,0.26857301333995043,0.12983660322281482,0.08824864722740836],"weights":[[0.4401231365220479,-0.048505114282041774,0.34524970221894274,0.04452514827079586,-0.0028695126638966784,-0.00934082950259355],[-0.46879300693563203,0.2713237272254716,-0.7024168681742203,0.6201179466123958,0.06186963930532463,-0.6701672006521636],[0.053043570150518714,0.41797185267735204,0.13318686868484536,0.3646839718208059,0.3464261354203989,0.3077015267727878],[-0.6965876956069722,0.6532050502615403,0.083020049872577,0.5452532930371199,-0.28820269172046775,0.5255097288116282],[-0.24455466612674642,0.3548556747337403,-0.12490148719154985,-0.05376778821916878,0.13394087704586397,0.5474004094419419]]},{"inputs":[0,0,0,0,0,0],"outputs":[1,0,1,0],"biases":[-0.3836408848726099,0.24233475766542645,-0.0061800160996637425,0.27692057759474464],"weights":[[0.6767075684492174,-0.557070143806332,0.7180528246838792,0.12039847450210395],[-0.812566569883085,-0.780440448116366,-0.3000159823751533,0.8168053008587539],[0.6756066707910985,-0.02528777479707346,-0.23207065970330115,0.13897330012969944],[0.6268779483291479,0.7186404467874613,-0.8198359367035926,-0.26268481850231346],[-0.33029429116443604,0.8121871456399931,0.3518766398319405,-0.6899241338225571],[-0.05473951180629884,0.15839334112290754,0.4853074696762762,0.4654790009567402]]}]}
//smart car
const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const car = {
    x: Math.round(50*0.461538462),
    y: 50
}

const road = new Road(carCanvas.width/2, carCanvas.width*0.9)
let cars = generateCars(100)
let traffic = [
    new Car(road.getLaneCenter(1), -100, car.x, car.y, "DUMMY"),
    new Car(road.getLaneCenter(2), -300, car.x, car.y, "DUMMY"),
    new Car(road.getLaneCenter(0), -300, car.x, car.y, "DUMMY"),
    new Car(road.getLaneCenter(0), -500, car.x, car.y, "DUMMY"),
    new Car(road.getLaneCenter(1), -600, car.x, car.y, "DUMMY"),
    new Car(road.getLaneCenter(2), -700, car.x, car.y, "DUMMY"),
    new Car(road.getLaneCenter(0), -750, car.x, car.y, "DUMMY"),
]

let bestCar = cars[0]
bestCar.brain = localStorage.getItem("bestBrain") ? JSON.parse(localStorage.getItem("bestBrain")) : bestCar.brain

if (localStorage.getItem("bestBrain")) {
    for (i = 0; i<cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"))

        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1)
        }
    }
}

function generateCars(N) {
    let cars = []

    for (let i = 0; i<N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, car.x, car.y, "AI", 5))
    }
    
    return cars
}

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discard() {
    localStorage.removeItem("bestBrain")
}

function animate(time) {//time is how much time has passed since the programs started

    bestCar = cars.reduce((a, b) => {best = a.y == Math.min(a.y, b.y) ? a : b; return best})

    /* I could also do:
    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)))
    */

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
