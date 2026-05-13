import { z } from 'zod'
import { ApplicationPriority } from '@prisma/client';

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
        username: z.string(),
        email: z.string().email(),
        password: z.string()
    });

    public static updateUserSchema = this.createUserSchema.partial(); // all fields optional
}

export class BoardSchema extends ValidateSchema {
    public static createApplicationSchema = z.object({
        order: z.number(),
        columnId: z.number(),
        company: z.string(),
        role: z.string(),
        priority: z.nativeEnum(ApplicationPriority), // Validate against Prisma enum
        appliedAt: z.string().date().optional(),
        url: z.string()
    })

    public static reorderCardsSchema = z.object({
        fromCol: z.number(),
        toCol: z.number(),
        cardId: z.number(),
        newIndex: z.number()
    })
}