let canvas = document.getElementById("carCanvas")
canvas.height = window.innerHeight
canvas.width = 200;

const ctx = canvas.getContext("2d")

let car = new Car(100, 100, 30, 50)
car.draw(ctx)

function animate() {
    car.update()
    canvas.height = window.innerHeight
    car.draw(ctx)
    requestAnimationFrame(animate)
}

animate()
