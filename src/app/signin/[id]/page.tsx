import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getAuthTypes,
  getViewTypes,
  getDefaultSignInView,
  getRedirectMethod,
} from "@/features/auth/utils/settings";
import Card from "@/components/ui/Card";

import PasswordSignIn from "@/features/auth/components/PasswordSignIn";
import EmailSignIn from "@/features/auth/components/EmailSignIn";
import Separator from "@/features/auth/components/Separator";
import OauthSignIn from "@/features/auth/components/OauthSignIn";
import ForgotPassword from "@/features/auth/components/ForgotPassword";
import UpdatePassword from "@/features/auth/components/UpdatePassword";
import SignUp from "@/features/auth/components/Signup";

export default async function SignIn({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { disable_button: boolean };
}) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();
  console.log(params);
  console.log(searchParams.disable_button);
  // Declare 'viewProp' and initialize with the default value
  let viewProp: string;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof params.id === "string" && viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const preferredSignInView =
      cookies().get("preferredSignInView")?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}`);
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && viewProp !== "update_password") {
    return redirect("/");
  } else if (!user && viewProp === "update_password") {
    return redirect("/signin");
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <Card
          title={
            viewProp === "forgot_password"
              ? "Reset Password"
              : viewProp === "update_password"
              ? "Update Password"
              : viewProp === "signup"
              ? "Sign Up"
              : "Sign In"
          }
        >
          {viewProp === "password_signin" && (
            <PasswordSignIn
              allowEmail={allowEmail}
              redirectMethod={redirectMethod}
            />
          )}
          {viewProp === "email_signin" && (
            <EmailSignIn
              allowPassword={allowPassword}
              redirectMethod={redirectMethod}
              disableButton={searchParams.disable_button}
            />
          )}
          {viewProp === "forgot_password" && (
            <ForgotPassword
              allowEmail={allowEmail}
              redirectMethod={redirectMethod}
              disableButton={searchParams.disable_button}
            />
          )}
          {viewProp === "update_password" && (
            <UpdatePassword redirectMethod={redirectMethod} />
          )}
          {viewProp === "signup" && (
            <SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} />
          )}
          {viewProp !== "update_password" &&
            viewProp !== "signup" &&
            allowOauth && (
              <>
                <Separator text="Third-party sign-in" />
                <OauthSignIn />
              </>
            )}
        </Card>
      </div>
    </div>
  );
}
