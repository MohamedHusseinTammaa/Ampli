"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "../../components/toast-provider";

export default function LoginPage() {
  const login = useLogin();
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getErrorMessage = () => {
    const err = login.error as any;
    const data = err?.response?.data ?? err?.data;
    const fieldMsg = data?.errors?.errors?.[0]?.msg;
    return fieldMsg || data?.message || "Login failed. Please try again.";
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          const message =
            (data as any)?.data?.message ?? "Logged in successfully";
          showToast({
            title: "Login successful",
            description: message, 
          });
          router.push("/");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100/80 via-emerald-50/50 to-white flex items-center justify-center px-4 py-8">
      <Card className="relative max-w-md w-full overflow-hidden border border-emerald-200/80 bg-white shadow-xl shadow-emerald-100/50 rounded-2xl">
        <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-emerald-300/50 blur-3xl" />
        <CardHeader className="pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            CV Studio
          </p>
          <CardTitle className="text-emerald-700 text-2xl">
            Welcome back, creator
          </CardTitle>
          <CardDescription className="text-emerald-600/90">
            Log in to continue crafting and analyzing your CVs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
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
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {login.error && (
              <p className="text-sm text-red-400">{getErrorMessage()}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500 rounded-xl font-semibold tracking-wide shadow-md shadow-emerald-200/50 transition-all duration-200"
              disabled={login.isPending}
            >
              {login.isPending ? "Logging in..." : "Log in"}
            </Button>

            <p className="text-xs text-emerald-700/80 text-center">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-emerald-600 underline-offset-4 hover:text-emerald-700 hover:underline"
              >
                Create an account
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

