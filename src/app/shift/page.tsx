import { redirect } from "next/navigation";
import PageContainer from "@/_components/PageContainer";

export default function page() {
  // const defaultView = "staff" || "admin" || "regsterWorkPlace";
  // return redirect(`/shift/${defaultView}`);
  return <PageContainer />;
}

// const preferredSignInView =
// cookies().get("preferredSignInView")?.value || null;
// const defaultView = getDefaultSignInView(preferredSignInView);
