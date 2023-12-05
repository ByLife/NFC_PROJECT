import express from "express";
import bcrypt from "bcrypt";
import User from "../../../database/models/User";
import Logger from "../../../logger";
import Product from "../../../database/models/Product";

export default {
    name: "/user/product/get",
    description: "Get a user",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        try {
            if(!req.query) return res.send({error: "No Query"})

            const token = req.query['token'];

            if(typeof token !== "string") return res.send({error: "Token need to be a string"})
            
            if(token.length < 14) return res.send({error: "Token invalid"})

            const user = await User.findOne({token: token})

            if(!user) return res.send({error: "No user found with this Token"})

            Logger.info(`Get request for the user under the name of ${user.firstName} and ${user.lastName} with phone number ${user.phone_number} and he is a ${user.role == 0 ? 'User' : 'Admin'}`)
            
            const product = await Product.find({actualOwner: user})

            product.length != 0 ? res.send({info: "Products found", data: product}) : res.send({info: "No products found", data: null})
        } catch (err) {
            Logger.error(`Login error: ${err}`);
            res.status(400).send("An error occurred");
        }
    }
}
