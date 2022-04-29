const ChartJsImage = require('chartjs-to-image')


// Generate the chart


function setData(data) {
  const config = {
    type: 'radar',
    data: {
      labels: [['Bad Naming', 'Conventions'], ['Function Length', 'And Cohesion'], 'Int Literals', 'Commenting','Deep Nesting'],
      datasets: [{
        label: 'Your Analysis',
        data: data
      }]
    },
  }
  return config
}

function createChart(filename , config) {
  const chart = new ChartJsImage()
  chart.setConfig(config);
  // Save it
  chart.toFile('./graphs/' + filename + '.png');

}

function badNameIncrease (array, increaseNumber){
  array[0] = data[0]+increaseNumber ;
}
function intLiteralsIncrease (array, increaseNumber){
  array[1] = data[1]+increaseNumber ;
}

module.exports = {
  createChart: createChart,
  setData: setData,
  badNameIncrease:badNameIncrease,
  intLiteralsIncrease: intLiteralsIncrease,
}
