import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing form email request...');
    
    const { formData: formFields } = await req.json();
    
    if (!formFields || typeof formFields !== 'object') {
      throw new Error('Invalid form data provided');
    }

    // Get the Web3Forms API key from environment
    const web3FormsKey = Deno.env.get('WEB3FORMS_API_KEY');
    if (!web3FormsKey) {
      console.error('WEB3FORMS_API_KEY not found in environment');
      throw new Error('Email service not configured');
    }

    // Create FormData for Web3Forms
    const web3FormData = new FormData();
    web3FormData.append('access_key', web3FormsKey);
    
    // Add all form fields to the FormData
    Object.entries(formFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        web3FormData.append(key, String(value));
      }
    });

    console.log('Sending email via Web3Forms...');
    
    // Submit to Web3Forms
    const web3Response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: web3FormData
    });

    if (!web3Response.ok) {
      const errorText = await web3Response.text();
      console.error('Web3Forms error:', errorText);
      throw new Error(`Failed to send email: ${web3Response.status}`);
    }

    const responseData = await web3Response.json();
    console.log('Email sent successfully:', responseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        data: responseData 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-form-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});