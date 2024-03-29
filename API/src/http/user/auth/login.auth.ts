import express from "express";
import bcrypt from "bcrypt";
import User from "../../../database/models/User";
import Logger from "../../../logger";

export default {
    name: "/user/auth/login",
    description: "Login a user",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        try {
            const phone_number = req.query['phoneNumber'];
            const password = req.query['password'];
            const userError = "Login credentials missing - ";

            if (typeof phone_number !== 'string' || phone_number.length < 9 || phone_number.length > 13) return res.send({ error: userError + "Invalid phone number" });
            
            if (typeof password !== 'string') return res.send({ error: userError + "Password must be a string" });
            
            const user = await User.findOne({ phone_number: phone_number });
            if (!user) {
                return res.send({ error: userError + "User not found" });
            }

            const match = await bcrypt.compare(password, user.password);

            if(!match) Logger.warn(`Invalid login made for the user ${user.firstName} ${user.lastName} with the phone number ${user.phone_number}`)

            if (!match) return res.send({ error: "Invalid password" });
            
            Logger.info(`User logged in under the name of ${user.firstName} and ${user.lastName} with phone number ${user.phone_number} and he is a ${user.role == 0 ? 'User' : 'Admin'}`);
            return res.send({ info: "User successfully logged in", data: user });

        } catch (err) {
            Logger.error(`Login error: ${err}`);
            res.status(400).send("An error occurred");
        }
    }
}
