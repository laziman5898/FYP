const brain = require('brain.js')

// initialize the brain - A LSTM (Long Short Term Memory) Type brain
const net = new brain.recurrent.LSTM({
  hiddenLayers: [50]
})


const trainingData = [
  {input: "x", output : "bad"},
  {input :"y", output: "bad"},
  {input :"z", output: "bad"},
  {input:"height", output:"good"},
  {input:"length", output:"good"},
  {input:"width", output:"good"},
  {input:"age", output:"good"},
  {input:"name", output:"good"},
  {input:"num1",output:"bad"},
  {input:"num2",output:"bad"},
  {input:"num2", output:"bad"},
  {input:"num3",output:"bad"},
  {input:"num4",output:"bad"},
  ]

       net.train(trainingData, {
         iterations: 100,

       log: (stats) => console.log(stats)
      });

function compareVariable(variable) {
  var netOutput = net.run(variable);
  return netOutput
}

function addToBrain (input,output) {
  trainingData.push({input:input, output:output},)
  net.train(trainingData, {
    iterations: 100,

  log: (stats) => console.log(stats)
 });
  console.log('Successfully added to the brain')
}

module.exports = {
  compareVariable: compareVariable,
  addToBrain: addToBrain
}
