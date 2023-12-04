import express from "express";
import bcrypt from "bcrypt";
import User from "../../../database/models/User";
import Logger from "../../../logger";

export default {
    name: "/user/auth/get",
    description: "Get a user",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        try {

            if(!req.query) return res.send({error: "No Query"})

            const token = req.query['token'];
            
            if(typeof token !== "string") return res.send({error: "Token need to be a string"})
            
            if(token.length < 14) return res.send({error: "Token invalid"})
            
            const user = await User.findOne({token: token})
         
            if(!user) return res.send({error: "No user found with this ID"})

            return res.send({info: "User found", data: {
                userId: user.user_id,
                token: user.token
            }});

        } catch (err) {
            Logger.error(`Login error: ${err}`);
            res.status(400).send("An error occurred");
        }
    }
}
