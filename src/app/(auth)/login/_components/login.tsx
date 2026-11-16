
"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { INITIAL_LOGIN_FORM } from "@/constants/auth-constanst";
import { LoginForm, loginschema } from "@/validations/auth-validation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Login() {

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginschema),
        defaultValues: INITIAL_LOGIN_FORM,
    });

    const onSubmit = async (data: LoginForm) => {
        console.log(data);
    };


    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">
                    Welcome
                </CardTitle>

                <CardDescription>
                    Login to access all features
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>

                        {/* Email */}
                        <Field data-invalid={!!form.formState.errors.email}>
                            <FieldLabel htmlFor="email">
                                Email
                            </FieldLabel>

                            <Input
                                id="email"
                                type="email"
                                placeholder="Masukkan email"
                                aria-invalid={!!form.formState.errors.email}
                                {...form.register("email")}
                            />

                            <FieldError>
                                {form.formState.errors.email?.message}
                            </FieldError>
                        </Field>

                        {/* Password */}
                        <Field data-invalid={!!form.formState.errors.password}>
                            <FieldLabel htmlFor="password">
                                Password
                            </FieldLabel>

                            <Input
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
                                aria-invalid={!!form.formState.errors.password}
                                {...form.register("password")}
                            />

                            <FieldError>
                                {form.formState.errors.password?.message}
                            </FieldError>
                        </Field>

                        {/* Submit */}
                        <Field>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Loading..."
                                    : "Login"}
                            </Button>
                        </Field>

                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
