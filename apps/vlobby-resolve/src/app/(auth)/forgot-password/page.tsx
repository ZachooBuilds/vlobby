'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClerk } from '@clerk/clerk-react';
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

console.log('Initializing ForgotPasswordPage component');

const forgotPasswordFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPasswordPage() {
  console.log('Rendering ForgotPasswordPage component');

  const [isLoading, setIsLoading] = useState(false);
  const { client } = useClerk();
  const { toast } = useToast();
  const router = useRouter();

  console.log('Initial state:', { isLoading });

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  console.log('Form initialized');

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    console.log('Form submitted with data:', data);

    setIsLoading(true);
    console.log('Setting isLoading to true');

    try {
      await client.signIn.create({
        strategy: 'reset_password_email_code',
        identifier: data.email,
      });

      toast({
        title: 'Success',
        description:
          'If an account exists for this email, you will receive a password reset link.',
      });

      // Optionally, redirect to a confirmation page
      router.push('/forgot-password-confirmation');
    } catch (error: any) {
      console.error('Error during password reset process:', error);
      toast({
        title: 'Error',
        description:
          error.errors?.[0]?.longMessage ||
          'An error occurred during the password reset process',
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
              <p className="text-lg font-semibold">Forgot Password</p>
              <p className="text-sm text-center text-muted-foreground">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Reset Password'}
                </Button>
              </form>
            </Form>
            <Button variant="link" onClick={() => router.push('/sign-in')}>
              Back to Sign In
            </Button>
            <p className="text-muted-foreground text-xs text-center">
              If you don't have an account, you can{' '}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => router.push('/sign-up')}
              >
                Sign Up
              </Button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
