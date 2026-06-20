/**
 * M-SANTE HARMONIE — Base de données
 *
 * Stockage anonymisé des sessions utilisateurs et des interactions.
 * Le numéro de téléphone WhatsApp est haché (jamais stocké en clair) —
 * voir section 9 du document de spécifications techniques.
 *
 * IMPLÉMENTATION : fichier JSON local, en pure JavaScript (aucune
 * dépendance native à compiler — installation garantie sans problème
 * sur n'importe quelle machine).
 *
 * ⚠️ Pour un usage en production avec plus de volume (> quelques milliers
 * d'utilisateurs simultanés), migrer vers une vraie base de données
 * (PostgreSQL, MongoDB). Cette implémentation est volontairement simple
 * pour permettre un démarrage rapide sans complexité d'infrastructure.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data", "msh_db.json");

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

/**
 * Structure du fichier JSON :
 * {
 *   sessions: { [sessionId]: { id, current_node, profile, created_at, updated_at } },
 *   interactions: [ { session_id, node_id, is_urgence, timestamp } ]
 * }
 */
function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    return { sessions: {}, interactions: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch (err) {
    console.error("⚠️ Erreur de lecture de la base de données, réinitialisation :", err.message);
    return { sessions: {}, interactions: [] };
  }
}

function saveDb(data) {
  // Écriture atomique simple : fichier temporaire puis renommage
  const tmpPath = DB_PATH + ".tmp";
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  fs.renameSync(tmpPath, DB_PATH);
}

/**
 * Transforme un numéro de téléphone WhatsApp en identifiant anonyme irréversible.
 * Le numéro en clair n'est JAMAIS stocké en base de données.
 */
function hashPhoneNumber(phoneNumber) {
  const salt = process.env.HASH_SALT || "CHANGEZ_CE_SEL_AVANT_PRODUCTION";
  return crypto
    .createHash("sha256")
    .update(phoneNumber + salt)
    .digest("hex");
}

/**
 * Récupère ou crée une session pour un utilisateur donné.
 */
function getOrCreateSession(phoneNumber) {
  const sessionId = hashPhoneNumber(phoneNumber);
  const data = loadDb();
  const now = new Date().toISOString();

  if (data.sessions[sessionId]) {
    return data.sessions[sessionId];
  }

  const newSession = {
    id: sessionId,
    current_node: "accueil",
    profile: null,
    created_at: now,
    updated_at: now,
  };

  data.sessions[sessionId] = newSession;
  saveDb(data);

  return newSession;
}

/**
 * Met à jour le noeud courant et/ou le profil d'une session.
 */
function updateSession(sessionId, { currentNode, profile }) {
  const data = loadDb();
  const session = data.sessions[sessionId];
  if (!session) return;

  if (currentNode !== undefined) session.current_node = currentNode;
  if (profile !== undefined) session.profile = profile;
  session.updated_at = new Date().toISOString();

  saveDb(data);
}

/**
 * Enregistre une interaction (pour les statistiques de recherche anonymisées).
 */
function logInteraction(sessionId, nodeId, isUrgence = false) {
  const data = loadDb();
  data.interactions.push({
    session_id: sessionId,
    node_id: nodeId,
    is_urgence: isUrgence,
    timestamp: new Date().toISOString(),
  });
  saveDb(data);
}

module.exports = {
  hashPhoneNumber,
  getOrCreateSession,
  updateSession,
  logInteraction,
};
