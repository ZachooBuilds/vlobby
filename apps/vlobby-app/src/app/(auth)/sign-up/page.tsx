'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSignUp } from '@clerk/clerk-react';
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
import { isPlatform } from '@ionic/react';

console.log('Initializing SignUpPage component');

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

export default function SignUpPage() {
  console.log('Rendering SignUpPage component');

  const [isLoading, setIsLoading] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const { toast } = useToast();
  const router = useRouter();

  console.log('Initial state:', { isLoading, verifying, isLoaded });

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  console.log('Form initialized');

  const onSubmit = async (data: SignUpFormValues) => {
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

    toast({
      title: 'Form Submitted',
      description: JSON.stringify(data, null, 2),
    });

    try {
      if (!verifying) {
        console.log('Starting sign-up process');
        toast({ title: 'Creating sign-up' });
        const signUpResult = await signUp.create({
          firstName: data.firstName,
          lastName: data.lastName,
          emailAddress: data.email,
          password: data.password,
        });
        console.log('Sign-up created:', signUpResult);
        toast({
          title: 'Sign-up created',
          description: JSON.stringify(signUpResult, null, 2),
        });

        console.log('Preparing email verification');
        toast({ title: 'Preparing email verification' });
        const prepareResult = await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
        console.log('Email verification prepared:', prepareResult);
        toast({
          title: 'Email verification prepared',
          description: JSON.stringify(prepareResult, null, 2),
        });

        setVerifying(true);
        console.log('Setting verifying to true');
        toast({
          title: 'Verification Required',
          description: 'Please check your email for a verification code.',
        });
      } else {
        console.log('Attempting email verification');
        toast({ title: 'Attempting email verification' });
        const result = await signUp.attemptEmailAddressVerification({
          code: data.code!,
        });
        console.log('Verification result:', result);

        if (result.status === 'complete') {
          console.log('Verification complete, setting active session');
          await setActive({ session: result.createdSessionId });
          toast({
            title: 'Success',
            description: 'Your account has been created and verified.',
          });
          // Redirect to dashboard or home page
        } else {
          console.log('Verification incomplete');
          toast({
            title: 'Verification incomplete',
            description: `Status: ${result.status}`,
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      console.error('Error during sign-up process:', error);
      toast({
        title: 'Error',
        description: error.errors?.[0]?.longMessage || JSON.stringify(error),
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
              <p className="text-lg font-semibold">
                {verifying ? 'Verify Your Email' : 'Create Your Account'}
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {!verifying ? (
                  <>
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
                              className="text-base"
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
                              className="text-base"
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
                  </>
                ) : (
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
                            className="text-base"
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
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => {
                    console.log('Submit button clicked');
                    const errors = form.formState.errors;
                    if (Object.keys(errors).length > 0) {
                      console.log('Validation errors:', errors);
                    }
                  }}
                >
                  {isLoading
                    ? 'Processing...'
                    : verifying
                      ? 'Verify Email'
                      : 'Sign Up'}
                </Button>
              </form>
            </Form>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back
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
