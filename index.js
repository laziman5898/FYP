if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const upload = require('express-fileupload');

uploadedfiles = new Map() // maps a number to the uploaded file
const varFeedback = new Map() // maps uploaded file to its current feedback
fileerrors = new Map() // maps an array of errors to the corresponding file
studentsFiles = [] ;
graphAnalysis = new Map() ;
graphAnalysis.set("Student",[0,0,0,0,0])
graphAnalysis.set("Teacher",[0,0,0,0,0])
currentUploadedFiles = 0
const app = express()
const users = [
  //Pre-Created Login
  {id:1, name:"Student", email:"w@w" ,password:"$2b$10$tbGHYYjVJ3KMA998Oe7TUOPFf/tkgXOBEUKocgdR3hj9LdNnpQylS", role:"student"},//password = w
  {id:'2',name: 'Teacher', email: 'teacher@school.com',password: '$2b$10$wQiXWn9RcZ5psZOAJM15WuNBnC7jkYNroFYlcMQoPqYa83g2OHSTS', role:"teacher"} // password = teach
]


const getCode = require('./uploadedCode-config.js')
const codeanalysis = require('./codeanalysis.js')
const brain = require('./aiBrain.js')
const charts = require('./chart.js')
const personalBrain = require('./recommendBrain.js')
//personalBrain.searchforTop



const initializepassport = require('./passport-config')
initializepassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

app.set('view-engine', 'ejs')
app.use( express.static( "graphs" ) )
app.use(express.urlencoded({
  extended: true
}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(upload());



app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', {
    name: req.user.name,
    role: req.user.role
  })
})

app.get('/nameChecker', checkAuthenticated, (req, res) => {
  res.render('nameChecker.ejs', {
    feedback: ""
  })
})

app.get('/feedback', checkAuthenticated, (req, res) => {
  res.render('feedback.ejs', {
    uploadedfiles: uploadedfiles,
    varFeedback:varFeedback
  })
})


app.get('/textupload', checkAuthenticated, (req, res) => {
  res.render('textupload.ejs')
})

app.get('/codingpractices', checkAuthenticated, (req, res) => {
  res.render('codingpractices.ejs')
})

app.get('/dashboard', checkAuthenticated, (req, res) => {
  //console.log(graphDataset)
charts.createChart(req.user.name ,charts.setData(graphAnalysis.get(req.user.name)))
  res.render('dashboard.ejs' , {
imageLocation : ""+req.user.name+".png"
  })

})

app.get('/viewuploaded',checkAuthenticated , authRole("teacher"), (req, res) => {
  res.render('viewuploaded.ejs', {
    studentsFiles : studentsFiles
  })
})

app.get('/editBrain',checkAuthenticated , authRole("teacher"), (req, res) => {
  res.render('editbrain.ejs')
})

app.get('/studenttendencies',checkAuthenticated , authRole("teacher"), (req, res) => {
  res.render('studenttendencies.ejs')
})

app.post('/textupload', checkAuthenticated, (req, res) => {
  if (req.files) {

    var file = req.files.file;
    var filename = file.name;

    //UPLOAD THE FILE
    file.mv('./uploadedfiles/' + filename, function(err) {
      if (err) {
        res.send(err);
      } else {

        //BASICALLY A CONSOLE LOG DELETE IN DUE TIME
        console.log(filename + 'uploaded successfully')
        var code = getCode(filename , "text")
        var arrayedCode = getCode(filename, "array")
        var codeFeedback = codeanalysis.fileanalysis(code,arrayedCode)
       var variableIssues = codeanalysis.issueAnalysis(code)


        varFeedback.set(filename,codeFeedback)
        updatedAnalysis = graphAnalysis.get(req.user.name)
        updatedAnalysis[0]= updatedAnalysis[0]+variableIssues
        graphAnalysis.set(req.user.name,updatedAnalysis)

        console.log(graphAnalysis.get(req.user.name));
    studentsFiles.push({
      student: req.user.name , code:code,  filename:filename
    })

    console.log(codeFeedback)



        uploadedfiles.set(currentUploadedFiles, filename)
        currentUploadedFiles++
        res.redirect('/');

      }
    })
  }
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true

}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    })

    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users);
})

app.post('/namechecker', checkAuthenticated, (req, res) => {
  try {
    inputtedVariable = req.body.variablename
    console.log(brain.compareVariable(inputtedVariable))
    res.render('nameChecker.ejs', {
      feedback: brain.compareVariable(inputtedVariable)
    })
  } catch {
    console.log('error')
  }
})

app.post('/editbrain', checkAuthenticated, (req, res) => {
  try {
    //console.log(req.body.input + "" + req.body.output);
brain.addToBrain(req.body.input,req.body.output)
res.render('editbrain.ejs')
    }   catch {
    console.log('error')
  }
})

app.post('/viewuploaded', checkAuthenticated, (req, res) => {
  try {
    file = req.body.filename
    teachersFeedback = req.body.feedback
varFeedback.get(file).push(teachersFeedback)
console.log(varFeedback.get(file))
res.render('viewuploaded.ejs')
    }   catch {
    console.log('error')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
function getRadarData (studentname) {
  for(i=0 ; i<graphAnalysis.length; i++){
    if(studentname == graphAnalysis.has(studentname)){return graphAnalysis.get(studentname)}
  }
}

function updateRadarData(studentname,increaseAmount,type,){

  if(type="badName"){charts.badNameIncrease(getRadarData(studentname),increaseAmount)}
  if (type="literals"){charts.intLiteralsIncrease(getRadarData(studentname),increaseAmount)}
}
function authRole(role) {
  return(req,res,next) => {
    if (req.user.role !== role){
        return res.redirect('/')
      res
    }
    next()
  }
}
app.listen(process.env.PORT || 3000)
