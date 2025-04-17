exports.code = Object.freeze({
  AUTH_TOKEN_MISSING: {
    message: "Le jeton d'authentification est manquant",
    status: 401,
    code: "AUTH_TOKEN_MISSING",
  },
  AUTH_TOKEN_INVALID: {
    message: "Le jeton d'authentification est invalide",
    status: 401,
    code: "AUTH_TOKEN_INVALID",
  },
  EMAIL_REQUIRED: {
    message: "Email requis",
    status: 401,
    code: "EMAIL_REQUIRED",
  },
  INVALID_EMAIL: {
    message: "Email invalide",
    status: 401,
    code: "INVALID_EMAIL",
  },
  FIELD_REQUIRED: {
    message: "Un ou plusieurs champs requis manquant(s)",
    status: 401,
    code: "FIELD_REQUIRED",
  },
  PASSWORD_REQUIRED: {
    message: "Mot de passe requis",
    status: 401,
    code: "PASSWORD_REQUIRED",
  },
  PASSWORD_NOT_SAME: {
    message: "Mots de passe non identiques",
    status: 401,
    code: "PASSWORD_NOT_SAME",
  },
  PASSWORD_LENGTH: {
    message: "Le mot de passe doit contenir au moins 6 caractères",
    status: 401,
    code: "PASSWORD_LENGTH",
  },
  USER_NOT_EXIST: {
    message: "Cet utilisateur n'existe pas",
    status: 401,
    code: "USER_NOT_EXIST",
  },
  USER_ATTR_NOT_FOUND: {
    message: "Attribut non trouvé",
    status: 404,
    code: "USER_ATTR_NOT_FOUND",
  },
  PASSWORD_INCORRECT: {
    message: "Le mot de passe est incorrect",
    status: 401,
    code: "PASSWORD_INCORRECT",
  },
  SERVER_ERROR: {
    message: "Erreur serveur",
    status: 500,
    code: "SERVER_ERROR",
  },
  USER_EXISTS: {
    message: "L'utilisateur existe déjà",
    status: 400,
    code: "USER_EXISTS",
  },
  INVALID_REQUEST: {
    message: "Requête invalide. Réessayez..",
    status: 400,
    code: "INVALID_REQUEST",
  },
  USER_NOT_CREATED: {
    message: "Utilisateur non créé",
    status: 400,
    code: "USER_NOT_CREATED",
  },
  USER_NOT_FOUND: {
    message: "Utilisateur non trouvé",
    status: 404,
    code: "USER_NOT_FOUND",
  },
  USER_NOT_UPDATED: {
    message: "Utilisateur non mis à jour",
    status: 400,
    code: "USER_NOT_UPDATED",
  },
  USER_NOT_DELETED: {
    message: "Utilisateur non supprimé",
    status: 400,
    code: "USER_NOT_DELETED",
  },
  USER_NOT_AUTHORIZED: {
    message: "Utilisateur non autorisé",
    status: 401,
    code: "USER_NOT_AUTHORIZED",
  },

  USER_NOT_AUTHENTICATED: {
    message: "Utilisateur non authentifié",
    status: 401,
    code: "USER_NOT_AUTHENTICATED",
  },
  RESOURCE_NOT_FOUND: {
    message: "Ressource non trouvée",
    status: 404,
    code: "RESOURCE_NOT_FOUND",
  },
  PAGE_NOT_FOUND: {
    message: "Page introuvable",
    status: 404,
    code: "PAGE_NOT_FOUND",
  },
  SESSION_EXPIRED: {
    message: "Votre session a expiré.",
    status: 440,
    code: "SESSION_EXPIRED",
  },
  INVALID_LOGIN_METHOD: {
    message: "La méthode de connexion est invalide pour ce compte.",
    status: 401,
    code: "INVALID_LOGIN_METHOD",
  },
  ACCOUNT_LOCKED: {
    message: "Compte bloqué. Contactez l'assistance.",
    status: 401,
    code: "ACCOUNT_LOCKED",
  },
});


