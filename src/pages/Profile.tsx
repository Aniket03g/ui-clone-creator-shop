import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, Edit, User, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define the form schema with zod
const profileFormSchema = z.object({
  full_name: z.string().optional(),
  phone_number: z.string().optional(),
  shipping_address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Define database profile structure
interface DatabaseProfile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  address?: any;
  shipping_address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

// Define the profile data structure for our app
interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  shipping_address: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      phone_number: '',
      shipping_address: {
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
      },
    },
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // First try to get the profile
        let { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to avoid error when no profile exists
        
        // If profile doesn't exist, create one
        if (!data && !error) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: user.id }])
            .select()
            .single();
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            toast({
              title: 'Error',
              description: 'Failed to create profile.',
              variant: 'destructive',
            });
          } else {
            data = newProfile;
          }
        } else if (error && error.code !== 'PGRST116') { // PGRST116 is the 'no rows returned' error
          console.error('Error fetching profile:', error);
          toast({
            title: 'Error',
            description: 'Failed to load profile data.',
            variant: 'destructive',
          });
        }
        
        if (data) {
          // Explicitly cast the data to handle any schema differences
          const profileData = data as any;
          
          // Get address data from either shipping_address or address field
          const addressData = profileData.shipping_address || profileData.address || null;
          
          // Transform database data to match our Profile type
          const transformedProfile: Profile = {
            id: profileData.id,
            full_name: profileData.full_name || null,
            phone_number: profileData.phone_number || null,
            shipping_address: addressData
          };
          
          setProfile(transformedProfile);
          
          // Update form values with profile data
          form.reset({
            full_name: transformedProfile.full_name || '',
            phone_number: transformedProfile.phone_number || '',
            shipping_address: addressData || {
              street: '',
              city: '',
              state: '',
              postal_code: '',
              country: '',
            },
          });
        } else {
          // If we still don't have a profile, create a default one in the state
          // This won't be saved to the database until the user submits the form
          const defaultProfile: Profile = {
            id: user.id,
            full_name: null,
            phone_number: null,
            shipping_address: null
          };
          
          setProfile(defaultProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast, form]);

  // Toggle between view and edit modes
  const toggleEditMode = () => {
    if (isEditMode && form.formState.isDirty) {
      // If switching from edit mode with unsaved changes, confirm first
      if (window.confirm('You have unsaved changes. Discard changes?')) {
        setIsEditMode(false);
        // Reset form to current profile values
        if (profile) {
          form.reset({
            full_name: profile.full_name || '',
            phone_number: profile.phone_number || '',
            shipping_address: profile.shipping_address || {
              street: '',
              city: '',
              state: '',
              postal_code: '',
              country: '',
            },
          });
        }
      }
    } else {
      setIsEditMode(!isEditMode);
    }
  };

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Prepare data for update or insert
      const profileData: any = {
        id: user.id,
        full_name: values.full_name,
        phone_number: values.phone_number,
        shipping_address: values.shipping_address,
      };
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      let error;
      
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id);
          
        error = updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([profileData]);
          
        error = insertError;
      }
      
      if (error) {
        console.error('Error saving profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to save profile.',
          variant: 'destructive',
        });
      } else {
        // Update local state
        setProfile({
          id: user.id,
          full_name: values.full_name || null,
          phone_number: values.phone_number || null,
          shipping_address: values.shipping_address || null,
        });
        
        toast({
          title: 'Success',
          description: 'Your profile has been updated.',
        });
        
        // Exit edit mode after successful save
        setIsEditMode(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>You need to be logged in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <Button 
            onClick={toggleEditMode} 
            variant={isEditMode ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            {isEditMode ? 'Cancel' : (
              <>
                <Edit className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
        
        {/* Account Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{profile?.full_name || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{profile?.phone_number || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    {profile?.shipping_address?.street ? (
                      <div className="font-medium">
                        <p>{profile.shipping_address.street}</p>
                        {profile.shipping_address.city && (
                          <p>
                            {profile.shipping_address.city}
                            {profile.shipping_address.state && `, ${profile.shipping_address.state}`} 
                            {profile.shipping_address.postal_code && ` ${profile.shipping_address.postal_code}`}
                          </p>
                        )}
                        {profile.shipping_address.country && <p>{profile.shipping_address.country}</p>}
                      </div>
                    ) : (
                      <p className="font-medium">Not provided</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Edit Profile Form - Only shown in edit mode */}
        {isEditMode && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Shipping Address</h3>
                      
                      <FormField
                        control={form.control}
                        name="shipping_address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="shipping_address.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="shipping_address.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your state/province" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="shipping_address.postal_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your postal code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="shipping_address.country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isSaving} className="w-full">
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
