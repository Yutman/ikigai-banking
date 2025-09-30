"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CustomInput from "./CustomInput";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { authFormSchema } from "@/lib/utils";
import PlaidLink from "./PlaidLink";

import { Loader2 } from "lucide-react";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";
import LoadingSpinner from "./LoadingSpinner";
import { useLoading } from "@/lib/contexts/LoadingContext";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter(); // Initialize router here
  const [user, setUser] = useState(null);
  const formSchema = authFormSchema(type);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { setLoading, setLoadingMessage } = useLoading();

  React.useEffect(() => {
    const fetchLoggedInUser = async () => {
      const user = await getLoggedInUser();
      setLoggedInUser(user);
    };
    fetchLoggedInUser();
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    // Log client-side context for debugging
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isIOSWhatsApp = userAgent.includes("WhatsApp") && isIOS;

    console.log("Client-side sign-up context:", {
      userAgent,
      referrer: document.referrer,
      url: window.location.href,
      isWhatsApp: userAgent.includes("WhatsApp"),
      isIOS,
      isIOSWhatsApp,
      isMobile: /Mobile|Android|iPhone|iPad/.test(userAgent),
      timestamp: new Date().toISOString(),
    });

    // iOS-specific error handling
    if (isIOSWhatsApp) {
      console.log("iOS WhatsApp detected - applying special handling");

      // Add a small delay for iOS to ensure proper initialization
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Set global loading state
    setLoading(true);
    setLoadingMessage(
      type === "sign-up" ? "Creating your account..." : "Signing you in..."
    );

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Request timeout. Please try again.");
      setIsLoading(false);
    }, 60000); // 60 second timeout

    try {
      // Sign up with Appwrite & create plaid token
      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email!,
          password: data.password,
        };
        const newUser = await signUp(userData);
        setUser(newUser);
        // Stop loading after successful sign-up, but stay on Connect Bank page
        setLoading(false);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) {
          // Keep loading spinner active during navigation
          router.push("/");
          // The loading will end when the new page loads
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setLoading(false); // Hide loading on error

      // Set user-friendly error message
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      clearTimeout(timeoutId); // Clear timeout
      setIsLoading(false);
    }
  };

  // Handle loading state for successful sign-up
  React.useEffect(() => {
    if (user && type === "sign-up") {
      // For sign-up, stay on the Connect Bank page - don't redirect automatically
      // The user should connect a bank first before going to home
      console.log("User created successfully, staying on Connect Bank page");
    }
  }, [user, type, router]);

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Ikigai logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Ikigai
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="County"
                      placeholder="Example: NY"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Example: 11101"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      label="KRA-PIN"
                      placeholder="Example: 1234"
                    />
                  </div>
                </>
              )}

              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />

              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />

              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
