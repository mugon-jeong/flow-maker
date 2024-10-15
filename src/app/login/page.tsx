'use client';
import * as React from 'react';
import {login} from '@/app/login/_actions/login-action';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {useToast} from '@/hooks/use-toast';
import {ToastAction} from '@/components/ui/toast';

const formSchema = z.object({
  email: z.string().email({
    message: 'Username must be a valid email',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const {toast} = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await login({...values});
    if (response) {
      toast({
        variant: 'destructive',
        title: 'Invalid credentials',
        description: `${response.error}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className={'flex flex-col gap-4'}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name={'email'}
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'password'}
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type={'password'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={'flex flex-row justify-evenly'}>
          <Button type={'submit'}>Log in</Button>
          <Button type={'button'} onClick={() => router.push('/login/signup')}>
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
}
