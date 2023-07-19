const express = require('express')
const app = express()
const port = 3001


// Function to generate a token (example implementation)
function generateToken() {
  // Your token generation logic here
  // Return the generated token
  return "exampleToken";
}

// Function to validate if the user is an admin (example implementation)
function isAdmin(user) {
  // Your admin validation logic here
  // Return true if the user is an admin, false otherwise
  return user.isAdmin;
}

// Function to get user submissions for a specific problem (example implementation)
function getUserSubmissions(userId, problemId) {
  // Your code to fetch user submissions for the given user ID and problem ID
  // Return the user's submissions
  return [];
}

// Function to add a new problem by an admin (example implementation)
function addProblem(problem) {
  // Your code to add a new problem to the list of problems
  // Return a response indicating the success or failure of adding the problem
  return { success: true, message: "Problem added successfully" };
}


const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  //getting email and password from user
  const {email,password} = req.body;

  //checking if user already exists
  const existingUser = USERS.find( user => user.email === email);
  if(existingUser){
    return res.status(400).json({message:"User Already Exists!"});
  }

  //else pushing new user data into USERS's array
  USERS.push({email,password});
  res.status(200).json({message:"User Registered Successfully!"});
})

app.post('/login', function(req, res) {
  //getting user id and password
  const {email,password} = req.body;

  //checking if user exists!
  const checkUser = USERS.find(user=>user.email === email);
  if(!checkUser){
    return res.status(401).json({message:"User does not exists!"});
  }

  //checking for password, if matches then generate token
  if(checkUser.password===password){
    const token = generateToken();
    return res.status(200).json({token : token})
  }

  //else prompt user to try again 
  return res.status(401).json({message:"User ID or Password Invalid, try again!"});
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.status(200).send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
  //getting submission from user
  const submission = req.body;

  //Randomly accepting or rejecting receieved solution
  const isAccepted = Math.random()<0.5;

  //Assigning isAccepted flag to submission object
  submission.isAccepted=isAccepted;

  //push submission to SUBMISSION's array
  SUBMISSION.push(submission)
  res.status(200).json({message:"Submission receieved!"});
});

//posting new questions route
app.post('/problems',(req,res)=>{

  //checking if admin
  const isAdmin = req.header['x-admin']==='true';
  if(!isAdmin){
    return res.status(401).json({message:"Not an admin!"});
  }

  //getting various inputs from user for question
  const {title,description,testCases}=req.body;
  const newProblem = {
    title,
    description,
    testCases
  }

  //adding question to QUESTIoN array 
  QUESTIONS.push(newProblem);
  res.status(200).json({message:"Added question successfully!"});
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})