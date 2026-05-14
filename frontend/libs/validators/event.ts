import { TEventCreation } from "@/types/types";
import { Validator } from "./validator";

export class EventValidator extends Validator{
    static createEvent = (data: TEventCreation) => {
        const error = this.checkEmpty(data)

        if (error) return error

        if (data.duration <= 0){
            return "Duration should be positive number"
        }

        return null
    }


    static updateEvent = (data: Partial<TEventCreation>) => {

        const error = this.checkEmpty(data)

        return error ? error : null
    }
}