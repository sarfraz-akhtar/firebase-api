const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions


const express = require('express')
const bodyParser = require('body-parser');
const app = new express()
const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://education-crm.firebaseio.com"
});


const database = admin.database();

app.get('/titles',function(req,res){
    const response = {
        "FLORERÍA MARIELA BUSTAMANTE | Empresa de Flores a Domicilio en Rancagua": 1,
        "Best Business Consulting Firms, Top Management Consulting Firm": 1,
        "CNC Blog für Anwender und Einsteiger &ndash; Tools &amp; Programmierung": 1,
        "Trichrome Labs": 1,
        "ndex of /": 1,
        "My Blog &#8211; My WordPress Blog": 1,
    }

    

    res.send(response) 
});



app.get('/dbtitles',function(req,res) {

    const table = database.ref('titles');
    table.on('value', function(snapshot) {
    res.send(snapshot)
});
      
    
});


app.post('/title',async (req,res, next) => {
 
 console.log(req.body);
  let titleName = req.body.name;
  console.log("post titles.................")
  try{
    await database.ref('titles').push({
        name: titleName
      });
      res.send({"message":"title has saved successfully."})
  }
  catch(e){
      console.log(e)
      next(new Error(e))
  }
})


app.get('/event/:eventId/attendees',async (req,res,next) => {
  if(req.params.eventId){
    try{
    const rootRef = database.ref()
    const attendees = rootRef.child(`eventAttendee/${req.params.eventId}`)
    let eventAttendees = []
   await attendees.on('value', (snap) => {
       snap.forEach((childSnap) => {
        let userRef = rootRef.child('users').child(childSnap.key)
        userRef.on('value',(userSnap) =>{
          eventAttendees.push(userSnap)
        })
        
       })
       res.send(eventAttendees)
    })
    // res.send(eventAttendees)
  }
  catch(e){
    res.status(400).send(e)
  }

  }
  else{
    res.status(401).send("eventId is required.")
  }
  // res.send(req.params)
  //  res.send("event attendee getting success")
})

exports.bigben = functions.https.onRequest((req, res) => {
    const hours = (new Date().getHours() % 12) + 1 // London is UTC + 1hr;
    res.status(200).send(`<!doctype html>
      <head>
        <title>Time</title>
      </head>
      <body>
        ${'BONG '.repeat(hours)}
      </body>
    </html>`);
  });


exports.app = functions.https.onRequest(app);
