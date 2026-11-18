
"use client";

import FormInput from "@/components/common/form-input";
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
    FieldGroup,
} from "@/components/ui/field";

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
                        <FormInput
                            form={form}
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="Masukkan email"
                        />

                        {/* Password */}
                        <FormInput
                            form={form}
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Masukkan password"
                        />

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
