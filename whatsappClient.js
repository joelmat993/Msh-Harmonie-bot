const axios = require("axios");

const API_VERSION = process.env.WHATSAPP_API_VERSION || "v20.0";
const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const TOKEN = process.env.WHATSAPP_TOKEN;

const BASE_URL = "https://graph.facebook.com/" + API_VERSION + "/" + PHONE_ID + "/messages";

function sendTextMessage(to, text) {
  return axios.post(
    BASE_URL,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text },
    },
    { headers: { Authorization: "Bearer " + TOKEN } }
  );
}

function sendButtonsMessage(to, text, buttons) {
  if (buttons.length <= 3) {
    return axios.post(
      BASE_URL,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "interactive",
        interactive: {
          type: "button",
          body: { text: text },
          action: {
            buttons: buttons.map(function (b, i) {
              return {
                type: "reply",
                reply: { id: String(i), title: b.label.slice(0, 20) },
              };
            }),
          },
        },
      },
      { headers: { Authorization: "Bearer " + TOKEN } }
    );
  }

  return axios.post(
    BASE_URL,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "interactive",
      interactive: {
        type: "list",
        body: { text: text },
        action: {
          button: "Choisir une option",
          sections: [
            {
              title: "Options",
              rows: buttons.map(function (b, i) {
                return { id: String(i), title: b.label.slice(0, 24) };
              }),
            },
          ],
        },
      },
    },
    { headers: { Authorization: "Bearer " + TOKEN } }
  );
}

function markAsRead(messageId) {
  return axios.post(
    BASE_URL,
    {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    },
    { headers: { Authorization: "Bearer " + TOKEN } }
  );
}

module.exports = {
  sendTextMessage: sendTextMessage,
  sendButtonsMessage: sendButtonsMessage,
  markAsRead: markAsRead,
};
