/**
 * Système de région NOXEL — séparé du système de langue.
 *
 * Principe : `locale = langue + région`. L'utilisateur peut parler
 * français mais vivre au Canada → dates au format canadien, devise CAD,
 * timezone America/Montreal, etc. indépendamment du fait que l'UI
 * s'affiche en français.
 *
 * Codes région : ISO 3166-1 alpha-2 (ex: "CA", "FR", "JP").
 * Codes locale combinés : BCP 47 (ex: "fr-CA", "en-US", "pt-BR").
 */
export {};
