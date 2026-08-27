---
title: "Utiliser un Mac mini comme serveur proxy"
date: "2026-06-06"
excerpt: "Vous rentrez bientôt en Chine ? Montez un serveur proxy à la maison."
tags: ["proxy"]
---

**Cœur :** Xray-core (VLESS + Reality)

**Réseau :** routeur TP-Link + le DDNS officiel intégré

## Étape 1 : préparer le réseau

Cette étape sert à ce que, depuis l’extérieur, vous trouviez le Mac mini à la maison sans vous tromper.

### Donner au Mac mini une IP LAN statique

L’IP du Mac mini sur le réseau domestique ne doit plus jamais changer. Avant de la modifier, vérifiez que l’IP cible (par ex. `192.168.0.2`) n’est pas déjà prise par un autre appareil.

**Étape 1 : vérifier un conflit d’IP (exemple `192.168.0.2`)**

1. Ouvrez le **Terminal** sur le Mac.
2. Lancez : `arp -a` puis Entrée.
3. Cherchez `(192.168.0.2)` dans la liste :
   - S’il n’apparaît pas, ou s’il affiche `? (192.168.0.2) at (incomplete)`, cette IP est **libre et sûre**.
   - Si cette IP est suivie d’une adresse MAC (ex. `at a1:b2:c3...`), elle est prise. Essayez un autre numéro (ex. `192.168.0.16`) et revérifiez.

**Étape 2 : figer l’IP à la main**

Une fois `192.168.0.2` libre, figez-la :

1. Ouvrez **Réglages Système** > **Réseau** > sélectionnez la connexion actuelle (Wi-Fi ou Ethernet) > **Détails**.
2. Passez à l’onglet **TCP/IP**.
3. **Configurer IPv4 :** choisissez `Manuellement`.
4. **Adresse IP :** `192.168.0.2`.
5. **Masque de sous-réseau :** `255.255.255.0`.
6. **Routeur :** `192.168.0.1`.
7. Passez à l’onglet **DNS**, cliquez sur `+` et ajoutez de force des DNS pour ne pas perdre la connexion :
   - `192.168.0.1`
   - `8.8.8.8`
   - `1.1.1.1`
8. Cliquez sur **OK** pour enregistrer.

### Configurer le Dynamic DNS (DDNS)

L’IP WAN d’une box change. Utilisez le DDNS gratuit intégré au routeur pour qu’un nom d’hôte fixe suive toujours l’IP actuelle.

1. Connectez-vous à l’admin TP-Link dans un navigateur : `192.168.0.1`.
2. Allez dans **Avancé** > **Réseau** > **Dynamic DNS**.
3. **Fournisseur :** choisissez `TP-Link`.
4. On vous demandera de vous connecter avec un TP-Link ID (si vous n’en avez pas, suivez l’invite et inscrivez-vous gratuitement avec un e-mail).
5. Après connexion, créez votre propre hostname (ex. `xxx.tplinkdns.com`).
6. Enregistrez, et vérifiez que le statut affiche Successful. Tant que le routeur est allumé, ce hostname pointera toujours vers la maison.

### Configurer le port forwarding

Faire suivre les requêtes entrantes précisément vers le Mac mini.

1. Dans l’admin TP-Link, allez dans **Avancé** > **NAT Forwarding** > **Serveurs virtuels**.
2. Cliquez sur **+ Ajouter**.
3. **Port externe :** `4433`
4. **Port interne :** `4433`
5. **IP interne :** `192.168.0.2`
6. **Protocole :** `TCP`
7. Activez et enregistrez.

## Étape 2 : déployer le serveur sur le Mac mini

Installer et configurer Xray dans le Terminal sous macOS.

### Réglages d’alimentation

Empêcher le Mac mini de s’endormir et de tuer le proxy.

- Allez dans **Réglages Système** > **Moniteurs** > **Avancé**, et activez « Empêcher la mise en veille automatique lorsque l’écran est éteint ».
- Allez dans **Réglages Système** > **Économiseur d’énergie** (ou les réglages avancés d’affichage) et vérifiez que « Démarrer automatiquement après une coupure de courant » est activé.

### Installer Xray

Ouvrez le **Terminal** et lancez :

```bash
brew install xray
```

