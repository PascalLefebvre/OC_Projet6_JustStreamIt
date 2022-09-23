# Openclassrooms - Projet 6 : Développez une interface utilisateur pour une application web Python

	Pour l'association fictive "JustStreamIt", développement d'une application web,
	à l'image de l'interface de Netflix, permettant de visualiser en temps réel un
	classement de films intéressants. Cette application est développée sans
	framework en Vanilla Javascript (aucune librairie n'est utilisée).
	Concernant les données nous utiliserons une API "maison" baptisée OCMovies-API.
	Cette dernière n’étant pas en ligne, nous utilisons une version de test locale
	pour pouvoir faciliter la réalisation du front-end de l'application.
	

## Installation et exécution

### De l'OCMovies-API

* Installation depuis le [dépôt GitHub de l'OCMovies-API](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR)

* Lancement du serveur depuis le répertoire racine de l'API via la commande :

	- (sans pipenv) : $ python manage.py runserver
	- (avec pipenv) : $ pipenv run python manage.py runserver
	
### De l'application web

* Installation de la plateforme logicielle "node.js"

* Lancement du bundler 'parcel' depuis le répertoire racine de l'application :
	
	$ npx parcel index.html

* Accéder au site web depuis un navigateur via l'adresse [http://localhost:1234]("http://localhost:1234")

