
var intVariables = [];
var stringVariables = [];

const mappedVariables = new Map() ;
const brain = require('./aiBrain.js') ;


function fileanalysis(file,arrayedTxt) {
completeFeedback = [];

allVariables = findGenericVariableNames(file)
feedback = variableNameFeedback(allVariables)

for(let i in feedback){
  completeFeedback.push(feedback[i]);
}
secondFeedback = checkLongIntLiteralls(mappedVariables,intVariables,arrayedTxt)
for(let i in secondFeedback){
  completeFeedback.push(secondFeedback[i]);
}

return completeFeedback

}
function issueAnalysis(file) {

allVariables = findGenericVariableNames(file)
issues = amountOfErrors(allVariables)
return issues
}


function findGenericVariableNames(uploadedtxt) {
    var allVariables = []
    var arrayedText = uploadedtxt.split(' ')

    dataTypeSearchNumbers("int", arrayedText ,allVariables );
    dataTypeSearchStrings("String", arrayedText ,allVariables);
    dataTypeSearchNumbers("float", arrayedText ,allVariables);
    dataTypeSearchNumbers("double", arrayedText ,allVariables);

    return allVariables
}

function dataTypeSearchNumbers(dataTypeName, arrayedText,allVariables) {
  var fromPositionCounter = 0
  // Within this function you need to fix it so that the variable that comes back is not repeated for example "this" and "this)"
  // also if the user uses a "," to create multiple variables of the same type

  while (arrayedText.includes(dataTypeName, fromPositionCounter)) {
    var indexofdatatype = arrayedText.indexOf(dataTypeName, fromPositionCounter)
    position = (indexofdatatype + 1)
    var variableName = arrayedText[position]

    if (!allVariables.includes(variableName)) {
      if (variableName != "") {
        allVariables.push(variableName)
        intVariables.push(variableName)
      }

      if (arrayedText[position + 1] == "=") {
        var varResult = (arrayedText.indexOf("=", position) + 1)
        varResult = arrayedText[varResult]
        variableAssigner(variableName, varResult)
      }

    }
    fromPositionCounter = position

  }
}

function dataTypeSearchStrings(dataTypeName, arrayedText,allVariables) {
  var fromPositionCounter = 0
  // Within this function you need to fix it so that the variable that comes back is not repeated for example "this" and "this)"
  // also if the user uses a "," to create multiple variables of the same type

  while (arrayedText.includes(dataTypeName, fromPositionCounter)) {
    var indexofdatatype = arrayedText.indexOf(dataTypeName, fromPositionCounter)
    position = (indexofdatatype + 1)
    var variableName = arrayedText[position]



    if (!allVariables.includes(variableName)) {
      if (variableName != "") {
        allVariables.push(variableName)
        stringVariables.push(variableName)
      }

      if (arrayedText[position + 1] == "=") {
        var varResult = (arrayedText.indexOf("=", position) + 1)
        varResult = arrayedText[varResult]
        variableAssigner(variableName, varResult)
      }
    }
    fromPositionCounter = position
  }
}

function variableAssigner(variableName, variableResult) {
  mappedVariables.set(variableName, variableResult);
}

  function variableNameFeedback(variableArrayList) {

    var completeFeedback = [];
      for (let variableName in variableArrayList) {
        var variable = variableArrayList[variableName];
        netOutput = brain.compareVariable(variable);
        varNameFeedback = "" + variable + " is a " + netOutput + " variable Name"
        completeFeedback.push(varNameFeedback)
        console.log(varNameFeedback)
      }

return completeFeedback
    }
    function searchLinedArray(arrayedTxt, variable) {

    for(i in arrayedTxt){
      if(arrayedTxt[i].includes(variable)){
        console.log(variable +" is on line " + i)
      }
    }
    }

    function checkLongIntLiteralls(map,intArrayList,arrayedTxt) {
    notified = false ;
    feedback= [] ;

    for(let varName in intArrayList){

      getName = intArrayList[varName]
      getValue = map.get(getName)

    if(getValue!== undefined){lengthOfNumber = getValue.toString().length

    if(getValue.includes("_") === false && lengthOfNumber > 8){

      if(notified === false){
      feedback.push("Variable " +getName + " Could be improved upon by using '_' between literalls to make the numbers more readable  ");

      searchLinedArray(arrayedTxt,getName)
      notified = true
    }else {
      feedback.push("Variable " +getName + " Could be improved upon by using the previously suggested technique")
      searchLinedArray(arrayedTxt,getName)
    }

    }}}
return feedback ;
  }

function amountOfErrors(variableArrayList){
var issues = 0 ;

  for (let variableName in variableArrayList) {
    var variable = variableArrayList[variableName];
    netOutput = brain.compareVariable(variable);
     if (netOutput=="bad"){issues++;}
  }
  return issues
}


module.exports = {
  fileanalysis : fileanalysis,
  issueAnalysis:issueAnalysis,
}
