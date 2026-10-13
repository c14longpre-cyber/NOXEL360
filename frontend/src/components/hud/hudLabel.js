// Les libellés traduits portent parfois une flèche (« Open module → », « ← Previous page »).
// L'icône du bouton HUD la remplace : on la retire pour ne pas l'afficher deux fois.
export function hudLabel(text) {
    return text.replace(/^[\s←→↗↖⟵⟶]+|[\s←→↗↖⟵⟶]+$/gu, "");
}
