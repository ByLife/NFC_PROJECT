import express from "express";
import bcrypt from "bcrypt";
import User, { UserDocument } from "../../database/models/User";
import Logger from "../../logger";
import Product from "../../database/models/Product";

export default {
    name: "/product/changeowner",
    description: "Claim a product",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        try {

            if(!req.query) return res.send({error: "No Query"})

            const token = req.query['token'];
            const uid = req.query['uid'];
            const serialNumber = req.query['serialNumber'];
            const userId = req.query['userId'];
            
            if(typeof token !== "string") return res.send({error: "Token need to be a string"})
            if(typeof uid != "string") return res.send({error: "Token need to be a string"})
            if(typeof serialNumber != "string") return res.send({error: "Token need to be a string"})
            if(typeof userId != "string") return res.send({error: "userID need to be a string"})

            if(uid.length <= 0) return res.send({error: "UID invalid"})
            if(serialNumber.length < 5) return res.send({error: "Serial Number invalid"})
            if(userId.length < 5 ) return res.send({error: "UserID invalid"})

            if(token.length < 14) return res.send({error: "Token invalid"})
            
            const user = await User.findOne({token: token})
         
            if(!user) return res.send({error: "No user found with this Token"})
            
            const product = await Product.findOne({uid: uid, serial_id: serialNumber})

            if(!product) return res.send({error: "No product found with this UID and Serial Number"})

            if(product.actualOwner == null) return res.send({error: "The product has not been claimed"})
            if((product.actualOwner as UserDocument).token != token) Logger.fatal(`The user ${user.firstName} ${user.lastName} with phone ${user.phone_number} has illegaly made a request to change a product ownership from the product ${product.serial_id}`)
            if((product.actualOwner as UserDocument).token != token) return res.send({error: "The product has already an other owner"})

            const changeUser = await User.findOne({user_id: userId})

            if(!changeUser) return res.send({error: "Invalid User ID to change ownership"})


            product.actualOwner = changeUser

            product.previousOwners.push(user)

            await product.save()

            return res.send({info: "Product has been successfully claimed by the user", data: null});
        } catch (err) {
            Logger.error(`Login error: ${err}`);
            res.status(400).send("An error occurred");
        }
    }
}
