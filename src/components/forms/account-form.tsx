'use client';
import {useEffect, useState} from 'react';
import Avatar from '@/app/(main)/(pages)/account/_components/avatar';
import {useProfileContext} from '@/providers/profile-provider';
import {useAuthContext} from '@/providers/auth-provider';
import {Button} from '@/components/ui/button';
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
import {login} from '@/app/login/_actions/login-action';
import {ToastAction} from '@/components/ui/toast';
import * as React from 'react';
import {Input} from '@/components/ui/input';

const formSchema = z.object({
  email: z.string(),
  fullName: z.string(),
  username: z.string(),
});

export default function AccountForm() {
  const authContext = useAuthContext();
  const profileContext = useProfileContext();
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: authContext.user?.email ?? '',
      fullName: profileContext.fullname ?? '',
      username: profileContext.username ?? '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await profileContext.updateProfile({
      fullname: values.fullName,
      username: values.username,
      website: website,
      avatar_url: avatar_url,
    });
  }

  useEffect(() => {
    setAvatarUrl(profileContext.avatar_url);
    setFullname(profileContext.fullname);
    setUsername(profileContext.username);
    setWebsite(profileContext.website);
  }, [profileContext]);

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <Avatar
        uid={authContext.user?.id ?? null}
        url={avatar_url}
        size={150}
        onUpload={url => {
          setAvatarUrl(url);
          profileContext.updateProfile({
            fullname,
            username,
            website,
            avatar_url: url,
          });
        }}
      />
      <Form {...form}>
        <form className={'w-2/3'} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name={'email'}
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} value={authContext.user?.email} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'fullName'}
            render={({field}) => (
              <FormItem>
                <FormLabel>fullName</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'username'}
            render={({field}) => (
              <FormItem>
                <FormLabel>username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className={'flex flex-row w-full justify-evenly mt-10'}>
        <Button
          className="button primary block"
          onClick={() =>
            profileContext.updateProfile({
              fullname,
              username,
              website,
              avatar_url,
            })
          }
          disabled={profileContext.loading}
        >
          {profileContext.loading ? 'Loading ...' : 'Update'}
        </Button>

        <form action="/api/auth/signout" method="post">
          <Button className="button block" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
