const User = require('../models/user')
const bcrypt = require('bcrypt')

async function getAllUsers(req, res){
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({'message': 'error getting all users'})
    }
}

async function getOneUser(req, res){
    try {
        const { id } = req.params
        const user = await User.findById(id)
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({'message': 'error getting user by ID'})
    }
}

async function addUser(req, res){
    console.log(req.body)
    try {
        req.body.password = await bcrypt.hash(req.body.password, 12)
        const { name, password, role, email, phone, posts } = req.body
        const user = await new User({
            ...req.body
        }).save()

        res.status(201).json({ 'message': 'user successfully created'})
    } catch (error) {
        console.log(error)
        res.status(500).json({'message': 'error adding user'})
    }
}

async function deleteUser(req, res){
    try {
        const { id } = req.params
        const post = await User.findByIdAndDelete(id)
        res.json({"message": `User id ${id} had been deleted.`})
    } catch (error) {
        console.log(error)
        res.status(500).json({'message': 'error deleting post'})
    }
}

async function loginUser(req, res){
    try {
        const user = await User.findOne({ name: req.body.name })
        let result = await bcrypt.compare(req.body.password, user.password)
        if (result){
            res.send("passwords match!")
        } else {
            res.send("HAX")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({'message': 'error checking password'})
    }
}

module.exports = {
    getAllUsers,
    getOneUser,
    addUser,
    deleteUser,
    loginUser
}