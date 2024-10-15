'use client';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {supabaseClient} from '@/lib/supabase-client';

interface ProfileContextProps {
  fullname: string | null;
  username: string | null;
  website: string | null;
  avatar_url: string | null;
}

interface ProfileProviderProps {
  children: ReactNode;
}

const ProfileContext = createContext<ProfileContextProps>({
  fullname: null,
  username: null,
  website: null,
  avatar_url: null,
});

export const ProfileProvider = ({children}: ProfileProviderProps) => {
  const supabase = supabaseClient();
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  async function downloadImage(path: string) {
    try {
      const {data, error} = await supabase.storage
        .from('avatars')
        .download(path);
      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error);
    }
  }

  const getProfile = useCallback(async () => {
    const user = await supabase.auth.getUser();

    const {data, error, status} = await supabase
      .from('profiles')
      .select(`full_name, username, website, avatar_url`)
      .eq('id', user.data.user?.id)
      .single();

    if (error && status !== 406) {
      console.log(error);
      throw error;
    }

    if (data) {
      setFullname(data.full_name);
      setUsername(data.username);
      setWebsite(data.website);
      if (data.avatar_url) {
        await downloadImage(data.avatar_url);
      }
    }
  }, [supabase]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((auth, session) => {
      switch (auth) {
        case 'SIGNED_IN':
          getProfile();
          break;
        case 'SIGNED_OUT':
          setFullname(null);
          setUsername(null);
          setWebsite(null);
          setAvatarUrl(null);
          break;
        case 'USER_UPDATED':
          getProfile();
          break;
        default:
          break;
      }
    });
  }, [supabase, getProfile]);
  return (
    <ProfileContext.Provider
      value={useMemo(
        () => ({
          fullname,
          username,
          website,
          avatar_url,
        }),
        [avatar_url, fullname, username, website],
      )}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};
