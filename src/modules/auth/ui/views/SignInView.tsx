"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Corrected import for App Router
import { FaGithub, FaGoogle } from "react-icons/fa";
import { OctagonAlertIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const SignInView = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Handles email and password sign-in
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setError(null);
        setPending(true);

        authClient.signIn.email(
            {
                email: values.email,
                password: values.password,
                callbackURL: "/",
            },
            {
                onSuccess: () => {
                    setPending(false);
                    router.push("/");
                },
                onError: ({ error }) => {
                    setError(error.message);
                    setPending(false); // Ensures button is re-enabled on error
                },
            }
        );
    };

    // Handles social provider sign-in
    const onSocial = (provider: "github" | "google") => {
        setError(null);
        setPending(true);

        authClient.signIn.social(
            {
                provider: provider,
                callbackURL: "/",
            },
            {
                onSuccess: () => {
                    setPending(false);
                },
                onError: ({ error }) => {
                    setError(error.message);
                    setPending(false); // Ensures button is re-enabled on error
                },
            }
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    {/* Column 1: Form */}
                    <div className="p-6 md:p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your account
                                    </p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="am@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                <Button
                                    disabled={pending}
                                    type="submit"
                                    className="w-full"
                                >
                                    Sign in
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        disabled={pending}
                                        onClick={() => onSocial("google")}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        <FaGoogle className="mr-2 h-4 w-4" /> Google
                                    </Button>
                                    <Button
                                        disabled={pending}
                                        onClick={() => onSocial("github")}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        <FaGithub className="mr-2 h-4 w-4" /> Github
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/sign-up" className="underline underline-offset-4">
                                        Sign up
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </div>

                    {/* Column 2: Branding */}
                    <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img src="/logo.svg" alt="Image" className="h-[92px] w-[92px]" />
                        <p className="text-2xl font-semibold text-white">
                            Simulade.AI
                        </p>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </div>
        </div>
    );
};
