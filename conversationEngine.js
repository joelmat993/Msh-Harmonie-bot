const { NODES } = require("./content");
const { detectEmergency } = require("./emergencyDetection");
const {
  getOrCreateSession,
  updateSession,
  logInteraction,
} = require("./database");

function resolveNodeText(node, profile) {
  if (!node.conditional) return node.text;
  const profileKey = profile && node.textByProfile[profile] ? profile : "default";
  return node.textByProfile[profileKey];
}

function processMessage(phoneNumber, messageText, buttonId) {
  const session = getOrCreateSession(phoneNumber);
  const sessionId = session.id;

  if (messageText && !buttonId) {
    const emergency = detectEmergency(messageText);
    if (emergency.matched) {
      const targetNode = NODES[emergency.targetNode];
      updateSession(sessionId, { currentNode: emergency.targetNode });
      logInteraction(sessionId, emergency.targetNode, true);
      return { node: targetNode, nodeId: emergency.targetNode, sessionId: sessionId };
    }
  }

  const currentNodeId = session.current_node;
  const currentNode = NODES[currentNodeId];

  if (buttonId !== null && buttonId !== undefined && currentNode.buttons) {
    const buttonIndex = parseInt(buttonId, 10);
    const chosenButton = currentNode.buttons[buttonIndex];

    if (chosenButton) {
      const newProfile = chosenButton.saveProfile || session.profile;
      const nextNodeId = chosenButton.next;
      const nextNode = NODES[nextNodeId];

      updateSession(sessionId, { currentNode: nextNodeId, profile: newProfile });
      logInteraction(sessionId, nextNodeId, !!nextNode.isUrgence);

      return { node: nextNode, nodeId: nextNodeId, sessionId: sessionId, profile: newProfile };
    }
  }

  if (currentNode.freeText && messageText) {
    const nextNodeId = currentNode.nextAfterFreeText;
    const nextNode = NODES[nextNodeId];

    updateSession(sessionId, { currentNode: nextNodeId });
    logInteraction(sessionId, nextNodeId, !!nextNode.isUrgence);

    return { node: nextNode, nodeId: nextNodeId, sessionId: sessionId, profile: session.profile };
  }

  logInteraction(sessionId, currentNodeId, !!currentNode.isUrgence);
  return { node: currentNode, nodeId: currentNodeId, sessionId: sessionId, profile: session.profile };
}

function buildOutgoingMessage(node, profile) {
  const text = resolveNodeText(node, profile);
  const buttons = node.buttons || null;
  return { text: text, buttons: buttons };
}

module.exports = {
  processMessage: processMessage,
  buildOutgoingMessage: buildOutgoingMessage,
  resolveNodeText: resolveNodeText,
};
