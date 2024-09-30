'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSignIn } from '@clerk/clerk-react';
import { Card, CardHeader, CardContent } from '@repo/ui/components/ui/card';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
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

console.log('Initializing SignInPage component');

const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

export default function SignInPage() {
  console.log('Rendering SignInPage component');

  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const { toast } = useToast();
  const router = useRouter();

  console.log('Initial state:', { isLoading, isLoaded });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  console.log('Form initialized');

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
        // toast({
        //   title: 'Success',
        //   description: 'You have successfully signed in.',
        // });
        // Redirect to dashboard or home page
        router.push('/home');
      } else {
        console.log('Sign-in incomplete');
        // toast({
        //   title: 'Sign-in incomplete',
        //   description: `Status: ${result.status}`,
        //   variant: 'destructive',
        // });
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
          <CardHeader className="p-2">
            <AspectRatio ratio={2 / 1}>
              <LogoPath />
            </AspectRatio>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full items-center p-2">
              <p className="text-lg font-semibold">Sign In to Your Account</p>
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
                          className="text-base"
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
                          className="text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
            <Button variant="outline" onClick={() => router.push('/sign-up')}>
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
