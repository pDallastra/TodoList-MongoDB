const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const ejs = require('ejs')

const app = express();
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

var connection = mongoose.connect(`mongodb+srv://paulodallastra:88125707@cluster0-jyx8b.mongodb.net/<Todo>`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

const todo = new mongoose.Schema({
    title: String,
    status: Number
});

const Todo = new mongoose.model('Todo', todo);

app.get('/', (req, res) => {
    Todo.find({}, (err, list) => {
        if(err){
            console.log(err)
        } else {
            res.render('index', {list})
        }
    })
});

app.post('/new', (req, res) => {
    const newTask = new Todo({
        title: req.body.title,
        status: 0
    });
    newTask.save(() => {
        res.redirect('/')
    })
});

app.get('/changeStatus/:item', (req, res) => {
    const item = req.params.item;
    Todo.updateOne({
        _id: item
    }, {
        status: 1
    }, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
});

app.get('/backStatus/:item', (req, res) => {
    const item = req.params.item;
    Todo.updateOne({
        _id: item
    }, {
        status: 0
    }, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
});

app.get('/delete/:item', (req, res) => {
    const item = req.params.item;
    Todo.deleteOne({
        _id: item
    }, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started.");
});