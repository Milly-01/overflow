
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


const mongoose = require("mongoose");


const app = express();


app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["https://my-crud-overflow.onrender.com"]
}));

mongoose.connect(process.env.MONGOATLASS, {})
    .then((result)=>{
        console.log("Connected to database");
    })
    .catch((error)=>{
        console.log("There has been an error: " + error);
    })

const registerSchema = new mongoose.Schema({
    r_name: String,
    r_surname: String,
    r_emailaddress: String,
    r_password: String
});

const postsSchema = new mongoose.Schema({
    p_emailaddress: String,
    p_title: String,
    p_post: String,
    p_vote: Number,
    p_date: String,
    p_time: String
});

const answersSchema = new mongoose.Schema({
    a_emailaddress: String,
    a_title: String,
    a_post: String,
    a_date: String,
    a_time: String,
    // a_vote: Number,
    a_answer: String,
    a_question_id: String,
    a_responder_emiladdress: String
});

const votesSchema = new mongoose.Schema({
    v_id_question: String,
    v_question: String,
    v_email_of_voter: String,
    v_voted: String
});

const User = mongoose.model("User", registerSchema);
const Post = mongoose.model("Post", postsSchema);
const Answer = mongoose.model("Answer", answersSchema);
const Vote = mongoose.model("Vote", votesSchema);

app.use(express.static("build"));


// Post Request to send info from user to database.
app.post("/api/register", function(req, res){
    const {u_name, u_surname, u_email, u_password} = req.body;
    User.find({r_emailaddress: u_email}).then(
        function(result){
            if(result.length === 0){
                const new_user = new User({
                    r_name: u_name,
                    r_surname: u_surname,
                    r_emailaddress: u_email,
                    r_password: u_password
                });
                new_user.save();
                res.json("Success");

            }else{
                res.json("Fail - Email Exists");
            }
        }
    );
});


app.get("/api/register", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});


app.get("/", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});

app.get("/register", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});

// 

// Post request to check if given information from user matches anything in the database.
app.post("/api/login", function(req, res){
    const {u_email, u_password} = req.body;
    User.find({r_emailaddress: u_email, r_password: u_password}).then(
        function(result){
            if(result.length !== 0){
                res.json("Success");
            }else{
                res.json("Failed");
            }
        }
    );
});


app.get("/api/login", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});


app.get("/login", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});

//


// 
app.post("/api/compose", function(req, res){
    const {u_title, u_post, u_email, u_date, u_time, u_vote} = req.body;
    const my_post = new Post({
        p_emailaddress: u_email,
        p_title: u_title,
        p_post: u_post,
        p_date: u_date,
        p_time: u_time,
        p_vote: u_vote
    });
    my_post.save()
    res.json("Success");
});


app.get("/api/compose", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});


app.get("/compose", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});
//

//
app.post("/api/profile", function(req, res){
    const {u_send_everywhere} = req.body;
    User.find({r_emailaddress: u_send_everywhere}).then(function(result){
        res.json(result);
    });
});


app.get("/api/profile", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});

app.get("/profile", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});
//


// Get request.
app.get("/api/allposts", function(req, res){
    Post.find().then(function(result){
        res.send(result);
    });
});

app.get("/allposts", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});


// 
app.post("/api/post", function(req, res){
    const {loc_question_id, loc_email, loc_title, loc_post, answer_vote, answer_date, answer_time, my_answer, u_send_everywhere} = req.body;
    const create_answer = new Answer({
        a_question_id: loc_question_id,
        a_emailaddress: loc_email,
        a_title: loc_title,
        a_post: loc_post,
        a_vote: answer_vote,
        a_date: answer_date,
        a_time: answer_time,
        a_answer: my_answer,
        a_responder_emiladdress: u_send_everywhere
    });

    create_answer.save();
    res.json("Success");
});

app.get("/api/post", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});


app.get("/post", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});
// 

app.get("/api/answer", function(req, res){
    Answer.find().then(
        function(result){
            res.send(result);
        }
    );
});

app.get("/answer", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});

// /////////////////////////////////////////////////////////////////////////////////
app.post("/api/manageposts", function(req, res){
    const {u_send_everywhere} = req.body;
    Post.find({p_emailaddress: u_send_everywhere}).then(function(result){
        res.send(result);
    })
});


app.get("/api/manageposts", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});

app.get("/manageposts", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});
// 

app.delete("/api/manageposts/:id", function(req, res){
    const myid = req.params.id;
    console.log(myid);
    Post.deleteOne({_id: myid}).then();
    Answer.deleteMany({a_question_id: myid}).then();
    res.json('Post Deleted');   
})

app.get("/api/manageposts/:id", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});
////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////  

app.post("/api/vote", function(req, res){
    var cnt = 0;
    var votes = 0;
    var {u_send_everywhere, loc_question_id, loc_post, q_voted} = req.body;
    Vote.find({v_email_of_voter:u_send_everywhere, v_id_question: loc_question_id}).then(
        function(result){
             if(result.length === 0){
                const my_vote = Vote({
                 v_id_question: loc_question_id,
                                  v_question: loc_post,
                     v_email_of_voter: u_send_everywhere,
                     v_voted: q_voted
                 });
                 my_vote.save();
                 cnt = 1;
 
            }else if(result[0].v_voted === "Yes"){
                q_voted = "No";
                Vote.findOneAndUpdate({v_email_of_voter:u_send_everywhere, v_id_question: loc_question_id}, {$set: {v_voted: q_voted}}).then(function(result){
                    // res.redirect("/"+delCusItem);
                    // console.log(result);
                  

                  });
                  cnt = 2;

            }else{
                Vote.findOneAndUpdate({v_email_of_voter:u_send_everywhere, v_id_question: loc_question_id}, {$set: {v_voted: q_voted}}).then(function(result){
                    // res.redirect("/"+delCusItem);
                    // console.log(result);
                  
                });
                cnt = 3;

            }


         
        }
 )

    Vote.find({v_id_question: loc_question_id, v_voted: "Yes"}).then(
         function(result){
        //    res.json(result.length);
             if(cnt === 1){
                 votes = result.length+1;
             }else if(cnt === 2){
                 votes = result.length-1;
             }else if(cnt === 3){
                 votes = result.length+1;
             }else{
                 votes = result.length+1;
             }


         
                    
            Post.findOneAndUpdate({_id: loc_question_id}, {$set: {p_vote: votes}}).then(function(result){
            });


        
            res.json(votes);
      })
});


app.get("/api/vote", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});





//////////////
//For when user refreshes page from home
app.get("/home", function(req, res){
    res.sendFile(__dirname+"/build/index.html");
});




///////////////



const PORT = process.env.PORT || 3001;




app.listen(PORT, function(){
    console.log("Server up and running");
});
