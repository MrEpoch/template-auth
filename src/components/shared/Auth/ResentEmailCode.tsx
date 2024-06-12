"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { resendEmailVerificationCode } from "@/lib/actions/user.action";
import { useToast } from "@/components/ui/use-toast";

export default function ResendEmailCode() {
  const { toast } = useToast();

  async function handleSubmit() {
    const res = await resendEmailVerificationCode();
    console.log(res);

    toast({
      title: "Success",
      description: "Email verification code sent",
    });

    if (res.error) {
      toast({
        title: "Error",
        description: res.error,
        variant: "destructive",
      });
    }
    return;
  }

  return <Button onClick={handleSubmit}>Resend</Button>;
}
