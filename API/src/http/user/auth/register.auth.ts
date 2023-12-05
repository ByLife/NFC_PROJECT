import express from "express";
import bcrypt from "bcrypt";
import User from "../../../database/models/User";
import UTILS from "../../../utils";
import Logger from "../../../logger";

export default {
    name: "/user/auth/register",
    description: "Register a new user",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        try {
            // Get the username and password from the request body
            const userError = "User credentials missing - ";

            if (!req.query) return res.send({ error: "No Get Queries" });

            const firstName = req.query['firstName'];
            const lastName = req.query['lastName'];
            const password = req.query['password'];
            const phone_number = req.query['phoneNumber'];

            if (typeof firstName !== 'string' || typeof lastName !== 'string') return res.send({ error: userError + "First and Last Name must be strings" });
            
            if (firstName.length <= 3 || lastName.length <= 3) return res.send({ error: "First and last name must be more than 3 characters" });
            
            if (typeof password !== 'string') return res.send({ error: userError + "Password must be a string" });

            if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return res.send({ error: "Password must be more than 8 characters, include an uppercase letter, and a special character" });
            
            if( typeof phone_number !== "string") return res.send({ error: userError + "Phone must be a string" });
            if(phone_number.length < 9 || phone_number.length > 13) return res.send({error: userError + "Invalid phone number"})
            
            const findUser = await User.findOne({phone_number: phone_number})

            if(findUser) return res.send({error: userError + " User already exist"})

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
        
            const user = await User.create({
                firstName,
                lastName,
                phone_number,
                password: hashedPassword,
                user_id: UTILS.GENERATE.USER.default.ID,
                token: UTILS.GENERATE.USER.default.TOKEN,
            })

            Logger.info(`A user has been created under the name of ${firstName} ${lastName} and phone number ${phone_number}`)

            return res.send({
                info: "User created",
                data: user
            })

    
        } catch (err) {
            res.status(400).send("An error occurred");
        }
    }
}
