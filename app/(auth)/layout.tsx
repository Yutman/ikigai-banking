import Image from "next/image";
import { LoadingProvider } from "@/lib/contexts/LoadingContext";
import GlobalLoading from "@/components/GlobalLoading";
import ErrorBoundary from "@/components/ErrorBoundary";
import DevErrorHandler from "@/components/DevErrorHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ErrorBoundary>
      <DevErrorHandler>
        <LoadingProvider>
          <main className="flex min-h-screen w-full justify-betwee font-inter">
            {children}
            <div className="auth-asset">
              <div>
                <Image
                  src="/icons/auth-image.svg"
                  alt="Auth-image"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </main>
          <GlobalLoading />
        </LoadingProvider>
      </DevErrorHandler>
    </ErrorBoundary>
  );
}

// create auth image from screenshot of own account
// and add it to the public/icons folder
