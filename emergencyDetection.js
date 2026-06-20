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
      "preservatif dechire", "preservatif déchiré",
      "tpe urgence", "expose au vih", "expose au vih", "exposition vih",
      "rapport non protege", "rapport non protege",
    ],
  },
  {
    id: "violence_en_cours",
    targetNode: "violence_urgence",
    keywords: [
      "viol", "violee", "violee", "agressee", "agressee", "agresse sexuellement",
      "agresse sexuellement", "frappe moi", "frappe moi", "il me frappe",
      "elle me frappe", "je suis en danger", "je vis une violence",
      "on me force", "il me force", "elle me force",
    ],
  },
  {
    id: "grossesse_detresse",
    targetNode: "grossesse_non_desiree",
    keywords: [
      "je veux avorter", "grossesse non desiree", "grossesse non desiree",
      "je suis enceinte et", "grossesse forcee", "grossesse forcee",
    ],
  },
];

function normalize(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function detectEmergency(message) {
  const normalizedMessage = normalize(message);

  for (let i = 0; i < EMERGENCY_CATEGORIES.length; i++) {
    const category = EMERGENCY_CATEGORIES[i];
    for (let j = 0; j < category.keywords.length; j++) {
      const normalizedKeyword = normalize(category.keywords[j]);
      if (normalizedMessage.indexOf(normalizedKeyword) !== -1) {
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

module.exports = {
  detectEmergency: detectEmergency,
  EMERGENCY_CATEGORIES: EMERGENCY_CATEGORIES,
};
