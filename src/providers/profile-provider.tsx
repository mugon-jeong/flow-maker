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
import {useAuthContext} from '@/providers/auth-provider';
import {useToast} from '@/hooks/use-toast';

interface ProfileContextProps {
  fullname: string | null;
  username: string | null;
  website: string | null;
  avatar_url: string | null;
  loading: boolean;
  updateProfile: ({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) => Promise<void>;
}

interface ProfileProviderProps {
  children: ReactNode;
}

const ProfileContext = createContext<ProfileContextProps>({
  fullname: null,
  username: null,
  website: null,
  avatar_url: null,
  loading: true,
  updateProfile: async () => {},
});

export const ProfileProvider = ({children}: ProfileProviderProps) => {
  const supabase = supabaseClient();
  const {user} = useAuthContext();
  const {toast} = useToast();
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const updateProfile = useCallback(
    async ({
      username,
      website,
      avatar_url,
    }: {
      username: string | null;
      fullname: string | null;
      website: string | null;
      avatar_url: string | null;
    }) => {
      try {
        setLoading(true);
        const {error} = await supabase.from('profiles').upsert({
          id: user?.id as string,
          full_name: fullname,
          username,
          website,
          avatar_url,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
        toast({title: 'Profile updated!'});
        getProfile();
        setLoading(false);
      } catch (error) {
        toast({variant: 'destructive', title: 'Error updating the data!'});
      }
    },
    [fullname, supabase, toast, user],
  );

  const getProfile = useCallback(async () => {
    setLoading(true);
    const {data, error, status} = await supabase
      .from('profiles')
      .select(`full_name, username, website, avatar_url`)
      .eq('id', user?.id)
      .single();

    if (error && status !== 406) {
      toast({
        variant: 'destructive',
        title: 'Error updating the data!',
        description: error.message,
      });
    }

    if (data) {
      setFullname(data.full_name);
      setUsername(data.username);
      setWebsite(data.website);
      setAvatarUrl(data.avatar_url);
    }
    setLoading(false);
  }, [supabase, toast, user]);

  useEffect(() => {
    if (user) getProfile();
  }, [getProfile, user]);
  return (
    <ProfileContext.Provider
      value={useMemo(
        () => ({
          fullname,
          username,
          website,
          avatar_url,
          updateProfile,
          loading,
        }),
        [avatar_url, fullname, loading, updateProfile, username, website],
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
