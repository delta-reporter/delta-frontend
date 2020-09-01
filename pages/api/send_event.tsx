import { NextApiRequest, NextApiResponse } from "next"

export default (req: NextApiRequest, res: NextApiResponse) => {
    // const inputValue = req.query["value"].toString()

    const event = req.query["event"].toString()
    console.log(event)
    if(!event){
        const responseBody = {
            message: "Please specify a event to be sent",
        }
        res.status(202).json(responseBody)
    } else {
        console.log(req.body)
        const responseBody = {
            message: "Event sent",
        }
        res.status(200).json(responseBody)
    }
  }
