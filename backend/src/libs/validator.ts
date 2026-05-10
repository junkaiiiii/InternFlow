import { z } from 'zod'

export class ValidateSchema {
    public static idParamSchema = z.object({
        id: z.string().regex(/^\d+$/, "ID must be a number"),
    });

    

}

export class UserSchema extends ValidateSchema {
    public static loginSchema = z.object({
        username: z.string(),
        password: z.string()
    })

    public static createUserSchema = z.object({
        username: z.string().min(3).max(32),
        email: z.string().email(),
        password: z.string()
    });

    public static updateUserSchema = this.createUserSchema.partial(); // all fields optional
}