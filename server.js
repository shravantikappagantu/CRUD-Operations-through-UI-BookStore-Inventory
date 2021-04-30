const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/bookstore',(err, database) =>{
    if(err) return console.log(err)
    db = database.db('BookStore')

    app.listen(3000, () => {
        console.log("Listening at port number 3000");
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('pubic'))

app.get('/', (req,res)=>{
    db.collection('bookdetails').find().toArray((err,result)=>{
        if (err) return console.log(err)
    res.render('homepage.ejs', {data: result})
    })
})

app.get('/addbook',(req,res)=>{
    res.render('add.ejs');
})
app.get('/updatestock',(req,res)=>{
    res.render('update.ejs');
})
app.get('/delete',(req,res)=>{
    res.render('delete.ejs');
})

app.post('/addbook', (req,res)=>{
    db.collection('bookdetails').save(req.body,(err,result)=>{
        if(err) return console.log(err)
    res.redirect('/')
    })
})

app.post('/updatestock',(req,res)=>{
    db.collection('bookdetails').find().toArray((err,result)=>{
        if(err)
            return console.log(err)
        for(var i=0;i<result.length;i++)
        {
            if(result[i].pid==req.body.id)
            {
                s=result[i].stock
                break
            }
        }
        db.collection('bookdetails').findOneAndUpdate({pid:req.body.id},
            {$set:{stock: parseInt(s)+parseInt(req.body.stock)}},{sort:{_id:-1}},
        (err,result)=>{
            if(err)
                return res.send(err)
            console.log(req.body.id+' stock updated')
            res.redirect('/')
        })

    })
})

app.post('/delete', (req,res)=>{
    db.collection('bookdetails').findOneAndDelete({pid:req.body.id}, (err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})