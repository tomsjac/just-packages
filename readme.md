## About justPackages

Ce package permet de récupérer les fichiers ou les dossiers souhaités sur un dêpot NPM précis.
Fini les dossiers de build, de tests ou d'exemples inutiles, récupérer ce dont vous avez besoin tout en allégeant le poids sur votre serveur

Ce package est utile si vous utilisez NPM pour maintenir vos libraries à jour.
Mais ne convient pas forcément dans une utilisation avec Glup, Webpack ...

## USE

### justPackages.json

Ce fichier permet de gérer les libraires souhaitées

```json
{
    "name": "name-project",
    "folderNode": "lib-recovery-folder",
    "folderOut": "final-folder-desired-files",
    "packages": {
        "name-package-npm" : {
            "version": "^1.0.0",
            "getFiles": ["folder/full/","or/justFile.js"]
        },
        "other-package" : {
            "version": "^0.0.1",
            "getFiles": ["dist/"]
        },
    }
}
```

### Execution

```bash
    npm install --save-dev
    npm run justPackages
```

### Option

Ne supprime pas le dossier "node_modules"
```bash
    npm run justPackages -- --no-delete-node
```

Change le chemin du fichier de configuration
```bash
    npm run justPackages -- --fileConf=test/justPackages.json
```

