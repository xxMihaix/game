
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt')

app.use(express.static(path.join(__dirname, 'public_html')));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'images')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}
}))


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Conectat');
})
.catch((err)=> {
    console.log('NU e conectat');
})

const User = require('./schema.js');

app.get('/session', async (req, res) => {

    if(req.session.username){
        res.json({ succes: true, username: req.session.username, money: req.session.money});
    }
    else{
        res.json({ succes: false});
    }
})

app.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body;
    
    const existUser = await User.findOne( {username: username});

    if(existUser){
        return res.status(400).json({ 
            succes: false, 
            message: 'Username already exists.'
        })
    
    }else{
        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({username: username, password: hashedPassword})

        req.session.username = username;
        res.session.money = 10;

        return res.status(201).json({ 
            succes: true, 
            message: '',
            username: username,
        })
        
    }}
    catch(err){
        console.log(err);
         res.status(500).json({ succes: false, message: 'Eroare server' });
    }
});


app.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if(!user){
            return res.json({
                succes: false,
                message: 'User not found!'
            })
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match && !user.password) {
            return res.json({
                succes: false,
                message: 'Wrong password!'
            })
        }

        req.session.username = user.username;
        req.session.money = user.money;

        res.json({
            succes: true,
            message: 'Login succesful!',
            username: user.username,
        })
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({ succes: false, message: 'Server error'});
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy(err=> {
        if(err){
            return res.status(500).send('Error at logout')
        }
        res.clearCookie('connect.sid');
        res.json({succes: true})
    })
})


app.get('/users', async(req, res) => {
    try{
        const users = await User.find({}, {password: 0});
        res.json(users);
    }
    catch(err){
        console.log(err);
    }
})

app.get('/usersManagement', async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    }
    catch(err){
        console.log(err);
    }
})

app.get('/role', async (req, res) => {
    if(!req.session.username){
        return res.json({ succes: false });
    }

    try{
        const user = await User.findOne({ username: req.session.username });

        if(!user) return res.json({ succes: false });

        res.json({ succes: true, role: user.role });

    }
    catch(err){
        res.json({ succes: false });
    }
})

app.post('/update-role', async (req, res) => {
    const { userId, role } = req.body;

    try{
        await User.findByIdAndUpdate(userId, { role: role })
        res.json({ succes: true });
    }
    catch(err){
        console.log(err);
        res.json({ succes: false });
    }
})

app.post('/updateMoney', async (req, res) => {
    
    const { userId, value } = req.body;

    try{
        const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { money: value} }, {new: true})

        if (req.session.username && updatedUser.username === req.session.username){
            req.session.money = updatedUser.money;
        }
        res.json({
            succes: true,
        });
    }
    catch(err){
        console.log(err);
        res.json({ succes: false })
    }
})

app.delete('/users/:id', async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted succesfully' });
    }
    catch(err){
        res.status(500).json({ error: 'Failed to delete user' })
    }
})


app.listen(3000, () => {
    console.log(`Server-ul ruleaza la portul: 3000`);
});

