import React, { Suspense } from "react";
import ResetPassword from "./reset-password";
import { Loader } from "lucide-react";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div>
          <Loader className="animate-spin" />
        </div>
      }
    >
      <ResetPassword />
    </Suspense>
  );
};

export default Page;
