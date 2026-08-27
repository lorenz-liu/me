---
title: "Using a Mac mini as a Proxy Server"
date: "2026-06-06"
excerpt: "Heading back to China soon? Stand up a proxy server at home."
tags: ["proxy"]
---

**Core:** Xray-core (VLESS + Reality)

**Network:** TP-Link router + the built-in official DDNS

## Stage 1: Prepare the network

This step is so that, from outside, you can find the Mac mini at home without missing.

### Give the Mac mini a static LAN IP

The Mac mini’s IP on the home network must never change. Before you change it, confirm the target IP (e.g. `192.168.0.2`) is not already taken by another device.

**Step 1: Check for an IP conflict (using `192.168.0.2` as an example)**

1. Open **Terminal** on the Mac.
2. Run: `arp -a` and hit return.
3. Look for `(192.168.0.2)` in the list:
   - If it does not appear, or it shows `? (192.168.0.2) at (incomplete)`, that IP is **free and safe** to use.
   - If that IP is followed by a MAC address (e.g. `at a1:b2:c3...`), it is taken. Try another number (e.g. `192.168.0.16`) and check again.

**Step 2: Pin the IP manually**

Once `192.168.0.2` is free, pin it:

1. Open **System Settings** > **Network** > select the current connection (Wi-Fi or Ethernet) > **Details**.
2. Switch to the **TCP/IP** tab.
3. **Configure IPv4:** choose `Manually`.
4. **IP Address:** `192.168.0.2`.
5. **Subnet Mask:** `255.255.255.0`.
6. **Router:** `192.168.0.1`.
7. Switch to the **DNS** tab, click `+` and force-add DNS so you do not lose connectivity:
   - `192.168.0.1`
   - `8.8.8.8`
   - `1.1.1.1`
8. Click **OK** to save.

### Set up Dynamic DNS (DDNS)

A home WAN IP will change. Use the router’s free built-in DDNS so a fixed hostname always tracks the current IP.

1. Log into the TP-Link admin page in a browser: `192.168.0.1`.
2. Go to **Advanced** > **Network** > **Dynamic DNS**.
3. **Provider:** choose `TP-Link`.
4. You will be asked to sign in with a TP-Link ID (if you do not have one, follow the prompt and register with an email for free).
5. After login, create your own hostname (e.g. `xxx.tplinkdns.com`).
6. Save, and make sure the status shows Successful. As long as the router is on, that hostname will always point home.

### Set up port forwarding

Forward inbound requests precisely onto the Mac mini.

1. In the TP-Link admin, go to **Advanced** > **NAT Forwarding** > **Virtual Servers**.
2. Click **+ Add**.
3. **External Port:** `4433`
4. **Internal Port:** `4433`
5. **Internal IP:** `192.168.0.2`
6. **Protocol:** `TCP`
7. Enable and save.

## Stage 2: Deploy the server on the Mac mini

Install and configure Xray in Terminal on macOS.

### Power settings

Stop the Mac mini from sleeping and killing the proxy.

- Go to **System Settings** > **Displays** > **Advanced**, and turn on “Prevent automatic sleeping when the display is off.”
- Go to **System Settings** > **Energy Saver** (or the advanced display settings) and make sure “Start up automatically after a power failure” is on.

### Install Xray

Open **Terminal** and run:

```bash
brew install xray
```

_(If brew is missing, install Homebrew from [brew.sh](https://brew.sh/) first.)_

### Generate keys

Run the following in Terminal, **and copy the output into a note**:

- Generate a UUID (the client password):

  ```bash
  xray uuid
  ```

- Generate a Reality key pair (Private key and Public key):

  ```bash
  xray x25519
  ```

### Write the config

Open the Xray config in any editor:

```
/opt/homebrew/etc/xray/config.json
```

Clear it and paste the JSON below. **Replace the placeholders with the real keys you just generated:**

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

### Start the service and enable launch at login

In Terminal:

```bash
sudo brew services start xray
```

The server should now be running quietly in the background. Check status:

```bash
brew services list
```

## Stage 3: Connect from a device you carry

When you are on a restricted network, configure a phone or laptop as follows.

### Recommended clients

- iOS / iPadOS: Shadowrocket
- Other: https://clash.guide/en/download.html

### Node parameters

In the client, add a **VLESS** node by hand and fill in:

- **Address/Host:** your DDNS hostname (e.g. `xxx.tplinkdns.com`)
- **Port:** `4433`
- **UUID:** _[the UUID you generated]_
- **Network/Transport:** `TCP`
- **Flow:** `xtls-rprx-vision`
- **TLS/Security:** `Reality`
- **SNI:** `www.apple.com`
- **PublicKey:** _[the Public key you generated]_
- **ShortId:** `88888888`
- **SpiderX / fingerprint:** leave empty, or `/`

Save, select the node, and connect. Open a browser.

The two clients think very differently: Shadowrocket is a manual form on the phone; Clash Verge is happier with a YAML file you deploy in one place.

Below is a drop-in import using the same parameters as above (`xxx.tplinkdns.com` and port `4433`). You only need to fill in your keys.

### Shadowrocket

On the phone, adding a node by hand is the most reliable path.

1. **New node:** open Shadowrocket, tap **`+`** in the top right.
2. **Type:** tap Type at the top, scroll, choose **`VLESS`**.
3. **Basics:**
   - **Address:** your DDNS hostname (e.g. `xxx.tplinkdns.com`)
   - **Port:** `4433`
   - **UUID:** paste the UUID from Terminal
4. **Flow:** find Flow and set **`xtls-rprx-vision`**.
5. **Turn on TLS and configure Reality:**
   - Flip **TLS** on (green).
   - Tap into **TLS**:
     - **Allow Insecure:** leave off.
     - **Peer Name / SNI:** `www.apple.com`
     - **ALPN:** check `h2` and `http/1.1`
   - **Plugin:** this is the important one. Tap Plugin, choose **`Reality`**, then:
     - **Public Key:** paste the Public key you generated
     - **Short Id:** `88888888`
     - **Spider X:** leave empty
6. **Save and connect:** tap Done/Save in the top right. Back on the home screen, select the new node and flip the top switch to test.

### Clash Verge

This is a self-hosted node, so there is no auto-generated “subscription URL” like a commercial provider. The cleanest approach in Clash Verge on a computer is **a local YAML profile**.

> **⚠️ Check first:** Clash Verge must be using the **Clash Mihomo (Meta)** core (left sidebar: Settings → Clash Core). Only that core supports VLESS-Reality.

**Step 1: Create a local profile**

1. Open Clash Verge, click **Profiles** in the left sidebar.
2. Click **New** at the top, choose **Local**.
3. Give it any name, then save.

**Step 2: Paste the config**

1. Right-click the profile you just created, choose **Edit**.
2. A text editor opens (or an in-app code view). Delete the default contents.
3. Paste the YAML below, replacing **[your UUID]** and **[your Public Key]** with the real strings:

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
