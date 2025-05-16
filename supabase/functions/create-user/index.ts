import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the user from the JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(jwt);

    if (authError || !user) {
      throw new Error('Invalid token');
    }

    // Get user info from request body
    let userName = user.email?.split('@')[0] || 'New User';
    try {
      const body = await req.json();
      if (body.name) {
        userName = body.name;
      }
    } catch (e) {
      // If no body is provided, use default name
    }

    // Confirm the user's email automatically
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (confirmError) {
      throw confirmError;
    }

    // Create user profile
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: user.id,
        name: userName,
        avatar_url: null
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Create default categories for the user
    const defaultCategories = [
      { name: 'Work', color: '#3B82F6', user_id: user.id },
      { name: 'Personal', color: '#10B981', user_id: user.id },
      { name: 'Urgent', color: '#EF4444', user_id: user.id }
    ];

    const { error: categoriesError } = await supabaseAdmin
      .from('categories')
      .insert(defaultCategories);

    if (categoriesError) {
      throw categoriesError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});