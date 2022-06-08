let canvas = document.getElementById("carCanvas")
canvas.height = window.innerHeight
canvas.width = 200;

const ctx = canvas.getContext("2d")
const road = new Road(canvas.width/2, canvas.width*0.9)
let car = new Car(road.getLaneCenter(1), 100, 30, 50)

car.update()
car.draw(ctx)

function animate() {
    car.update()

    canvas.height = window.innerHeight

    ctx.save()
    ctx.translate(0, -car.y + canvas.height/1.2)
    road.draw(ctx)
    car.draw(ctx)

    ctx.restore()
    requestAnimationFrame(animate)
}

animate()
