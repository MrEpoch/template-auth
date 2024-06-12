"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomField from "../CustomField";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createUser, logIn } from "@/lib/actions/user.action";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Must be 3 or more characters long" })
    .max(50, { message: "Must be 50 or fewer characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Must be 8 or more characters long" })
    .max(50, { message: "Must be 50 or fewer characters long" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Must be 8 or more characters long" })
    .max(50, { message: "Must be 50 or fewer characters long" })
    .refine(
      (data) => {
        console.log(formSchema.shape.password.safeParse(data).data);
        const passwordZodCheck = z.string().min(8).max(255);
        const passwordZodResult = passwordZodCheck.safeParse(data);
        if (!passwordZodResult.success) {
          return false;
        }

        return data === passwordZodResult.data;
      },
      {
        message: "Passwords do not match",
      },
    ),
});

export default function ActionForm({ isLogin }: { isLogin?: boolean }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isLogin
      ? {
          email: "",
          password: "",
        }
      : {
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
  });

  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    form.trigger();
    setSubmitting(true);

    if (isLogin) {
      const login = await logIn(data.email, data.password);
      if (login.error) {
        setSubmitting(false);
        toast({
          title: "Error",
          description: login.error,
          variant: "destructive",
        });
        return;
      }
      router.push("/account");
    } else {
      if (data.password !== data.confirmPassword) {
        setSubmitting(false);
        toast({
          title: "Error",
          description: "Passwords don't match",
          variant: "destructive",
        });
        return;
      }

      const registerData = {
        email: data.email,
        username: data.username,
        password: data.password,
      };

      const register = await createUser(registerData);
      if (register.error) {
        setSubmitting(false);
        toast({
          title: "Error",
          description: register.error,
          variant: "destructive",
        });
        return;
      }
      router.push("/account");
    }

    setSubmitting(false);
    return;
  }

  return (
    <Form {...form}>
      <form
        encType="multipart/form-data"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full"
        role="action-form"
        method="POST"
      >
        {!isLogin && (
          <CustomField
            control={form.control}
            name="username"
            formLabel={"Username (3-50 characters)*"}
            render={({ field }) => (
              <Input
                type="text"
                role="action-input-field"
                value={field.value}
                {...field}
              />
            )}
          />
        )}
        <CustomField
          control={form.control}
          name="email"
          formLabel={"Email*"}
          render={({ field }) => (
            <Input
              type="email"
              role="action-input-field"
              value={field.value}
              {...field}
            />
          )}
        />
        <CustomField
          control={form.control}
          name="password"
          formLabel={"Password (8-50 characters)*"}
          render={({ field }) => (
            <Input
              role="action-input-field"
              value={field.value}
              {...field}
              type="password"
            />
          )}
        />
        {!isLogin && (
          <PasswordStrengthMeter password={form.watch("password")} />
        )}
        {!isLogin && (
          <CustomField
            control={form.control}
            name="confirmPassword"
            formLabel={"Confirm Password (8-50 characters)*"}
            render={({ field }) => (
              <Input
                role="action-input-field"
                value={field.value}
                {...field}
                type="password"
              />
            )}
          />
        )}
        <Button disabled={submitting} type="submit">
          {isLogin ? "Login" : "Register"}
        </Button>
      </form>
    </Form>
  );
}
