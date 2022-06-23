//static methods and properties can only be called by the class, not its instances
//seriializating is the conversion of an object to bytestream so it can be transferred to databases and through http

class Level {
    static #randomize(level) {
        for (let i = 0; i<level.inputs.length; i++) {
            for (let j = 0; j<level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1 //returns numbers between 1 and -1 
            }
        }
         
        for (let i = 0; i<level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1
        }
    }

    static feedForward(givenInputs, level) {
        for (let i = 0; i<level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i]
        }

        for (let i = 0; i<level.outputs.length; i++) {

            let sum = 0

            for (let j = 0; j<level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i]
            }

            if (sum > level.biases[i]) {
                level.outputs[i] = 1
            } else {
                level.outputs[i] = 0
            }
        }

        return level.outputs
    }

    constructor(inputCount, outputCount) { //input is the input (basically previous neuron layer)
        this.inputs = new Array(inputCount)
        this.outputs = new Array(outputCount)
        this.biases = new Array(outputCount)

        this.weights = []

        for (let i = 0; i<inputCount; i++) {
            this.weights[i] = new Array(outputCount)
        }

        Level.#randomize(this)
    }
}

class NeuralNetwork{//it all begins with this
    constructor(neuronCounts) { //index 0 -- first level (the rays) //index 1-inf -- hidden layers // index inf + 1 -- output layer (tells the car what to do)
        this.levels = []
        for (let i = 0; i<neuronCounts.length - 1; i++) {// we go one less cuz we don't want to to have a layer that doesn't have a ceiling, there are actually gonna be only 2 levels
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]))
        }
    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0])

        for (let i = 1; i<network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i])
        }

        return outputs
    }
}