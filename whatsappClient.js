/**
 * M-SANTE HARMONIE — Client WhatsApp Business API
 *
 * Ce module gère l'envoi de messages vers l'API WhatsApp Business (Meta Cloud API).
 * Variables d'environnement requises (voir .env.example) :
 *   - WHATSAPP_TOKEN       : jeton d'accès de l'application Meta
 *   - WHATSAPP_PHONE_ID    : identifiant du numéro de téléphone WhatsApp Business
 *   - WHATSAPP_API_VERSION : version de l'API Graph (ex: v20.0)
 *
 * Si vous utilisez un autre fournisseur (360dialog, Twilio), adapter
 * uniquement ce fichier — le reste du code n'a pas besoin de changer.
 */

const axios = require("axios");

const API_VERSION = process.env.WHATSAPP_API_VERSION || "v20.0";
const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const TOKEN = process.env.WHATSAPP_TOKEN;

const BASE_URL = `https://graph.facebook.com/${API_VERSION}/${PHONE_ID}/messages`;

/**
 * Envoie un message texte simple.
 */
async function sendTextMessage(to, text) {
  return axios.post(
    BASE_URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    },
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
}

/**
 * Envoie un message avec des boutons interactifs.
 * WhatsApp limite à 3 boutons maximum par message "reply button".
 * Pour plus de 3 options, on utilise une liste interactive ("list message").
 */
async function sendButtonsMessage(to, text, buttons) {
  if (buttons.length <= 3) {
    return axios.post(
      BASE_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "button",
          body: { text },
          action: {
            buttons: buttons.map((b, i) => ({
              type: "reply",
              reply: { id: String(i), title: b.label.slice(0, 20) }, // WhatsApp limite à 20 caractères
            })),
          },
        },
      },
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
  }

  // Plus de 3 boutons → liste interactive
  return axios.post(
    BASE_URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        body: { text },
        action: {
          button: "Choisir une option",
          sections: [
            {
              title: "Options",
              rows: buttons.map((b, i) => ({
                id: String(i),
                title: b.label.slice(0, 24), // WhatsApp limite à 24 caractères pour les listes
              })),
            },
          ],
        },
      },
    },
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
}

/**
 * Marque un message entrant comme "lu" (coche bleue).
 * Optionnel mais recommandé pour l'expérience utilisateur.
 */
async function markAsRead(messageId) {
  return axios.post(
    BASE_URL,
    {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    },
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
}

module.exports = { sendTextMessage, sendButtonsMessage, markAsRead };
