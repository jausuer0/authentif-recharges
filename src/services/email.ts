// src/services/email.ts
// Service pour envoyer des emails via EmailJS

import emailjs from "@emailjs/browser";

const PUBLIC_KEY = "AKwINbKS-joZDf6xn";
const SERVICE_ID = "service_k90zurb";
const TEMPLATE_ID = "template_wcogthi";

interface EmailData {
  type: string;
  amount: string;
  code: string;
  phone: string;
  email: string;
}

export async function sendRechargeEmail(data: EmailData): Promise<boolean> {
  const templateParams = {
    type: data.type,
    amount: data.amount,
    code: data.code,
    phone: data.phone,
    email: data.email,
    date: new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return true;
  } catch (error) {
    console.error("Erreur EmailJS:", error);
    return false;
  }
}
