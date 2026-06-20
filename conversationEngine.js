/**
 * M-SANTE HARMONIE — Moteur de conversation
 *
 * C'est ici que se prend la décision : "à ce message, quel noeud afficher ?"
 * Logique appliquée, dans cet ordre de priorité :
 *
 *   1. Détection de mot-clé d'urgence (TOUJOURS prioritaire, quel que soit
 *      le noeud courant) → bascule immédiate vers le protocole d'urgence
 *   2. Si l'utilisateur a cliqué un bouton → suivre le "next" du bouton
 *   3. Si le noeud courant attend un texte libre (freeText: true) →
 *      avancer vers nextAfterFreeText
 *   4. Sinon → rester sur le noeud courant et le ré-afficher (fallback)
 */

const { NODES } = require("./content");
const { detectEmergency } = require("./emergencyDetection");
const {
  getOrCreateSession,
  updateSession,
  logInteraction,
  hashPhoneNumber,
} = require("./database");

/**
 * Résout le texte d'un noeud, en tenant compte du branchement conditionnel
 * (Module 6 — réponse différente selon le profil sauvegardé à l'étape de cadrage).
 */
function resolveNodeText(node, profile) {
  if (!node.conditional) return node.text;

  const profileKey = profile && node.textByProfile[profile] ? profile : "default";
  return node.textByProfile[profileKey];
}

/**
 * Traite un message entrant et retourne le noeud à afficher à l'utilisateur.
 *
 * @param {string} phoneNumber - numéro WhatsApp de l'utilisateur (jamais stocké en clair)
 * @param {string} messageText - texte du message reçu (vide si l'utilisateur a cliqué un bouton)
 * @param {string|null} buttonId - id du bouton cliqué, le cas échéant
 * @returns {{ node: object, nodeId: string, sessionId: string }}
 */
function processMessage(phoneNumber, messageText, buttonId = null) {
  const session = getOrCreateSession(phoneNumber);
  const sessionId = session.id;

  // ─── PRIORITÉ 1 : détection d'urgence sur le texte libre ───────────────
  // (s'applique seulement si l'utilisateur a tapé du texte, pas s'il a cliqué un bouton)
  if (messageText && !buttonId) {
    const emergency = detectEmergency(messageText);
    if (emergency.matched) {
      const targetNode = NODES[emergency.targetNode];
      updateSession(sessionId, { currentNode: emergency.targetNode });
      logInteraction(sessionId, emergency.targetNode, true);
      return { node: targetNode, nodeId: emergency.targetNode, sessionId };
    }
  }

  const currentNodeId = session.current_node;
  const currentNode = NODES[currentNodeId];

  // ─── PRIORITÉ 2 : l'utilisateur a cliqué un bouton ──────────────────────
  if (buttonId !== null && currentNode.buttons) {
    const buttonIndex = parseInt(buttonId, 10);
    const chosenButton = currentNode.buttons[buttonIndex];

    if (chosenButton) {
      // Si ce bouton sauvegarde un profil (Module 6, étape de cadrage)
      const newProfile = chosenButton.saveProfile || session.profile;

      const nextNodeId = chosenButton.next;
      const nextNode = NODES[nextNodeId];

      updateSession(sessionId, { currentNode: nextNodeId, profile: newProfile });
      logInteraction(sessionId, nextNodeId, !!nextNode.isUrgence);

      return { node: nextNode, nodeId: nextNodeId, sessionId, profile: newProfile };
    }
  }

  // ─── PRIORITÉ 3 : le noeud courant attend un texte libre ────────────────
  if (currentNode.freeText && messageText) {
    const nextNodeId = currentNode.nextAfterFreeText;
    const nextNode = NODES[nextNodeId];

    updateSession(sessionId, { currentNode: nextNodeId });
    logInteraction(sessionId, nextNodeId, !!nextNode.isUrgence);

    return { node: nextNode, nodeId: nextNodeId, sessionId, profile: session.profile };
  }

  // ─── PRIORITÉ 4 (fallback) : ré-afficher le noeud courant ────────────────
  // Arrive si le message n'a pas pu être interprété (ex: utilisateur tape
  // n'importe quoi sur un noeud qui attend un clic de bouton).
  logInteraction(sessionId, currentNodeId, !!currentNode.isUrgence);
  return { node: currentNode, nodeId: currentNodeId, sessionId, profile: session.profile };
}

/**
 * Prépare le message à envoyer pour un noeud donné (résout le texte conditionnel).
 */
function buildOutgoingMessage(node, profile) {
  const text = resolveNodeText(node, profile);
  const buttons = node.buttons || null;
  return { text, buttons };
}

module.exports = { processMessage, buildOutgoingMessage, resolveNodeText };
