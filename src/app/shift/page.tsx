import { redirect } from "next/navigation";

export default function page() {
  const defaultView = "staff" || "admin" || "regsterWorkPlace";
  return redirect(`/shift/${defaultView}`);
}

// const preferredSignInView =
// cookies().get("preferredSignInView")?.value || null;
// const defaultView = getDefaultSignInView(preferredSignInView);
