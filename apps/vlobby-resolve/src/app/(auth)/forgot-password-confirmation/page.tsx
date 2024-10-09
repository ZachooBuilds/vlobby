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

console.log('Initializing ForgotPasswordConfirmationPage component');

const resetPasswordFormSchema = z
  .object({
    code: z.string().min(6, 'Verification code must be at least 6 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export default function ForgotPasswordConfirmationPage() {
  console.log('Rendering ForgotPasswordConfirmationPage component');

  const [isLoading, setIsLoading] = useState(false);
  const { client } = useClerk();
  const { toast } = useToast();
  const router = useRouter();

  console.log('Initial state:', { isLoading });

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  console.log('Form initialized');

  const onSubmit = async (data: ResetPasswordFormValues) => {
    console.log('Form submitted with data:', data);

    setIsLoading(true);
    console.log('Setting isLoading to true');

    try {
      const result = await client.signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.code,
        password: data.password,
      });

      if (result.status === 'complete') {
        toast({
          title: 'Success',
          description: 'Your password has been reset successfully.',
        });
        router.push('/sign-in');
      } else {
        throw new Error('Password reset failed');
      }
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
              <p className="text-lg font-semibold">Reset Your Password</p>
              <p className="text-sm text-center text-muted-foreground">
                Enter the verification code you received and your new password.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                          className="text-base"
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
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter new password"
                          type="password"
                          {...field}
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm new password"
                          type="password"
                          {...field}
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </Form>
            <Button variant="link" onClick={() => router.push('/sign-in')}>
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
