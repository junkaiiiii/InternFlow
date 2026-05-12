import { Validator } from "./validator";

export class AuthValidator extends Validator{
    static signup = (data: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) => {
        const rest = {
            username: data.username,
            email: data.email,
            password: data.password,
        }
        const error = this.checkEmpty(rest);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
            return("Please enter a valid email address.");
        }

        if (data.password !== data.confirmPassword) {
            return ("The passwords are not same.");
        }
        
        return error ? error : null
    }

    static login = (data: {
        username: string;
        password: string;
    }) => {
        const error = this.checkEmpty(data);
        return error ? error : null
    }
}
