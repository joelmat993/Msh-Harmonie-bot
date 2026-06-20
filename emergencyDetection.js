/**
 * M-SANTE HARMONIE — Détection de mots-clés d'urgence
 *
 * Cette détection s'applique à CHAQUE message entrant, quel que soit le
 * module dans lequel se trouve l'utilisateur. Si un mot-clé est détecté,
 * le bot interrompt le flux normal et bascule immédiatement vers le
 * noeud d'urgence correspondant.
 *
 * ⚠️ IMPORTANT POUR LE DÉVELOPPEUR / PORTEUR DU PROJET :
 * Cette liste est un POINT DE DÉPART. Avant le lancement public, elle doit
 * être étendue avec :
 *   - des variantes en lingala
 *   - des fautes d'orthographe courantes / écriture SMS
 *   - une validation par le porteur du projet (médecin praticien à Kinshasa)
 *
 * Pour ajouter un mot-clé : ajouter une chaîne dans le tableau "keywords"
 * de la catégorie concernée. La recherche est insensible à la casse et aux accents.
 */

const EMERGENCY_CATEGORIES = [
  {
    id: "suicide",
    targetNode: "mental_urgence",
    keywords: [
      "suicide", "me tuer", "me suicider", "en finir", "plus envie de vivre",
      "envie de mourir", "me faire du mal", "je veux mourir", "j'en peux plus",
      "jen peux plus", "plus la force de vivre", "je veux disparaitre",
      "je veux disparaître",
    ],
  },
  {
    id: "exposition_vih",
    targetNode: "ist_tpe",
    keywords: [
      "rapport a risque", "rapport à risque", "preservatif craque",
      "préservatif craqué", "preservatif dechire", "préservatif déchiré",
      "tpe urgence", "expose au vih", "exposé au vih", "exposition vih",
      "rapport non protege", "rapport non protégé",
    ],
  },
  {
    id: "violence_en_cours",
    targetNode: "violence_urgence",
    keywords: [
      "viol", "violee", "violée", "agressee", "agressée", "agresse sexuellement",
      "agressé sexuellement", "frappe moi", "frappé moi", "il me frappe",
      "elle me frappe", "je suis en danger", "je vis une violence",
      "on me force", "il me force", "elle me force",
    ],
  },
  {
    id: "grossesse_detresse",
    targetNode: "grossesse_non_desiree",
    keywords: [
      "je veux avorter", "grossesse non desiree", "grossesse non désirée",
      "je suis enceinte et", "grossesse forcee", "grossesse forcée",
    ],
  },
];

/**
 * Normalise un texte pour la comparaison : minuscules, accents retirés.
 */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // retire les accents
}

/**
 * Vérifie si un message contient un mot-clé d'urgence.
 * Retourne { matched: true, category, targetNode } ou { matched: false }.
 */
function detectEmergency(message) {
  const normalizedMessage = normalize(message);

  for (const category of EMERGENCY_CATEGORIES) {
    for (const keyword of category.keywords) {
      const normalizedKeyword = normalize(keyword);
      if (normalizedMessage.includes(normalizedKeyword)) {
        return {
          matched: true,
          category: category.id,
          targetNode: category.targetNode,
        };
      }
    }
  }

  return { matched: false };
}

module.exports = { detectEmergency, EMERGENCY_CATEGORIES };
