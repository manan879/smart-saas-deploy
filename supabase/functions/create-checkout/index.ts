
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoiceData } = await req.json();
    
    if (!invoiceData) {
      return new Response(
        JSON.stringify({ error: 'Invoice data is required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log the request for debugging
    console.log('Creating checkout for invoice:', invoiceData.invoice_number);

    // Create a checkout session with Lemon Squeezy
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LEMON_SQUEEZY_API_KEY")}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            store_id: parseInt(Deno.env.get("LEMON_SQUEEZY_STORE_ID") || "0"),
            custom_price: Math.round(invoiceData.total_amount * 100), // Convert to cents
            checkout_data: {
              email: invoiceData.client_email,
              name: invoiceData.client_name,
              custom: {
                invoice_id: invoiceData.id || null,
                invoice_number: invoiceData.invoice_number
              }
            },
            product_options: {
              name: `Invoice #${invoiceData.invoice_number}`,
              description: `Payment for services rendered to ${invoiceData.client_name}`,
              redirect_url: `${req.headers.get("origin")}/invoice/${invoiceData.id}`
            }
          }
        }
      })
    });

    const result = await response.json();
    
    // Log the response for debugging
    console.log('Lemon Squeezy response status:', response.status);
    
    if (!response.ok) {
      console.error('Lemon Squeezy error:', result);
      return new Response(
        JSON.stringify({ error: 'Failed to create checkout session', details: result }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return the checkout URL
    return new Response(
      JSON.stringify({ 
        url: result.data?.attributes?.url,
        success: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error('Error in create-checkout function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
