import * as React from 'react';
import {login} from '@/app/(main)/(pages)/login/_actions/login-action';
import {signup} from '@/app/(main)/(pages)/login/_actions/signup-action';

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  );
}
