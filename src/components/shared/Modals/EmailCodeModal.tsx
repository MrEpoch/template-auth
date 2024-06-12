"use client";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React from "react";

export default function EmailCodeModal() {
  async function handleSubmit() {}

  return (
    <form className="max-w-xl dark:text-white items-center justify-center py-16 flex flex-col gap-5 shadow rounded-xl w-full bg-card text-black p-0 overflow-hidden">
      <InputOTP maxLength={8}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
          <InputOTPSlot index={6} />
          <InputOTPSlot index={7} />
        </InputOTPGroup>
      </InputOTP>
      <Button onClick={handleSubmit}>Verify</Button>
    </form>
  );
}
