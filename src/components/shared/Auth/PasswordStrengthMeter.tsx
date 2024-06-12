import { Progress } from "@/components/ui/progress";
import React from "react";
import zxcvbn from "zxcvbn";

export const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const testedResult = zxcvbn(password);

  function passwordStrength(passwordChecked: any) {
    switch (passwordChecked.score) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-grey-500";
    }
  }
  return (
    <Progress
      value={testedResult.score * 25}
      indicatorThickness={2}
      indicatorColor={passwordStrength(testedResult)}
      className={`w-full`}
    />
  );
};
