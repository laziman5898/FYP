const recBrain = require('brain.js')


personalTrainingData = [
{input: {irrelevantVariables:1}, output:[0]},
{input:{shortVariables:1}, output:[0]},
{input:{longVariables:1}, output:[0]},
{input:{longMethods:1},output:[0]},
{input:{noComments:1},output:[0]},
{input:{longVariables:1}, output:[1]},
]

const recNet = new recBrain.NeuralNetwork() ;
recNet.train(personalTrainingData)

function searchforTop (amountToSearchFor) {

  issuesMap = [] ;

  for (let i in personalTrainingData){

  issue = personalTrainingData[i].input
  issueRate =Array.from(recNet.run(issue))

  issuesMap.push({
   issue: issue , output: issueRate
  })
  }

  var sorted = issuesMap.sort(function(a, b) {
    return (a.output > b.output) ? 1 : ((b.output > a.output) ? -1 : 0)
  });
  console.log(issuesMap)
  console.log(sorted)
}

module.exports = searchforTop
