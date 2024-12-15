import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default function Home() {
  const isAuth = (): boolean => {
    const token = cookies().get("sb-127-auth-token-code-verifier")?.value;
    return token !== undefined && token !== null && token !== "";
  };
  if (isAuth()) {
    return redirect("/shift");
  } else {
    return redirect("/signin");
  }
  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <div className="">
      {/* <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"> */}
      <main className="">{/* <PageContainer /> */}</main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
