import z from "zod";

export const loginschema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email("please enter the valid email"),

    password: z
        .string()
        .min(8, 'Password is required')

});

export type LoginForm = z.infer<typeof loginschema>;