# Architecture générale du projet

## css/
* **font/** : contient les icônes Material Design Google et la font Roboto
* **libs/** : contient le framework front-end Materialize minimisé
* **material-icons.css** : feuille de style CSS pour les icônes Material Design
* **palette.sass** : contient les couleurs choisies pour le projet
* **app.sass** : importe les couleurs de la palette et source principale du design de l'application
* **app.css** : fichier compilé à partir d'**app.sass**
* **app.min.css** : fichier minimisé à partir d'**app.css**

## data/
* **en-US.properties** : traduction en anglais 🇺🇸
* **fr.properties** : traduction en français 🇫🇷
* **locales.ini** : importe les traductions 

## img/
* **icons/** : contient les icônes nécessaires pour l'application (icônes de lancement)
* **fresh-snow.png** : image du fond de l'application (libre de droit, cf www.transparenttextures.com)

## js/
* **libs/** : contient plusieurs libraries (minimisées) dont JQuery 2.1.4, la version Gaia de l20n pour les traductions et le framework Materialize
* **app.js** : script JS de l'application
* **app.min.js** : script minimisé à partir d'**app.js**

## tech/
Contient diverses documentations sur le projet

## /
* Une page **HTML** par layout (index.html, objects.html, server.html, settings.html, etc.)
* **manifest.webapp** : le manifeste de l'application
* Un **README.md** de l'application (objectifs, avancements, comment contribuer, etc.)
* Un **README_original.md** : README informatif d'origine sur tout nouveau projet Firefox OS
* **LICENSE** : licence APACHE de l'application