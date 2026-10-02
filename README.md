# Deities Studio Launcher — contenu distribué

Ce dépôt public fournit le catalogue et les runtimes des jeux du Launcher. Ce n'est pas le dépôt source du Launcher. Les sources de développement de référence peuvent vivre dans des dépôts privés distincts ; leur publication ici nécessite une préparation et une validation explicites.

## Structure

- `Jeux/<jeu>/` : runtime web livré, dont index.html, scripts, styles et assets ; du code source web peut être directement le runtime.
- `game.json` : métadonnées de présentation ; icon.png et le chemin background sont consommés par le Launcher.
- `manifest.json` : version technique numérique en chaîne et couples path/sha256. Généré automatiquement ; ne pas éditer les empreintes manuellement.
- `users.json` : contrat de connexion actuel, laissé inchangé. Ne pas reproduire ses valeurs dans les rapports.
- `distribution-files.json` : fichiers requis, répertoires runtime autorisés et exclusions historiques précises.
- `tools/generate-manifests.cjs` et le workflow : génération avec Node/Git, sans dépendance npm.

Les noms des dossiers sont les identifiants du Launcher. Ne pas changer noms, chemins ou formats sans analyser les consommateurs. Les URLs raw utilisent main ; le catalogue dépend de la branche par défaut.

## Génération et précautions

Node 22 est configuré pour Actions. Depuis la racine, avec Node et Git :

```sh
node tools/generate-manifests.cjs
node tools/generate-manifests.cjs --game Sanctuaire --write
```

Par défaut, le script analyse sans écrire. Il lit les blobs Git de HEAD, pas les octets du checkout ; les changements non commis ne sont donc pas automatiquement intégrés. --write écrit le manifeste sélectionné seulement si le contenu distribué diffère de celui de la révision. Aucun commit/push dans le script. Dans ce lot, il prépare l'exclusion des quatre vestiges historiques.

La sélection conserve les ressources des répertoires runtime autorisés sans whitelist d'extensions d'assets. Une ressource non classée, un lien symbolique ou un fichier de développement non explicitement exclu fait échouer la génération pour revue, au lieu de disparaître silencieusement. Fichiers cachés, documentation, backups, archives, tests, dist, node_modules et extensions de documents/temporaires identifiées sont bloqués. Adapter la politique si une ressource légitime le nécessite.

Actions analyse tous les jeux pour ne pas manquer des changements lors de pushes successifs. Seuls les manifestes dont les entrées ou empreintes changent reçoivent une nouvelle version numérique en chaîne, supérieure à la précédente et basée sur l'heure. Aucun renouvellement des autres versions.

Le workflow ne stage que les manifestes, refuse de pousser un résultat obsolète si main a avancé et n'utilise aucun push forcé. Les protections GitHub peuvent empêcher le push automatique. L'atomicité ressources/manifeste entre les deux commits n'est pas garantie.

Référence de retour arrière : a5f9eca4575dcc77db6b7e31ffac5a9e2028e885. Les quatre vestiges retirés restent dans l'historique. Leur retrait est une nouvelle distribution Sanctuaire ; les scripts actifs ne sont pas synchronisés depuis le privé. Restaurer un ensemble cohérent, pas un manifeste seul.

Le Launcher écrit les téléchargements directement ; la vérification SHA-256 séparée peut supprimer les fichiers absents du manifeste. Vérifier les sauvegardes avant modification de liste. LaserGame/Pipo restent intacts ; leurs pages attendent un paramètre d'accès absent du lancement actuel, limite non corrigée ici.

## GitHub Pages

Au contrôle du 2 octobre 2026, Pages est activé depuis main, racine /, sans domaine personnalisé : https://yazimafull.github.io/deities-launcher-content/ . Le Launcher utilise l'API GitHub et les URLs raw, pas Pages. Aucun paramètre Pages ni domaine n'est modifié ; identifier ses autres consommateurs avant une éventuelle désactivation.
