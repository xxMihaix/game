
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt')

const USERNAME_COOLDOWN = 14 * 24 * 60 * 60 * 1000; // 14 zile

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

    if(!req.session.userid){
        return res.json({ succes: false });
    }

    try{
        const user = await User.findById(req.session.userid);

        if (!user) return res.json({ succes: false });

        res.json({ 
            succes: true, 
            userid: user._id,
            username: user.username,
            profilePic: user.profilePic,
            money: user.money,
            role: user.role
         })
    }
    catch(err) {
        console.log(err);
        res.json({ succes: false, message: 'Error /username/catch' })
    }
})


app.post('/register', async (req, res) => {
    try{
        const { username, password, profPicNr } = req.body;
    
    const existUser = await User.findOne( {username: username});

    if(existUser){
        return res.status(400).json({ 
            succes: false, 
            message: 'Username already exists.'
        })
    
    }else{

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({username: username, password: hashedPassword, profilePic: profPicNr})

        req.session.userid = user._id;

        return res.status(201).json({ 
            succes: true, 
            message: '',
        })
        
    }}
    catch(err){
        console.log(err);
         res.status(500).json({ succes: false, message: 'Eroare server' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ succes: false, message: 'User not found!' });
        }

        let match = false;

        if (user.password.startsWith('$2')) {
            match = await bcrypt.compare(password, user.password);
        } else {
            match = password.trim() === user.password.trim();
        }

        if (!match) {
            return res.json({ succes: false, message: 'Wrong password!' });
        }

        req.session.userid = user._id;

        res.json({ succes: true, message: 'Login succesful!' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ succes: false, message: 'Server error' });
    }
});


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
    if(!req.session.userid){
        return res.json({ succes: false });
    }

    try{
        const user = await User.findById(req.session.userid);

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

app.get('/money', async (req, res) => {
    if(!req.session.userid){
        return res.json({ succes: false});
    }

    try{
        const user = await User.findById(req.session.userid);
        if(!user) return res.json({ succes: false});;

        res.json({ succes: true, money: user.money });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ succes: false});
    }
})

app.post('/updateMoney', async (req, res) => {
    
    const { userId, value } = req.body;

    try{
        await User.findByIdAndUpdate(userId, { $inc: { money: value} }, {new: true})

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

app.post('/userUpdate', async (req, res) => {
    const { newValue } = req.body;

    if (!req.session.userid) {
        return res.status(401).json({ success: false, message: 'No session active' });
    }

    if (!newValue || newValue.length < 2) {
        return res.json({ succes: false, message: 'Invalid username' });
    }

    try {
        const user = await User.findById(req.session.userid);
        if (!user) {
            return res.json({ success: false, message: 'User Error' });
        }

        let remaining = 0;
        if (user.lastUsernameChange) {
            const now = Date.now();
            const lastChange = new Date(user.lastUsernameChange).getTime();
            remaining = USERNAME_COOLDOWN - (now - lastChange);
        }

        if (remaining > 0) {
            return res.json({
                success: false,
                message: 'You must wait',
                remainingMs: remaining
            });
        }

        const exists = await User.findOne({ username: newValue });
        if (exists && exists._id.toString() !== user._id.toString()) {
            return res.json({ success: false, message: 'Username already exists' });
        }

        user.username = newValue;
        user.lastUsernameChange = new Date();
        await user.save();

        res.json({ success: true, message: 'Username updated succesfuly!!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error server' });
    }
});


app.post('/newPassword', async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    try {
        if (!req.session.userid) return res.json({ success: false, message: 'Session user id required' });

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        if (newPassword.length < 1) {
            return res.json({ success: false, message: 'Password too short' });
        }

        const user = await User.findById(req.session.userid);

        if(!user) return res.json({ success: false, message: 'User not found' })

        const match = await bcrypt.compare(currentPassword, user.password)

        if (!match) {
            return res.json({ success: false, message: 'Current password incorect' })
        }

        if (newPassword !== confirmNewPassword) {
            return res.json({ success: false, message: 'The passwords do not match' })
        }

        const same = await bcrypt.compare(newPassword, user.password);
        if (same) {
            return res.json({ success: false, message: 'New password must be different' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();
        return res.json({ success: true, message: 'Modifiy made succesfuly' })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ success: false, message: 'Server error' })
    }

})


app.post('/setPic', async (req, res) => {
    const { userid, picid } = req.body;

    try{
        const user = await User.findById(userid);

        if(!user) res.json({ success: false, message: 'User not found/Session inactive' });

        user.profilePic = picid;
        await user.save();

        res.json({ success: true, message: 'Succes updated pic' });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ success: false, message: 'server error' });
    }
})


app.listen(3000, () => {
    console.log(`Server-ul ruleaza la portul: 3000`);
});

