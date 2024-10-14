/**
 * @page.tsx Sign Up Page
 * This file contains the SignUpPage component for user registration.
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSignUp } from '@clerk/clerk-react';
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
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

/**
 * @schema Sign Up Form Schema
 * Defines the validation rules for the sign-up form fields.
 */
const signUpFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  code: z
    .string()
    .length(6, 'Verification code must be 6 characters')
    .optional(),
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

/**
 * @component SignUpPage
 * Handles user registration and email verification process.
 */
export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const { toast } = useToast();
  const router = useRouter();

  /**
   * @form Initialize form with react-hook-form and zod resolver
   */
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  /**
   * @function onSubmit
   * Handles form submission for user registration and email verification.
   */
  const onSubmit = async (data: SignUpFormValues) => {
    if (!isLoaded) {
      toast({
        title: 'Error',
        description: 'Clerk is not loaded yet',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);

    try {
      if (!verifying) {
        // Initial sign-up process
        const signUpResult = await signUp.create({
          firstName: data.firstName,
          lastName: data.lastName,
          emailAddress: data.email,
          password: data.password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });

        setVerifying(true);
        toast({
          title: 'Verification Required',
          description: 'Please check your email for a verification code.',
        });
      } else {
        // Email verification process
        const result = await signUp.attemptEmailAddressVerification({
          code: data.code!,
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          toast({
            title: 'Success',
            description: 'Your account has been created and verified.',
          });
          router.push('/home');
        } else {
          toast({
            title: 'Verification incomplete',
            description: `Status: ${result.status}`,
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.errors?.[0]?.longMessage || 'An error occurred during sign-up',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @render SignUpPage component
   */
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
              <p className="text-md">
                {verifying ? 'Verify Your Email' : 'Create Your Account'}
              </p>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {!verifying ? (
                  <>
                    {/* Registration form fields */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                              inputMode="text"
                              className="text-base h-14"
                              autoComplete="given-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              {...field}
                              inputMode="text"
                              className="text-base h-14"
                              autoComplete="family-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </>
                ) : (
                  // Verification code input
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter verification code"
                            {...field}
                            inputMode="numeric"
                            className="text-base h-14"
                            pattern="[0-9]*"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button
                  type="submit"
                  className="w-full h-14"
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Processing...'
                    : verifying
                      ? 'Verify Email'
                      : 'Sign Up'}
                </Button>
              </form>
            </Form>
            <Button
              variant="outline"
              onClick={() => router.push('/sign-in')}
              className="w-full h-14"
            >
              Already have an account? Sign In
            </Button>
            <p className="text-muted-foreground text-xs text-center">
              By creating an account, you agree to our Terms and Conditions.
              Created by Virtual Lobby Technology LTD.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
