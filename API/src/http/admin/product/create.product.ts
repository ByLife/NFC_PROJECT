import express from "express";
import bcrypt from "bcrypt";
import User from "../../../database/models/User";
import Logger from "../../../logger";
import Product from "../../../database/models/Product";

export default {
    name: "/admin/product/create",
    description: "Create a product",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        try {
            if(!req.query) return res.send({error: "No Query"})
            // serial_id: {type: String, required: true, unique: true},
            // uid: {type: String, require: true},
            
            // price: {type: Number, required: true, unique: false},
            // productName: {type: String, required: true, unique: false},
        
            const token = req.query['token'];
            const serial_id = req.query['serialId'];
            const uid = req.query['uid'];
            const productName = req.query['productName']
            const price = req.query['price']

            if(typeof token !== "string") return res.send({error: "Token need to be a string"})
            if(typeof serial_id !== "string") return res.send({error: "SerialID need to be a string"})
            if(typeof uid !== "string") return res.send({error: "UID need to be a string"})
            if(typeof productName !== "string") return res.send({error: "Name need to be a string"})
            if(typeof price !== "string") return res.send({error: "Price need to be a string"})
            
            if(token.length < 14) return res.send({error: "Token invalid"})
            if(serial_id.length < 5) return res.send({error: "Serial ID invalid"})
            if(uid.length < 1) return res.send({error: "UID invalid"})
            if(productName.length < 3) return res.send({error: "Product name invalid"})
            if(price.length < 1) return res.send({error: "Price invalid"})

            const user = await User.findOne({token: token})

            if(!user) return res.send({error: "No user found with this Token"})
            if(user.role != 1) res.send({error: "User is not an admin"})

            Logger.info(`Create product request for the user under the name of ${user.firstName} and ${user.lastName} with phone number ${user.phone_number} and he is a ${user.role == 0 ? 'User' : 'Admin'}`)
            
            const finalPrice = Number(price)
            if(typeof finalPrice != "number") return res.send("Invalid Price")

            await Product.create({
                productName: productName,
                price: finalPrice,
                serial_id: serial_id,
                uid: uid
            })

            return res.send({info: "User found", data: user});
        } catch (err) {
            Logger.error(`Login error: ${err}`);
            res.status(400).send("An error occurred");
        }
    }
}
