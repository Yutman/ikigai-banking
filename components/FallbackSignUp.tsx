"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FallbackSignUpProps {
  onSuccess?: () => void;
}

const FallbackSignUp = ({ onSuccess }: FallbackSignUpProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    dateOfBirth: "",
    kraPin: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateForm = () => {
    // Validate postal code format (US format)
    const postalCodeRegex = /^\d{5}(-\d{4})?$/;
    if (!postalCodeRegex.test(formData.postalCode)) {
      throw new Error("Postal code must be in format 12345 or 12345-6789");
    }

    // Validate KRA-PIN format
    const kraPinRegex = /^\d{3}-\d{2}-\d{4}$/;
    if (!kraPinRegex.test(formData.kraPin)) {
      throw new Error("KRA-PIN must be in format XXX-XX-XXXX");
    }

    // Validate date of birth (must be 18+ years old)
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }

    if (calculatedAge < 18) {
      throw new Error("You must be at least 18 years old to create an account");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form data
      validateForm();
      // Use fetch API instead of server actions for better browser compatibility
      const response = await fetch("/api/auth/signup-fallback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Sign-up failed");
      }

      // Success
      console.log("Fallback sign-up successful");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Fallback sign-up error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Browser Compatibility Mode:</strong> Using alternative sign-up
          method for better compatibility.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="address1">Address</Label>
          <Input
            id="address1"
            type="text"
            value={formData.address1}
            onChange={(e) =>
              setFormData({ ...formData, address1: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              type="text"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              type="text"
              placeholder="12345 or 12345-6789"
              value={formData.postalCode}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                if (value.length > 5) {
                  value = value.slice(0, 5) + "-" + value.slice(5, 9);
                }
                setFormData({ ...formData, postalCode: value });
              }}
              required
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="kraPin">KRA-PIN</Label>
          <Input
            id="kraPin"
            type="text"
            placeholder="123-45-6789"
            value={formData.kraPin}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
              if (value.length > 3) {
                value =
                  value.slice(0, 3) +
                  "-" +
                  value.slice(3, 5) +
                  "-" +
                  value.slice(5, 9);
              } else if (value.length > 5) {
                value =
                  value.slice(0, 3) +
                  "-" +
                  value.slice(3, 5) +
                  "-" +
                  value.slice(5, 9);
              }
              setFormData({ ...formData, kraPin: value });
            }}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Required for payment processing. Format: XXX-XX-XXXX
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-bank-gradient text-white hover:opacity-90"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
};

export default FallbackSignUp;
