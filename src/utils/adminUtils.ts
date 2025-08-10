import { supabase } from '@/integrations/supabase/client';

// Utility function to make current user admin
// You can use this from browser console after signing up:
// import('/src/utils/adminUtils.ts').then(module => module.makeCurrentUserAdmin())
export const makeCurrentUserAdmin = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('No authenticated user found');
      return;
    }

    // Check if user already has admin role
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking admin role:', checkError);
      return;
    }

    if (existingRole) {
      console.log('User is already an admin');
      return;
    }

    // Add admin role
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: 'admin'
      });

    if (insertError) {
      console.error('Error adding admin role:', insertError);
      return;
    }

    console.log('✅ Admin role assigned successfully! Refresh the page to see changes.');
    
    // Refresh the page to update the UI
    window.location.reload();

  } catch (error) {
    console.error('Error making user admin:', error);
  }
};

// Make it available globally for easier access
(window as any).makeCurrentUserAdmin = makeCurrentUserAdmin;