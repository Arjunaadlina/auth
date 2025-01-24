import express from "express";
import bcryt from "bcrypt";
import { User } from "../db/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/register', async(req,res)=>{
    const {username,email,password}= req.body;
    const oldEmailUser = await User.findOne({ email : email });
    const oldNamelUser = await User.findOne({ name : username });

    if(oldNamelUser){
        return res.send({data:"Nama sudah digunakan"});
    } else if (oldEmailUser){
        return res.send({data:"Email sudah digunakan"});
    }

    const encryptedPassword = await bcryt.hash(password, 10)

    try{
        await User.create({
            name: username,
            email:email,
            password: encryptedPassword,
        });
        res.send({status:"ok", data:"User telah didaftarkan"}); 
    } catch (error){
        res.send({status :"error", data: error});
    }
});

router.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
    const oldUser = await User.findOne({ email: email });

    if (!oldUser) {
        return res.send({ data: "Email Tidak terdaftar" });
    }

    const validPassword = await bcryt.compare(password, oldUser.password)

    if (validPassword) {
        const token = jwt.sign({ email: oldUser.email }, process.env.JWT_SECRET);
        return res.send({ status: "ok", data: token });
    } else {
        return res.send({ data : "Password anda salah" });
    }
});

router.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const useremail = user.email;

        const userData = await User.findOne({ email: useremail });
        if (!userData) {
            return res.status(404).send({ error: "User not found" });
        }
        return res.send({ status: "ok", data: userData });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.patch('/update/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }

        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.username) {
            user.username = req.body.username;
        }

        await user.save();
        res.status(201).json({ user, message: 'Berhasil update' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


export { router as UserRouter };