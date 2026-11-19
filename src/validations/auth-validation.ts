import z from "zod";

export const loginschemaFrom = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email("please enter the valid email"),

    password: z
        .string()
        .min(8, 'Password minimal 8 karakter')

});

export type LoginForm = z.infer<typeof loginschemaFrom>;