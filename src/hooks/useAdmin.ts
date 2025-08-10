import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdmin = () => {
  const makeUserAdmin = async (email: string) => {
    try {
      // First, get the user by email from auth.users
      const { data: users, error: getUserError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (getUserError) {
        throw getUserError;
      }

      if (!users || users.length === 0) {
        throw new Error('User not found');
      }

      const userId = users[0].user_id;

      // Check if user already has admin role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingRole) {
        toast({
          title: "Already admin",
          description: "This user is already an admin.",
        });
        return;
      }

      // Add admin role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Admin role assigned",
        description: "User has been given admin privileges.",
      });

    } catch (error: any) {
      console.error('Error making user admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign admin role.",
        variant: "destructive",
      });
    }
  };

  return { makeUserAdmin };
};