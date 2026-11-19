
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

import { INITIAL_LOGIN_FORM, INITIAL_STATE_LOGIN_FORM } from "@/constants/auth-constanst";
import { LoginForm, loginschemaFrom } from "@/validations/auth-validation";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
    const form = useForm<LoginForm>({
        resolver: zodResolver(loginschemaFrom),
        defaultValues: INITIAL_LOGIN_FORM,
    });

    const [loginState, loginAction, isPendingLogin] = useActionState(login, INITIAL_STATE_LOGIN_FORM);

    const onSubmit = async (data: LoginForm) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value])=> {
            formData.append(key, value);
        });

        startTransition(()=> {
            loginAction(formData);
        });
    };

    useEffect(()=> {
        if (loginState?.status === 'error') {
            toast.error('login failed', {
                description: loginState.errors?._form?.[0],
            });
            startTransition(()=> {
                loginAction(null);
            });
        }
    },[loginState]);

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
                              {isPendingLogin ? <Loader2 className="animate-spin"/> : 'login'}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
