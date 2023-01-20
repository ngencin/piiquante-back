Projet 6 - Création d’une API sécurisée pour une application
d'évaluation

Étape 1 : Démarrer le serveur backend
○ Créer un projet vide pour démarrer le serveur Node.js 
○ Installer Express 
○ Installer Mongoose
○ Utilisez ( express.json() ) pour analyser le corps de la requête

Étape 2 : Construire le parcours utilisateur
Créez les éléments suivants :
○ Modèle d'utilisateur 
○ Parcours utilisateur 
○ Contrôleur d'utilisateur
● L'utilisateur est en mesure d'effectuer les opérations suivantes :
○ Créer un compte 
○ Se connecter et disposer d'un token valide

Étape 3 : Démarrer le middleware
○ Ajout de multer pour les images.
○ Ajout d’authorize pour la validation des tokens

Étape 4 : Construire la route Sauce de l’API
Créez les éléments suivants :
○ Le Modèle Sauce 
○ La Route Sauce 
○ Le Contrôleur Sauce
● Autorisez toutes les fonctions en utilisant middleware Authorize
● L'utilisateur est en mesure d'effectuer les opérations suivantes :
○ Ajouter une nouvelle sauce 
○ Supprimer une sauce 
○ Voir toutes les sauces

Étape 5 : Terminer la route Sauce de l’API
Exécutez l'application en tant qu'utilisateur pour vérifier que toutes
les fonctions ont été correctement mises en œuvre, testez :
○ Les deux types de demandes 
■ Avec un fichier présent 
■ Sans fichier
○ Les trois scénarios de la fonction « like » (1, 0, -1) 
■ L’utilisateur peut liker ou ne pas aimer une sauce (ou
aucun des deux)
○ Seul le propriétaire de la sauce peut modifier ou supprimer
une sauce existante

Les dépendances à installer :
■ npm install express // gestion de l'application
■ npm install mongoose // lien avec la base de données
■ npm install mongoose-unique-validator // email unique
■ npm install bcrypt // fonction de hachage du mot de passe
■ npm install jsonwebtoken // création du token
■ npm install multer // gestion des images
■ npm install dotenv --save // variables d'environnement


Lancement du server backend : nodemon server js
Lancement du server frontend : npm run start


