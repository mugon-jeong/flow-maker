'use client';
import {useEffect, useState} from 'react';
import Avatar from '@/app/(main)/(pages)/account/_components/avatar';
import {useProfileContext} from '@/providers/profile-provider';
import {useAuthContext} from '@/providers/auth-provider';

// ...

export default function AccountForm() {
  const authContext = useAuthContext();
  const profileContext = useProfileContext();
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setAvatarUrl(profileContext.avatar_url);
    setFullname(profileContext.fullname);
    setUsername(profileContext.username);
    setWebsite(profileContext.website);
  }, [profileContext]);

  return (
    <div className="form-widget">
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

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={authContext.user?.email}
          disabled
        />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={e => setFullname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={e => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
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
        </button>
      </div>

      <div>
        <form action="/api/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
