'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSignIn } from '@clerk/clerk-react';
import { Card, CardHeader, CardContent } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { motion } from 'framer-motion';
import { useToast } from '@repo/ui/hooks/use-toast';
import { LogoPath } from '../../../lib/images';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * Zod schema for sign-in form validation.
 * Ensures email is valid and password meets minimum length requirement.
 */
const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

/**
 * SignInPage Component
 * 
 * This component handles user authentication for the application.
 * It provides a form for users to enter their credentials and manages
 * the sign-in process using Clerk authentication service.
 * 
 * @returns {JSX.Element} The rendered sign-in page
 */
export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const { toast } = useToast();
  const router = useRouter();

  console.log('Initial state:', { isLoading, isLoaded });

  /**
   * Initialize the form with react-hook-form and zod resolver.
   * This setup provides form validation and handling.
   */
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  console.log('Form initialized');

  /**
   * Handles form submission for user sign-in.
   * 
   * This function attempts to authenticate the user with the provided credentials.
   * It manages loading states, error handling, and successful sign-in redirection.
   * 
   * @param {SignInFormValues} data - The form data containing email and password
   */
  const onSubmit = async (data: SignInFormValues) => {
    console.log('Form submitted with data:', data);

    if (!isLoaded) {
      console.log('Clerk not loaded');
      toast({
        title: 'Error',
        description: 'Clerk is not loaded yet',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    console.log('Setting isLoading to true');

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === 'complete') {
        console.log('Sign-in complete, setting active session');
        await setActive({ session: result.createdSessionId });
        router.push('/home');
      } else {
        toast({
          title: 'Error',
          description: 'Sign-in incomplete',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error during sign-in process:', error);
      toast({
        title: 'Error',
        description:
          error.errors?.[0]?.longMessage || 'An error occurred during sign-in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      console.log('Setting isLoading to false');
    }
  };

  console.log('Rendering JSX');

  return (
    <div className="flex items-center justify-center min-h-screen p-5 pt-20 overflow-scroll">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="flex flex-col gap-2">
          <CardHeader className="p-2 items-center justify-center">
            <Image
              src="/resolvelogo.png"
              alt="Resolve Logo"
              width={200}
              height={200}
              quality={100}
              priority
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full items-center p-2">
              <p className="text-md ">Sign in to your account below.</p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                          inputMode="email"
                          className="text-base h-14"
                          autoComplete="email"
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
                          placeholder="Enter your password"
                          type="password"
                          className="text-base h-14"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-14"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
            <Button
              variant="outline"
              onClick={() => router.push('/sign-up')}
              className="w-full h-14"
            >
              Don't have an account? Sign Up
            </Button>
            <Button
              variant="link"
              onClick={() => router.push('/forgot-password')}
            >
              Forgot Password?
            </Button>
            <p className="text-muted-foreground text-xs text-center">
              By signing in, you agree to our Terms and Conditions. Created by
              Virtual Lobby Technology LTD.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
