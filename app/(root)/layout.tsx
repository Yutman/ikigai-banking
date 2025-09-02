import Sidebar from "@/components/SideBar";
import Image from "next/image";
import MobileNav from "@/components/MobileNav";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/actions/user.actions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect('/sign-in');

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <main className="flex h-screen w-full font-inter overflow-x-hidden">
          <Sidebar user={loggedIn} />
          <div className="flex size-full flex-col">
            <div className="root-layout">
              <Image 
                src="/icons/logo.svg" 
                width={30} 
                height={30} 
                alt="logo" 
              />
              <div>
                <MobileNav user={loggedIn} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}