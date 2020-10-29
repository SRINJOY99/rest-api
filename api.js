var express = require ('express');
var app = express();
var port = process.env.PORT || 8900;
var bodParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient
var mongourl = "mongodb+srv://admin28:hellosrinjoy@cluster0.mhc3v.gcp.mongodb.net/edurekainternship?retryWrites=true&w=majority";
var cors = require('cors');
var db;

app.use(cors());

app.use(bodParser.urlencoded({extended:true}));
app.use(bodParser.json())

app.get('/health',(req,res) =>{
    res.send("Api is Working")
});

app.get('/', (req,res) =>{
    res.send(`<a href ="http://localhost:7800/location" target="_blank">City</a> <br/> <a href ="http://localhost:7800/mealtype" target="_blank">MealType</a> <br/> <a href ="http://localhost:7800/cuisine" target="_blank">Cuisine</a> <br/> <a href ="http://localhost:7800/resturant" target="_blank">Resturant</a>`)

})

//List of city
app.get('/location', (req,res) =>{
    db.collection('city').find({}).toArray((err,result) =>{
        if (err) throw err;
        res.send(result)
    })
})

//MealType
app.get('/mealtype',(req,res) =>{
    db.collection('mealType').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})

//Cuisine
app.get('/cuisine',(req,res) =>{
    db.collection('cuisine').find({}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)    
    })
})

//List of Resturant
app.get('/resturant',(req,res) =>{
    var condition ={};
    if(req.query.city && req.query.mealtype){
        condition = {city:req.query.city,"type.mealtype":req.query.mealtype}
        
    }
    else if(req.query.city){
        condition ={city:req.query.city}
    }
    else if(req.query.mealtype){
        condition={"type.mealtype":req.query.mealtype}
    }
    else {
        condition={}
    } 
    db.collection('resturant').find(condition).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})

//ResturantDetails
app.get('/resturantdetails/:id' ,(req,res) =>{
    var query ={_id:req.params.id}
    db.collection('resturant').find(query).toArray((err,result) =>{
        res.send(result)
    })
})

//ResturantList
app.get('/resturantlists/:mealtype', (req,res) =>{
    var condition ={};
    var sort = {cost:-1}
    if(req.query.cuisine){
        condition = {"type.mealtype":req.params.mealtype , "Cuisine.cuisine":req.query.cuisine}

    
    }else if(req.query.city){
        condition={"type.mealtype":req.params.mealtype , city:req.query.city}
    }
    else if(req.query.lcost && req.query.hcost){
        condition ={"type.mealtype":req.params.mealtype , cost:{$lt:Number(req.query.hcost), $gt:Number(req.query.lcost)}}
    }
    else if(req.query.sort){
        condition ={"type.mealtype":req.params.mealtype}
        sort={cost:Number(req.query.sort)}
    }
    else{
        condition ={"type.mealtype":req.params.mealtype}

    }
    db.collection('resturant').find(condition).sort(sort).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})



//Placeorder
app.post('/placeorder',(req,res) =>{
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) =>{
        if(err) throw err;
        res.send('posted')
    })
    
})


//Order
app.get('/orders',(req,res) =>{
    db.collection('orders').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//DeleteOrders
app.delete('/deleteorders',(req,res)=>{
    db.collection('orders').remove({_id:req.body.id},(err,result) =>{
        if(err) throw err;
        res.send('data deleted')
    })
})

//UpdateOrders
app.put('/updateorders',(req,res) =>{
    db.collection('orders').update({_id:req.body._id},
        {
            $set:{
                name:req.body.name,
                address:req.body.address
            },

        },(err,result) =>{
            if(err) throw err;
            res.send('data updated')
        })

        
})


MongoClient.connect(mongourl,(err,connection) =>{
    if(err) throw err;
    db = connection.db('edurekainternship');
    app.listen(port,(err) => {
        if (err) throw err;
        console.log(`Server is runnimg on port ${port}`)
    });
});
