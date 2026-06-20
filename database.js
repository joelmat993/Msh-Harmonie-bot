const fs = require("fs"); 
const path = require("path");
const crypto = require("crypto");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data", "msh_db.json");

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    return { sessions: {}, interactions: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch (err) {
    console.error("Erreur de lecture de la base de données, réinitialisation :", err.message);
    return { sessions: {}, interactions: [] };
  }
}

function saveDb(data) {
  const tmpPath = DB_PATH + ".tmp";
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  fs.renameSync(tmpPath, DB_PATH);
}

function hashPhoneNumber(phoneNumber) {
  const salt = process.env.HASH_SALT || "CHANGEZ_CE_SEL_AVANT_PRODUCTION";
  return crypto
    .createHash("sha256")
    .update(phoneNumber + salt)
    .digest("hex");
}

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

function updateSession(sessionId, options) {
  const data = loadDb();
  const session = data.sessions[sessionId];
  if (!session) return;

  if (options.currentNode !== undefined) session.current_node = options.currentNode;
  if (options.profile !== undefined) session.profile = options.profile;
  session.updated_at = new Date().toISOString();

  saveDb(data);
}

function logInteraction(sessionId, nodeId, isUrgence) {
  const data = loadDb();
  data.interactions.push({
    session_id: sessionId,
    node_id: nodeId,
    is_urgence: isUrgence || false,
    timestamp: new Date().toISOString(),
  });
  saveDb(data);
}

module.exports = {
  hashPhoneNumber: hashPhoneNumber,
  getOrCreateSession: getOrCreateSession,
  updateSession: updateSession,
  logInteraction: logInteraction,
};
