const fs = require('fs');
const readline = require('readline');

var arrayedTxt = ["Line 0"];


function getCode (filename , outputType) {

      var txtCode = fs.readFileSync(__dirname + '/uploadedfiles/' + filename, 'utf8')

      if(outputType=="text"){
        return txtCode
      }
      if (outputType == "array"){
          arrayedTxt = fs.readFileSync(__dirname + '/uploadedfiles/' + filename, 'utf8').toString().split("\n");
        return arrayedTxt
      }


}


module.exports = getCode