_(Si brew est absent, installez d’abord Homebrew depuis [brew.sh](https://brew.sh/).)_

### Générer les clés

Lancez les commandes suivantes dans le Terminal, **et copiez la sortie dans une note** :

- Générer un UUID (le mot de passe client) :

  ```bash
  xray uuid
  ```

- Générer une paire de clés Reality (Private key et Public key) :

  ```bash
  xray x25519
  ```

### Écrire la config

Ouvrez la config Xray dans n’importe quel éditeur :

```
/opt/homebrew/etc/xray/config.json
```

Videz-la et collez le JSON ci-dessous. **Remplacez les placeholders par les vraies clés que vous venez de générer :**

```json
{
  "inbounds": [
    {
      "port": 4433,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "【填入你生成的 UUID】",
            "flow": "xtls-rprx-vision"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "tcp",
        "security": "reality",
        "realitySettings": {
          "dest": "www.apple.com:443",
          "serverNames": ["www.apple.com", "apple.com"],
          "privateKey": "【填入你生成的 Private key】",
          "shortIds": ["88888888"]
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom"
    }
  ]
}
```

### Démarrer le service et l’activer au login

Dans le Terminal :

```bash
sudo brew services start xray
```

Le serveur devrait maintenant tourner tranquillement en arrière-plan. Vérifiez le statut :

```bash
brew services list
```

## Étape 3 : se connecter depuis un appareil que vous emportez

Quand vous êtes sur un réseau restreint, configurez un téléphone ou un ordinateur comme suit.

### Clients recommandés

- iOS / iPadOS : Shadowrocket
- Autres : https://clash.guide/en/download.html

### Paramètres du nœud

Dans le client, ajoutez à la main un nœud **VLESS** et remplissez :

- **Address/Host :** votre hostname DDNS (ex. `xxx.tplinkdns.com`)
- **Port :** `4433`
- **UUID :** _[l’UUID que vous avez généré]_
- **Network/Transport :** `TCP`
- **Flow :** `xtls-rprx-vision`
- **TLS/Security :** `Reality`
- **SNI :** `www.apple.com`
- **PublicKey :** _[la Public key que vous avez générée]_
- **ShortId :** `88888888`
- **SpiderX / empreinte :** laisser vide, ou `/`

Enregistrez, sélectionnez le nœud, et connectez-vous. Ouvrez un navigateur.

Les deux clients pensent très différemment : Shadowrocket est un formulaire manuel sur le téléphone ; Clash Verge préfère un fichier YAML que vous déployez au même endroit.

Ci-dessous, un import prêt à coller avec les mêmes paramètres (`xxx.tplinkdns.com` et port `4433`). Il ne reste qu’à remplir vos clés.

### Shadowrocket

Sur le téléphone, ajouter un nœud à la main est le chemin le plus fiable.

1. **Nouveau nœud :** ouvrez Shadowrocket, tapez **`+`** en haut à droite.
2. **Type :** tapez Type en haut, faites défiler, choisissez **`VLESS`**.
3. **Bases :**
   - **Address :** votre hostname DDNS (ex. `xxx.tplinkdns.com`)
   - **Port :** `4433`
   - **UUID :** collez l’UUID du Terminal
4. **Flow :** trouvez Flow et mettez **`xtls-rprx-vision`**.
5. **Activer TLS et configurer Reality :**
   - Activez **TLS** (vert).
   - Entrez dans **TLS** :
     - **Allow Insecure :** laisser désactivé.
     - **Peer Name / SNI :** `www.apple.com`
     - **ALPN :** cocher `h2` et `http/1.1`
   - **Plugin :** c’est le point important. Tapez Plugin, choisissez **`Reality`**, puis :
     - **Public Key :** collez la Public key générée
     - **Short Id :** `88888888`
     - **Spider X :** laisser vide
6. **Enregistrer et connecter :** tapez Done/Save en haut à droite. Sur l’écran d’accueil, sélectionnez le nouveau nœud et basculez l’interrupteur du haut pour tester.

### Clash Verge

C’est un nœud auto-hébergé, donc pas d’URL d’abonnement générée automatiquement comme chez un fournisseur. L’approche la plus propre dans Clash Verge sur ordinateur est **un profil YAML local**.

> **⚠️ Vérifiez d’abord :** Clash Verge doit utiliser le core **Clash Mihomo (Meta)** (barre gauche : Réglages → Clash Core). Seul ce core gère VLESS-Reality.

**Étape 1 : créer un profil local**

1. Ouvrez Clash Verge, cliquez sur **Profiles** dans la barre gauche.
2. Cliquez sur **New** en haut, choisissez **Local**.
3. Donnez-lui un nom, puis enregistrez.

**Étape 2 : coller la config**

1. Clic droit sur le profil que vous venez de créer, choisissez **Edit**.
2. Un éditeur de texte s’ouvre (ou une vue code dans l’app). Supprimez le contenu par défaut.
3. Collez le YAML ci-dessous, en remplaçant **[votre UUID]** et **[votre Public Key]** par les vraies chaînes :

```yaml
proxies:
  - name: "【你设置的名字】"
    type: vless
    server: 【你的DDNS】
    port: 4433
    uuid: 【你的UUID】
    network: tcp
    tls: true
    udp: true
    flow: xtls-rprx-vision
    servername: www.apple.com
    reality-opts:
      public-key: 【你的Public Key】
      short-id: "88888888"
    client-fingerprint: chrome

proxy-groups:
  - name: "Proxy"
    type: select
    proxies:
      - "【你设置的名字】"
      - DIRECT

rules:
  - MATCH,Proxy
```
