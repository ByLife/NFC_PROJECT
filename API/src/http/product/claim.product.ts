import express from "express";
import bcrypt from "bcrypt";
import User from "../../database/models/User";
import Logger from "../../logger";
import Product from "../../database/models/Product";

export default {
    name: "/product/claim",
    description: "Claim a product",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        try {

            if(!req.query) return res.send({error: "No Query"})

            const token = req.query['token'];
            const uid = req.query['uid'];
            const serialNumber = req.query['serialNumber'];
            Logger.debug(token)
            if(typeof token !== "string") return res.send({error: "Token need to be a string"})
            if(typeof uid != "string") return res.send({error: "Token need to be a string"})
            if(typeof serialNumber != "string") return res.send({error: "Token need to be a string"})

            if(uid.length <= 0) return res.send({error: "UID invalid"})
            if(serialNumber.length < 5) return res.send({error: "Serial Number invalid"})

            if(token.length < 14) return res.send({error: "Token invalid"})
            
            const user = await User.findOne({token: token})
         
            if(!user) return res.send({error: "No user found with this Token"})
            
            const product = await Product.findOne({uid: uid, serial_id: serialNumber})

            if(!product) return res.send({error: "No product found with this UID and Serial Number"})

            
            if(product.actualOwner != null) return res.send({error: "The product has already an owner"})

            Logger.debug(user)
            product.actualOwner = user

            await product.save()

            return res.send({info: "Product has been successfully claimed by the user", data: {product, user}});
        } catch (err) {
            Logger.error(`Login error: ${err}`);
            res.status(400).send("An error occurred");
        }
    }
}
