"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "../../components/toast-provider";

export default function SignupPage() {
  const signup = useSignup();
  const router = useRouter();
  const { showToast } = useToast();

  const getErrorMessage = () => {
    const err = signup.error as any;
    const data = err?.response?.data ?? err?.data;
    const fieldMsg = data?.errors?.errors?.[0]?.msg;
    return fieldMsg || data?.message || "Something went wrong. Please try again.";
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [gender, setGender] = useState<0 | 1>(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formattedDob =
      dobDay && dobMonth && dobYear
        ? `${dobDay.padStart(2, "0")}-${dobMonth.padStart(2, "0")}-${dobYear}`
        : "";
    signup.mutate(
      {
        name: {
          first: firstName,
          last: lastName,
        },
        dateOfBirth: formattedDob,
        gender,
        phoneNumber,
        email,
        password,
      },
      {
        onSuccess: (data) => {
          const message =
            (data as any)?.data?.message ??
            "User created. Please verify your email.";
          showToast({
            title: "Signup successful",
            description: message,
          });
          router.push("/login");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100/80 via-emerald-50/50 to-white flex items-center justify-center px-4 py-8">
      <Card className="relative max-w-xl w-full overflow-hidden border border-emerald-200/80 bg-white shadow-xl shadow-emerald-100/50 rounded-2xl">
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-300/50 blur-3xl" />
        <div className="absolute -right-8 bottom-8 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
        <CardHeader className="pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            CV Studio
          </p>
          <CardTitle className="text-emerald-700 text-2xl">
            Create your creative CV studio
          </CardTitle>
          <CardDescription className="text-emerald-600/90">
            Sign up to start building and analyzing stunning, green-themed CVs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-emerald-800">
                  First name
                </Label>
                <Input
                  id="firstName"
                  placeholder="john"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-emerald-800">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  placeholder="doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-emerald-800">
                  Date of birth
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="dob-day"
                    type="number"
                    min={1}
                    max={31}
                    placeholder="DD"
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    className="w-16"
                    required
                  />
                  <Input
                    id="dob-month"
                    type="number"
                    min={1}
                    max={12}
                    placeholder="MM"
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    className="w-16"
                    required
                  />
                  <Input
                    id="dob-year"
                    type="number"
                    placeholder="YYYY"
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    className="flex-1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-emerald-800">
                  Gender
                </Label>
                <select
                  id="gender"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-emerald-500 focus-visible:ring-0 hover:border-emerald-300"
                  value={gender}
                  onChange={(e) => setGender(Number(e.target.value) as 0 | 1)}
                >
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-emerald-800">
                Phone number{" "}
              </Label>
              <Input
                id="phone"
                placeholder="01234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-emerald-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-emerald-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {signup.error && (
              <p className="text-sm text-red-400">{getErrorMessage()}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500 rounded-xl font-semibold tracking-wide shadow-md shadow-emerald-200/50 transition-all duration-200"
              disabled={signup.isPending}
            >
              {signup.isPending ? "Signing up..." : "Sign up"}
            </Button>

            <p className="text-xs text-emerald-700/80 text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-emerald-600 underline-offset-4 hover:text-emerald-700 hover:underline"
              >
                Log in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

