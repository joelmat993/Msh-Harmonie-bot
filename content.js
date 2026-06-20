/**
 * M-SANTE HARMONIE — Contenu conversationnel complet
 *
 * Ce fichier contient TOUT le texte du chatbot. Il est volontairement séparé
 * de la logique (server.js) pour que le contenu puisse être modifié, traduit,
 * ou enrichi sans toucher au code.
 *
 * STRUCTURE D'UN NŒUD (node) :
 * {
 *   text: "le message envoyé par le bot",
 *   buttons: [ { label: "texte du bouton", next: "id_du_noeud_suivant" } ],
 *   // OU pour les noeuds avec branchement conditionnel selon le profil (Module 6) :
 *   conditional: true,
 *   textByProfile: { "foi": "...", "default": "..." }
 * }
 *
 * Pour ajouter/modifier un module : éditer ce fichier uniquement.
 */

const NODES = {

  // ============================================================
  // ACCUEIL
  // ============================================================
  accueil: {
    text:
      "🌿 Bonjour et bienvenue sur M-SANTÉ HARMONIE 💚\n\n" +
      "Je suis ton compagnon numérique pour une santé globale, digne et éclairée.\n\n" +
      "Tout ce que tu partages ici est confidentiel. Tu peux poser toutes tes questions sans jugement.\n\n" +
      "Sur quel sujet puis-je t'aider aujourd'hui ?",
    buttons: [
      { label: "💊 Contraception", next: "contraception_accueil" },
      { label: "🦠 IST & VIH", next: "ist_accueil" },
      { label: "🤰 Grossesse", next: "grossesse_accueil" },
      { label: "🧠 Santé mentale", next: "mental_accueil" },
      { label: "⚠️ Violence & Relations", next: "violence_accueil" },
      { label: "🌿 Corps & Sexualité", next: "corps_cadrage" },
    ],
  },

  // ============================================================
  // MODULE 1 — CONTRACEPTION
  // ============================================================
  contraception_accueil: {
    text:
      "💊 MODULE CONTRACEPTION\n\n" +
      "Tu as bien fait de poser cette question. La contraception, c'est ton droit.\n\n" +
      "Qu'est-ce qui t'amène sur ce sujet ?",
    buttons: [
      { label: "❓ La pilule rend-elle stérile ?", next: "contraception_mythe_pilule" },
      { label: "📋 Quelles méthodes existent ?", next: "contraception_methodes" },
      { label: "😰 J'ai oublié ma pilule", next: "contraception_oubli" },
      { label: "⏰ Contraception d'urgence", next: "contraception_urgence" },
      { label: "🏥 Où trouver une contraception ?", next: "contraception_acces" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  contraception_mythe_pilule: {
    text:
      "✅ VRAI ou FAUX — La pilule rend stérile ?\n\n" +
      "FAUX — C'est un mythe très répandu à Kinshasa.\n\n" +
      "La réalité médicale :\n" +
      "→ La pilule ne rend PAS stérile\n" +
      "→ 79 à 96% des femmes tombent enceintes dans l'année suivant l'arrêt\n" +
      "→ La fertilité revient en quelques semaines après l'arrêt\n" +
      "→ Seule exception : l'injection Depo peut retarder le retour de 12 à 18 mois\n\n" +
      "Source : Mansour et al., Contraception Journal, 2011",
    buttons: [
      { label: "📋 Voir les méthodes", next: "contraception_methodes" },
      { label: "🏥 Où trouver une contraception ?", next: "contraception_acces" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  contraception_methodes: {
    text:
      "📋 LES MÉTHODES CONTRACEPTIVES à Kinshasa\n\n" +
      "💊 PILULE — efficacité 91-99% — à prendre chaque jour\n" +
      "🛡️ PRÉSERVATIF — efficacité 85-98% — protège aussi des IST\n" +
      "💉 INJECTION Depo — efficacité 94-99% — tous les 3 mois\n" +
      "🔵 IMPLANT — efficacité >99% — dure 3 à 5 ans\n" +
      "⭕ STÉRILET (DIU) — efficacité >99% — dure 5 à 10 ans\n\n" +
      "Le meilleur choix dépend de ta situation. Consulte un médecin ou une sage-femme.",
    buttons: [
      { label: "🏥 Où accéder à une contraception ?", next: "contraception_acces" },
      { label: "😰 J'ai oublié ma pilule", next: "contraception_oubli" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  contraception_oubli: {
    text:
      "😰 J'AI OUBLIÉ MA PILULE — que faire ?\n\n" +
      "⏱️ MOINS DE 24H d'oubli :\n" +
      "→ Prends-la dès que tu t'en souviens\n" +
      "→ Continue normalement les jours suivants\n" +
      "→ Pas besoin de contraception supplémentaire\n\n" +
      "⏱️ PLUS DE 24H d'oubli :\n" +
      "→ Prends le comprimé oublié immédiatement\n" +
      "→ Utilise un préservatif pendant 7 jours\n" +
      "→ Si rapport pendant l'oubli → pense à la contraception d'urgence\n\n" +
      "Source : OMS, Pratiques recommandées pour la planification familiale, 2016",
    buttons: [
      { label: "⏰ Contraception d'urgence", next: "contraception_urgence" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  contraception_urgence: {
    text:
      "⏰ CONTRACEPTION D'URGENCE\n\n" +
      "Tu as 72 HEURES MAXIMUM pour agir après un rapport non protégé.\n\n" +
      "✅ Efficacité : 85% si prise dans les 72h — plus tôt = plus efficace\n\n" +
      "💊 Où en trouver à Kinshasa :\n" +
      "→ Pharmacies (Postinor-2) — sans ordonnance\n" +
      "→ Centre de santé ou hôpital le plus proche\n\n" +
      "⚠️ Ce n'est PAS une méthode régulière. Elle ne protège pas des IST.",
    buttons: [
      { label: "🏥 Trouver un centre à Kinshasa", next: "contraception_acces" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  contraception_acces: {
    text:
      "🏥 CONTRACEPTION À KINSHASA\n\n" +
      "📍 GRATUIT ou faible coût :\n" +
      "→ Espaces Conviviaux PNSA (UNFPA) — plusieurs communes\n" +
      "→ Centres de Santé Maternelle et Infantile (SMI)\n" +
      "→ CDV — préservatifs gratuits\n\n" +
      "💬 Message à montrer au soignant :\n" +
      "« Je viens de M-SANTÉ HARMONIE. Je souhaite une consultation confidentielle sur la contraception. Merci de m'accueillir sans jugement. »",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  // ============================================================
  // MODULE 2 — IST & VIH
  // ============================================================
  ist_accueil: {
    text:
      "🦠 MODULE IST & VIH\n\n" +
      "Poser cette question, c'est déjà prendre soin de toi. 💙\n\n" +
      "Qu'est-ce qui t'amène ici ?",
    buttons: [
      { label: "😰 Le VIH c'est la mort ?", next: "ist_vih_vie" },
      { label: "⏰ Rapport à risque — TPE ?", next: "ist_tpe" },
      { label: "🔬 Comment faire un test VIH ?", next: "ist_test" },
      { label: "🤒 J'ai des symptômes inquiétants", next: "ist_symptomes" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  ist_vih_vie: {
    text:
      "✅ Le VIH en 2026 n'est PLUS une condamnation à mort.\n\n" +
      "Avec un traitement ARV correct, c'est une maladie chronique.\n\n" +
      "Ce que la science confirme :\n" +
      "→ U=U : Indétectable = Intransmissible. Une personne sous traitement avec une charge virale indétectable ne transmet pas le virus à ses partenaires sexuels.\n" +
      "→ Les personnes sous ARV bien suivi vivent longtemps et normalement\n" +
      "→ Avec un traitement bien suivi pendant la grossesse, la transmission mère-enfant peut être évitée\n\n" +
      "La clé : dépistage précoce et traitement rapide. 💙\n\n" +
      "Source : OMS / ONUSIDA — Consensus scientifique U=U",
    buttons: [
      { label: "🔬 Où faire un test VIH ?", next: "ist_test" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  // Noeud d'URGENCE — peut aussi être atteint directement par détection de mot-clé
  ist_tpe: {
    text:
      "🚨 URGENCE — TPE (Traitement Post-Exposition VIH)\n\n" +
      "Tu as 72 HEURES MAXIMUM pour agir. Plus tôt = plus efficace — idéalement dans les 24 premières heures.\n\n" +
      "🏥 Rends-toi rapidement dans un centre de santé ou un hôpital pour une évaluation en urgence.\n\n" +
      "⚠️ La disponibilité du TPE peut varier selon les structures — appelle avant de te déplacer si possible.\n\n" +
      "💬 Montre ce message au soignant :\n" +
      "« Je viens de M-SANTÉ HARMONIE. J'ai eu une exposition au VIH il y a moins de 72h. Je demande le TPE en urgence. »\n\n" +
      "Source : OMS, Lignes directrices sur la prophylaxie post-exposition au VIH, 2024",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
    isUrgence: true,
  },

  ist_test: {
    text:
      "🔬 LE TEST VIH\n\n" +
      "Le test de dépistage est généralement gratuit dans les Centres de Dépistage Volontaire (CDV) en RDC.\n\n" +
      "🔒 Confidentialité totale — c'est ton droit\n\n" +
      "✅ Si négatif : continue à te protéger (préservatif)\n" +
      "⚠️ Si positif : ce n'est pas une fin — c'est un début de prise en charge. Le traitement ARV existe en RDC via le PNLS.",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  ist_symptomes: {
    text:
      "🤒 SYMPTÔMES IST — Ce qu'il faut savoir\n\n" +
      "Certains signes méritent une consultation rapide : écoulement anormal, brûlure en urinant, plaie ou bouton génital, démangeaisons inhabituelles.\n\n" +
      "⚠️ Ne te soigne jamais seul·e avec des antibiotiques de la rue — ça peut créer une résistance dangereuse.\n\n" +
      "🏥 Consulte rapidement un centre de santé.",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  // ============================================================
  // MODULE 3 — GROSSESSE NON PLANIFIÉE
  // ============================================================
  grossesse_accueil: {
    text:
      "🤰 MODULE GROSSESSE\n\n" +
      "Tu peux me parler en toute confiance. 💙\n\n" +
      "Qu'est-ce qui t'amène ici ?",
    buttons: [
      { label: "😰 Je pense être enceinte", next: "grossesse_pense" },
      { label: "🆘 Grossesse non désirée", next: "grossesse_non_desiree" },
      { label: "⚖️ Question sur l'avortement", next: "grossesse_avortement" },
      { label: "🏥 Suivi de grossesse", next: "grossesse_suivi" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  grossesse_pense: {
    text:
      "😰 TU PENSES ÊTRE ENCEINTE\n\n" +
      "Premier pas : fais un test de grossesse pour en être sûr·e (pharmacie, centre de santé).\n\n" +
      "Quel que soit le résultat, tu n'es pas seul·e dans cette situation.\n\n" +
      "📊 En RDC, près d'une naissance sur trois n'est pas planifiée — tu n'es vraiment pas seul·e dans ce cas.\n\n" +
      "Veux-tu qu'on parle de ce qui t'inquiète le plus ?\n\n" +
      "Source : EDS-RDC III (2023-2024), Institut National de la Statistique / ICF",
    buttons: [
      { label: "🆘 La grossesse n'est pas désirée", next: "grossesse_non_desiree" },
      { label: "🏥 Je veux faire un suivi", next: "grossesse_suivi" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  grossesse_non_desiree: {
    text:
      "🆘 GROSSESSE NON DÉSIRÉE\n\n" +
      "Ce que tu ressens est légitime. Tu as des options, et tu as le droit d'être accompagné·e sans jugement.\n\n" +
      "→ Si tu veux poursuivre la grossesse : un suivi prénatal précoce est essentiel.\n" +
      "→ Si tu as des questions sur l'interruption de grossesse : la situation légale en RDC est complexe — on peut en parler.\n" +
      "→ Si cette grossesse résulte d'un viol ou d'une situation de violence : tu as des droits spécifiques.\n\n" +
      "Qu'est-ce qui correspond le plus à ta situation ?",
    buttons: [
      { label: "⚖️ Question sur l'avortement", next: "grossesse_avortement" },
      { label: "🏥 Suivi de grossesse", next: "grossesse_suivi" },
      { label: "⚠️ J'ai vécu une violence", next: "violence_urgence" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  grossesse_avortement: {
    text:
      "⚖️ AVORTEMENT EN RDC — Ce qu'il faut savoir\n\n" +
      "→ Le Code Pénal congolais interdit l'avortement et prévoit des peines de prison — pour la femme et pour la personne qui le pratique.\n\n" +
      "→ Cependant, la RDC a aussi adopté le Protocole de Maputo, publié au Journal Officiel en 2018. Ce texte autorise l'avortement médicalisé dans certains cas précis : viol, inceste, danger pour la santé de la mère, ou malformation grave du fœtus.\n\n" +
      "→ Ces deux textes se contredisent, et cette situation n'est pas encore résolue clairement en pratique.\n\n" +
      "⚠️ L'accès réel à un avortement sécurisé reste difficile en RDC, même dans les cas prévus par le Protocole de Maputo.\n\n" +
      "Le plus important : ne jamais tenter un avortement par toi-même — c'est extrêmement dangereux. Consulte un centre de santé pour être orienté·e en toute confidentialité.\n\n" +
      "Sources : Code Pénal congolais (art. 165-167) ; Protocole de Maputo, art. 14.2.c (JO RDC, 2018) ; Normes et directives des soins complets d'avortement en RDC (2020)",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  grossesse_suivi: {
    text:
      "🏥 SUIVI DE GROSSESSE\n\n" +
      "Un suivi prénatal précoce (CPN) protège ta santé et celle du bébé : suivi de l'évolution, détection précoce des complications, préparation à l'accouchement.\n\n" +
      "⚠️ Les grossesses non suivies ont des risques significativement plus élevés de complications.\n\n" +
      "Source : Maleya A. et al., Pan African Medical Journal, 2019 (étude Lubumbashi, RDC)",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  // ============================================================
  // MODULE 4 — SANTÉ MENTALE
  // ============================================================
  mental_accueil: {
    text:
      "🧠 MODULE SANTÉ MENTALE\n\n" +
      "Je suis là. 💙 Ce que tu ressens mérite d'être entendu — pas jugé.\n\n" +
      "Comment tu te sens en ce moment ?",
    buttons: [
      { label: "😔 Je me sens très triste", next: "mental_triste" },
      { label: "😰 Je suis anxieux·euse tout le temps", next: "mental_anxiete" },
      { label: "🆘 J'ai des pensées difficiles", next: "mental_urgence" },
      { label: "💭 Je veux comprendre ce qui m'arrive", next: "mental_contexte" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  mental_contexte: {
    text:
      "💭 LA SANTÉ MENTALE EN RDC — Tu n'es pas seul·e\n\n" +
      "📊 Ce que montrent les données :\n" +
      "→ Environ 22 millions de Congolais vivent avec des problèmes de santé mentale\n" +
      "→ Près de 30% de la population présenterait des troubles liés à la santé mentale — souvent sans diagnostic ni prise en charge\n\n" +
      "⚠️ Seulement 3% des établissements de santé primaires intègrent des services de santé mentale en RDC.\n\n" +
      "Ce n'est pas un signe de faiblesse de demander de l'aide. C'est un acte de courage.\n\n" +
      "Sources : Ministre Santé Publique RDC (oct. 2022) ; Table ronde nationale santé mentale, Ministère Santé RDC (oct. 2025) ; OSAR/EUAA (2022)",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  mental_triste: {
    text:
      "😔 TU TE SENS TRISTE — Parlons-en\n\n" +
      "Ce que tu ressens compte. Depuis combien de temps tu te sens comme ça ?\n\n" +
      "Si cette tristesse dure depuis plusieurs semaines et qu'elle t'empêche de faire tes activités habituelles, ça peut être le signe d'une dépression — une vraie condition de santé, pas une faiblesse de caractère.\n\n" +
      "Tu n'as pas à porter ça seul·e.",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  mental_anxiete: {
    text:
      "😰 L'ANXIÉTÉ — Ce que tu ressens est réel\n\n" +
      "Le cœur qui s'accélère, les pensées qui tournent en boucle, la difficulté à se calmer — c'est épuisant, et c'est réel.\n\n" +
      "L'anxiété chronique peut avoir plusieurs causes : stress, traumatisme, pression familiale ou scolaire, incertitude sur l'avenir.\n\n" +
      "Tu n'as pas à gérer ça tout·e seul·e.",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  // ⚠️ NOEUD D'URGENCE CRITIQUE — voir détection de mots-clés dans server.js
  mental_urgence: {
    text:
      "🆘 Merci de me faire confiance. C'est courageux d'en parler.\n\n" +
      "Ce que tu ressens en ce moment mérite une attention immédiate. Tu n'es pas seul·e.\n\n" +
      "🏥 Le plus important maintenant : parle à un professionnel de santé ou rends-toi dans un centre de santé le plus vite possible.\n\n" +
      "Si tu es avec quelqu'un de confiance en ce moment, ne reste pas isolé·e.\n\n" +
      "💬 Tu peux dire : « J'ai des pensées difficiles en ce moment et j'ai besoin d'aide. »\n\n" +
      "Tu comptes. 💙",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
    isUrgence: true,
  },

  // ============================================================
  // MODULE 5 — VIOLENCE & RELATIONS (réponse FERME, jamais de cadrage)
  // ============================================================
  violence_accueil: {
    text:
      "⚠️ MODULE VIOLENCE & RELATIONS\n\n" +
      "Tu peux me parler en toute confidentialité. Ce que tu vis ou as vécu n'est jamais de ta faute. 💙\n\n" +
      "Qu'est-ce qui t'amène ici ?",
    buttons: [
      { label: "🆘 Je vis une situation de violence maintenant", next: "violence_urgence" },
      { label: "💔 Relation qui me fait mal", next: "violence_relation" },
      { label: "🧠 Comprendre le consentement", next: "violence_consentement" },
      { label: "📖 Informations générales", next: "violence_contexte" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  // ⚠️ NOEUD D'URGENCE CRITIQUE
  violence_urgence: {
    text:
      "🆘 Merci de me faire confiance. Ta sécurité compte avant tout.\n\n" +
      "Si tu es en danger immédiat, essaie de te rendre dans un lieu sûr — chez un proche de confiance ou dans un centre de santé.\n\n" +
      "🏥 Dans un centre de santé, tu peux recevoir des soins en urgence et en confidentialité — y compris dans les 72 heures après une agression, pour limiter certains risques pour ta santé.\n\n" +
      "💬 Tu peux dire : « J'ai vécu une situation de violence et j'ai besoin d'aide médicale et d'écoute, en toute confidentialité. »\n\n" +
      "Tu n'es pas seul·e, et ce n'est pas ta faute. 💙",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
    isUrgence: true,
  },

  violence_relation: {
    text:
      "💔 RELATION QUI FAIT MAL — Tu mérites d'être en sécurité\n\n" +
      "Une relation saine ne fait pas peur, ne fait pas mal, et ne t'isole pas de tes proches.\n\n" +
      "Si ton/ta partenaire te contrôle, te menace, te frappe, te rabaisse constamment, ou t'empêche de voir tes proches — ce n'est pas de l'amour, c'est de la violence.\n\n" +
      "Tu as le droit de demander de l'aide, même si tu n'es pas encore prêt·e à partir.",
    buttons: [
      { label: "🧠 Comprendre le consentement", next: "violence_consentement" },
      { label: "📖 Infos générales", next: "violence_contexte" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  violence_consentement: {
    text:
      "🧠 LE CONSENTEMENT — Ce qu'il faut savoir\n\n" +
      "Le consentement, c'est un accord libre, clair et donné sans pression — à chaque fois.\n\n" +
      "→ Le silence n'est pas un \"oui\"\n" +
      "→ Avoir dit \"oui\" hier ne veut pas dire \"oui\" aujourd'hui\n" +
      "→ Être en couple ou marié·e ne donne pas un droit automatique sur le corps de l'autre\n" +
      "→ Le consentement peut être retiré à tout moment, même en plein acte\n\n" +
      "Si quelqu'un insiste après un \"non\", utilise la pression, l'alcool, la menace ou la manipulation pour obtenir un acte sexuel — ce n'est pas du consentement, c'est une agression.",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  violence_contexte: {
    text:
      "📖 LA VIOLENCE BASÉE SUR LE GENRE — Le contexte\n\n" +
      "📊 En RDC, les violences sexuelles restent un problème majeur et largement sous-déclaré. Dans certaines régions touchées par les conflits, les chiffres signalés ont fortement augmenté ces dernières années.\n\n" +
      "⚠️ Ces chiffres concernent surtout l'est du pays, en raison du conflit armé — mais la violence basée sur le genre touche aussi les ménages partout en RDC, y compris à Kinshasa, souvent de façon moins visible mais tout aussi réelle.\n\n" +
      "Si tu vis une situation de violence, peu importe où tu es, tu as le droit d'être protégé·e et accompagné·e.\n\n" +
      "Sources : UNICEF RDC (déc. 2025) ; HRW (janv. 2026) ; UNFPA RDC (2026)",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  // ============================================================
  // MODULE 6 — CORPS & SEXUALITÉ (avec cadrage préalable)
  // ============================================================
  corps_cadrage: {
    text:
      "🌿 MODULE CORPS & SEXUALITÉ\n\n" +
      "Tu peux poser toutes tes questions ici, sans honte ni jugement. Ton corps t'appartient. 💙\n\n" +
      "Avant de répondre, j'aimerais mieux te connaître — pas pour te juger, mais pour t'aider d'une façon qui te correspond vraiment.\n\n" +
      "Qu'est-ce qui compte le plus pour toi dans ta vie en ce moment ?",
    buttons: [
      { label: "🙏 Ma foi / mes valeurs religieuses", next: "corps_menu", saveProfile: "foi" },
      { label: "🎓 Mes études, mon avenir", next: "corps_menu", saveProfile: "etudes" },
      { label: "❤️ Mes relations, mon couple", next: "corps_menu", saveProfile: "relations" },
      { label: "🤔 Je ne sais pas encore", next: "corps_menu", saveProfile: "incertain" },
      { label: "➡️ Passer directement à ma question", next: "corps_menu", saveProfile: "default" },
    ],
  },

  corps_menu: {
    text:
      "Merci de m'avoir partagé ça. 💙 Je vais en tenir compte dans ce qu'on va se dire.\n\n" +
      "Qu'est-ce qui t'amène ici aujourd'hui ?",
    buttons: [
      { label: "🩺 Mon corps change — c'est normal ?", next: "corps_puberte" },
      { label: "❓ Une question sur un sujet que j'entends souvent", next: "corps_mythes_intro" },
      { label: "🩸 Questions sur les règles", next: "corps_regles" },
      { label: "💬 Désir, plaisir, attirance", next: "corps_desir" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  // Peu sensible — pas de branchement par profil
  corps_puberte: {
    text:
      "🩺 TON CORPS CHANGE — C'est la puberté\n\n" +
      "À l'adolescence, ton corps traverse des transformations importantes : pilosité, voix qui change, poitrine qui se développe, règles qui commencent, érections plus fréquentes.\n\n" +
      "C'est normal, et ça arrive à des rythmes différents pour chacun·e.\n\n" +
      "Si quelque chose t'inquiète vraiment, en parler à un professionnel de santé peut rassurer.",
    buttons: [
      { label: "🩸 Questions sur les règles", next: "corps_regles" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },

  corps_regles: {
    text:
      "🩸 LES RÈGLES — Ce qu'il faut savoir\n\n" +
      "Les règles sont un phénomène naturel, pas une maladie ni une honte.\n\n" +
      "→ Un cycle dure en moyenne entre 21 et 35 jours\n" +
      "→ Des douleurs légères à modérées sont fréquentes — des douleurs très fortes méritent une consultation\n" +
      "→ Tu peux continuer toutes tes activités pendant tes règles\n\n" +
      "Si tes règles sont très irrégulières, absentes, ou extrêmement douloureuses, consulte un professionnel de santé.",
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  // Sensible — étape intermédiaire qui demande de préciser, puis branche par profil
  corps_mythes_intro: {
    text:
      "❓ Dis-moi — c'est quoi la question ou la chose que tu entends souvent et qui te trotte dans la tête ?\n\n" +
      "(Tu peux me parler de la masturbation, de la virginité, ou d'autre chose — je t'écoute.)",
    // Ce noeud attend une réponse libre de l'utilisateur (pas des boutons).
    // server.js doit, après réception du message libre, envoyer le noeud "corps_mythes_reponse"
    // en lisant le profil sauvegardé à l'étape de cadrage.
    freeText: true,
    nextAfterFreeText: "corps_mythes_reponse",
  },

  corps_mythes_reponse: {
    conditional: true,
    textByProfile: {
      foi:
        "Je comprends que ta foi compte beaucoup pour toi, et je la respecte pleinement. 🙏\n\n" +
        "Voici ce que je peux te dire en toute honnêteté :\n\n" +
        "Sur le plan médical, certaines pratiques comme la masturbation n'ont pas de conséquence néfaste sur ta santé physique. Ça, c'est un fait médical — pas une opinion.\n\n" +
        "En même temps, beaucoup de traditions religieuses ont leurs propres enseignements sur ces sujets, et c'est tout à fait légitime de vouloir vivre en accord avec tes convictions. Ce choix t'appartient, et il est respecté ici.\n\n" +
        "Mon rôle n'est pas de te dire quoi croire — c'est de m'assurer que tu as les bonnes informations pour ta santé, quelle que soit la voie que tu choisis de suivre.",
      default:
        "Voici ce que dit la médecine, sans jugement :\n\n" +
        "🔸 La masturbation n'a pas de conséquence négative sur la santé physique ou mentale — c'est documenté.\n" +
        "🔸 La virginité n'est pas un indicateur médical de la valeur d'une personne — c'est une norme sociale, qui varie selon les cultures et les croyances.\n" +
        "🔸 Avoir du désir est normal et humain — ça ne t'oblige à rien.\n\n" +
        "Ce qui compte vraiment : que tes choix, quels qu'ils soient, viennent de toi — pas de la pression des autres.",
    },
    buttons: [{ label: "🏠 Menu principal", next: "accueil" }],
  },

  corps_desir: {
    conditional: true,
    textByProfile: {
      foi:
        "C'est une question délicate, et je veux y répondre avec respect pour ce qui compte pour toi. 🙏\n\n" +
        "Médicalement : ressentir du désir est une réaction humaine normale, ça ne fait pas de toi quelqu'un de mauvais.\n\n" +
        "Ce que tu en fais ensuite — comment tu vis ce désir, dans quel cadre, à quel rythme — c'est une décision personnelle qui peut être guidée par tes valeurs et ta foi. Ce choix est le tien, et il est respecté ici.\n\n" +
        "Mon rôle est de m'assurer que, quel que soit ton choix, tu sois en sécurité et bien informé·e.",
      default:
        "Ressentir du désir, avoir des questions sur le plaisir — c'est une part normale du développement.\n\n" +
        "Ce n'est pas honteux. C'est une partie de qui tu es.\n\n" +
        "Ce qui compte le plus : que tes choix soient libres, respectueux de toi-même et de l'autre, jamais sous pression — ni pour \"le faire\", ni pour \"ne pas le faire\".",
    },
    buttons: [
      { label: "🧠 Comprendre le consentement", next: "violence_consentement" },
      { label: "🏠 Menu principal", next: "accueil" },
    ],
  },
};

module.exports = { NODES };
