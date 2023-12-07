import express from "express";

export default {
    name: "",
    description: "Get a user",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        try {
            
            res.send({
                text:"Hello from document"
            })
        }

        catch(err) {
            res.status(400)
            res.send("Test route response");
        }
    }
}