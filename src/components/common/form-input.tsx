import * as React from "react";
import { FieldValues, Path, UseFormReturn, useFormState } from "react-hook-form";
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BaseFormInputProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

interface TextInputProps<T extends FieldValues>
    extends BaseFormInputProps<T>,
        Omit<React.ComponentProps<typeof Input>, "name" | "form" | "placeholder" | "className" | "disabled" | "type"> {
    type?: React.HTMLInputTypeAttribute;
}

interface TextareaInputProps<T extends FieldValues>
    extends BaseFormInputProps<T>,
        Omit<React.ComponentProps<typeof Textarea>, "name" | "form" | "placeholder" | "className" | "disabled"> {
    type: "textarea";
}

export type FormInputProps<T extends FieldValues> =
    | TextInputProps<T>
    | TextareaInputProps<T>;

export default function FormInput<T extends FieldValues>(props: FormInputProps<T>) {
    const {
        form,
        name,
        label,
        placeholder,
        type = "text",
        className,
        disabled,
        ...restProps
    } = props;

    // useFormState melanggan (subscribe) perubahan error secara reaktif di level komponen FormInput
    const { errors } = useFormState({
        control: form.control,
        name,
    });

    const error = errors[name];
    const isInvalid = !!error;

    return (
        <Field data-invalid={isInvalid}>
            {label && (
                <FieldLabel htmlFor={name}>
                    {label}
                </FieldLabel>
            )}

            {type === "textarea" ? (
                <Textarea
                    id={name}
                    placeholder={placeholder}
                    aria-invalid={isInvalid}
                    disabled={disabled}
                    className={className}
                    {...form.register(name)}
                    {...(restProps as React.ComponentProps<typeof Textarea>)}
                />
            ) : (
                <Input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    aria-invalid={isInvalid}
                    disabled={disabled}
                    className={className}
                    {...form.register(name)}
                    {...(restProps as React.ComponentProps<typeof Input>)}
                />
            )}

            {error?.message && (
                <FieldError>
                    {String(error.message)}
                </FieldError>
            )}
        </Field>
    );
}

