const db = require('../models')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloundinary = require('cloudinary').v2
const fs = require('fs')
const {Op} = require('sequelize')

const findUser = async(req,res,next)=> {

    try {

        const user = await db.User.findOne({ where : { id : req.params.id } })
        if(!user) return res.status(404).send({message : "No User"})

        const friend = await db.Friend.findOne({
            where : {
                [Op.or] : [
                    {
                        sender_id : req.user.id,
                        receiver_id : user.id
                    },
                    {
                        sender_id : user.id,
                        receiver_id : req.user.id
                    }
                ]
            }
        })

        let check = null
        if(!friend) check = "SEND"
        else if (friend.status === "ACCEPTED") check = "ACCEPT"
        else if (friend.status === "REQUESTED" && friend.sender_id === req.user.id ) check = "PENDING"
        else if (friend.status === "REQUESTED" && friend.receiver_id === req.user.id) check = "REQUEST"
        
        res.status(200).send({user,check})
        
    } catch (error) {
        next(error)
    }

}

const login = async(req,res,next) => {

    try {
        const User = await db.User.findOne({where : { username : req.body.username}})

        if (!User) {
            res.status(404).send({message : 'User Not Found'})
        }
        else {
            const checkPassword = bcryptjs.compareSync(req.body.password,User.password)

            if (checkPassword){
                    const payload = {
                        name : User.name,
                        id : User.id,
                        firstname : User.firstname,
                        lastname : User.lastname,
                        image : User.image
                    }

                    const token  = jwt.sign(payload, process.env.SECRET_OR_KEY, {expiresIn: 3600 * 5})

                    res.status(200).send({
                        token : token,
                        message : 'Login Successfully'
                    })

            }
            else {
                res.status(400).send({message : 'Password not correct'})
            }
        }

        // redirect to index page ....
    } catch (error) {
        next(error)
    }
   
}

// const logout = async(req,res) => {
//     req.session.destroy(() => {
//         req.logout();
//         res.redirect("/"); //Inside a callback… bulletproof!
//        });
// }

const register = async(req,res,next) => {

    try {
        const User = await db.User.findOne({where : { username : req.body.username}})
        if (User){
            res.status(400).send({message : 'Username already taken'})
        }
        else {

            const salt = bcryptjs.genSaltSync(12)
            const hash = bcryptjs.hashSync(req.body.password, salt)

            await db.User.create({
                username : req.body.username,
                password : hash,
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                phone : req.body.phone,
                // image : req.body.image
            })

            res.status(201).send({message : 'User Created'})

        }
    } catch (error) {
        next(error)
    }

}

const updateProfile = async (req,res,next) => {
    try {

        // console.log(req.file);
        const user = await db.User.findOne({where : {id : req.user.id}})
        if(!user){
            res.status(404).send({message : 'User not found'})
        }

        cloundinary.uploader.upload(req.file.path, async (err,result)=>{ // set photo in public to clound
            if(err) return next(err)

            await user.update({
                image : result.secure_url,
                firstname : req.body.firstname,
                lastname : req.body.lastname,
            }) // push photo from clond to database
            
            if(req.user.profileImg){
                const splited = req.user.profileImg.split('/')
                cloundinary.uploader.destroy(
                    splited[splited.length -1],split('.')[0],
                    (err, result) => {}
                )
            }

            fs.unlinkSync(req.file.path)
            res.status(201).send({message : 'Change Profile Photo complete'})
        })


        
    } catch (error) {
        next(error)
    }
}

const getUser = async (req,res) => {
    const user = await db.User.findAll()
    res.status(200).send(user)
}

module.exports = {
    login,
    register,
    // logout,
    getUser,
    updateProfile,
    findUser
}