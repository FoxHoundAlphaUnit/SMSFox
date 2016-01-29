# Cas Utilisation Serveur

## Cas n°1

Nom : S’authentifier
Acteur(s) : Utilisateur -
Description : L'utilisateur doit s'identifier avant de pouvoir accéder à l'interface web. -
Auteur : Kévin Crouillère -
Date(s) : 29/01/2016 (première rédaction)

Pré-conditions : L’utilisateur veut utiliser le relais wéb SMS. 
Démarrage : L’utilisateur accède au relais web avec succès.


### Le scénario nominal :
1. Le système affiche la page d'identification.
2. L’utilisateur saisie le mot de passe.
3. Le système vérifie la validité du mot de passe.
4. Le système affiche un message en fonction du résultat de la vérification précédente.
5. Si la vérification s'effectue avec succès le système affiche la page d'envoi de SMS.          

### Les scénarios alternatifs:
5.a L’utilisateur a saisie un mauvais mot de passe (retour à l'étape 2).

## Cas n°2

Nom : Envoie d'un sms via l'interface web 
Acteur(s) : Utilisateur -
Description : L'utilisateur doit pouvoir envoyer un SMS depuis le téléphone à travers l'interface web. -
Auteur : Kévin Crouillère -
Date(s) : 29/01/2016 (première rédaction)

Pré-conditions : L’utilisateur doit être authentifié (Cas d’utilisation « S’authentifier »)
Démarrage : L’utilisateur s'est identifié avec succès.

### Le scénario nominal :
1. Le système affiche la page permettant d'envoyer un SMS.
2. L’utilisateur sélectionne un contact.
3. L'utilisateur saisie le message qu'il veut envoyer dans le champ texte prévu à cet effet.
4. L'utilisateur demande l'envoi du SMS via le bouton d'envoi.          

### Les scénarios alternatifs:
2.a L’utilisateur décide de saisir le contact manuellement.
