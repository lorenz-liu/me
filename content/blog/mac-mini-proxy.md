---
title: "使用 Mac mini 搭建代理服务器"
date: "2026-06-06"
excerpt: "近期要回国吗？在家里架设一个代理服务器科学上网！"
tags: ["proxy"]
---

**核心：** Xray-core (VLESS + Reality 协议)

**网络环境：** TP-Link 路由器 + 官方内置 DDNS

## 阶段一：网络基础设施准备

这一步是为了确保你在外网能准确无误地找到家里的 Mac mini。

### 为 Mac mini 设置静态局域网 IP

必须确保 Mac mini 在家庭网络中的 IP 地址永不改变，但在修改前，我们需要先确认目标 IP（如 `192.168.0.2`）没有被家里其他设备占用。

**第一步：排查 IP 冲突（以 `192.168.0.2` 为例）**

1. 打开 Mac 的 **终端 (Terminal)**。
2. 输入命令：`arp -a` 并回车。
3. 在输出的列表中寻找 `(192.168.0.2)`：
   - 如果没有出现，或者显示为 `? (192.168.0.2) at (incomplete)`，说明该 IP 是**空闲且安全**的，可以继续使用。
   - 如果该 IP 后面跟着一串 MAC 地址（如 `at a1:b2:c3...`），说明已被占用，请换一个数字（如 `192.168.0.16`）再次排查。

**第二步：手动固定 IP 地址**

确认 `192.168.0.2` 可用后，将其固定：

1. 打开 **系统设置** > **网络** > 选择当前连接（Wi-Fi 或以太网）> **详细信息**。
2. 切换到 **TCP/IP** 选项卡。
3. **配置 IPv4：** 选择 `手动 (Manually)`。
4. **IP 地址：** 填入 `192.168.0.2`。
5. **子网掩码：** `255.255.255.0`。
6. **路由器：** `192.168.0.1`。
7. 切换到 **DNS** 选项卡，点击 `+` 强制添加 DNS 防止断网：
   - `192.168.0.1`
   - `8.8.8.8`
   - `1.1.1.1`
8. 点击 **好 (OK)** 保存。

### 配置动态域名 (DDNS)

由于家庭宽带的公网 IP 会变，我们需要使用路由器自带的免费 DDNS 服务，让一个固定域名实时追踪你的最新 IP。

1. 在浏览器登录 TP-Link 路由器后台：`192.168.0.1`。
2. 进入 **高级设置 (Advanced)** > **网络参数 (Network)** > **动态域名 (Dynamic DNS)**。
3. **服务提供商：** 选择 `TP-Link`。
4. 此时系统会要求你登录 TP-Link ID（如果没有，点击界面的提示用邮箱免费注册一个即可）。
5. 登录后，直接创建一个属于你自己的域名（例如 `xxx.tplinkdns.com`）。
6. 点击保存，确保状态显示为“成功 (Successful)”。以后只要路由器开着，这个域名就永远指向你的家。

### 配置端口映射 (Port Forwarding)

将外网请求精准转发到 Mac mini 上。

1. 在 TP-Link 路由器后台，进入 **高级设置 (Advanced)** > **NAT 转发 (NAT Forwarding)** > **虚拟服务器 (Virtual Servers)**。
2. 点击 **添加 (+ Add)**。
3. **外部端口 (External Port)：** `4433`
4. **内部端口 (Internal Port)：** `4433`
5. **内部 IP (Internal IP)：** `192.168.0.2`
6. **协议 (Protocol)：** `TCP`
7. 启用并保存。

## 阶段二：Mac mini 服务端部署

在 macOS 的终端里安装并配置 Xray 核心程序。

### 调整电源设置

防止 Mac mini 休眠导致代理失效。

- 进入 **系统设置** > **显示器** > **高级**，开启“当显示器关闭时防止系统自动进入睡眠”。
- 进入 **系统设置** > **节能 (Energy Saver)** （或显示器高级设置中），确保开启“断电后自动启动”。

### 安装 Xray

打开 **终端 (Terminal)**，执行以下命令：

```bash
brew install xray
```

_(如果提示找不到 brew，请先去 [brew.sh](https://brew.sh/) 安装 Homebrew)_

### 生成安全密钥

在终端依次执行以下命令，**务必将输出结果复制保存到备忘录**：

- 生成 UUID (用户连接密码)：

  ```bash
  xray uuid
  ```

- 生成 Reality 密钥对 (会输出 Private key 和 Public key)：

  ```bash
  xray x25519
  ```

### 编写配置文件

使用任意编辑器打开 Xray 配置文件：

```
/opt/homebrew/etc/xray/config.json
```

清空原内容，粘贴以下 JSON 代码。**注意：请将提示部分替换为你刚刚生成的真实密钥**：

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

### 启动服务并设置开机自启

在终端执行：

```bash
sudo brew services start xray
```

至此，服务端已在后台静默运行。验证启动状态：

```bash
brew services list
```

## 阶段三：随身设备客户端连接

当你身处网络受限区域时，在手机或电脑上进行如下配置。

### 推荐客户端

- iOS / iPadOS: Shadowrocket
- 其他：https://clash.guide/en/download.html

### 节点配置参数

在客户端软件中手动添加一个 **VLESS** 节点，填入以下信息：

- **地址 (Address/Host)：**申请的动态域名（e.g. `xxx.tplinkdns.com`）
- **端口 (Port)：** `4433`
- **UUID：** _【你生成的 UUID】_
- **传输协议 (Network/Transport)：** `TCP`
- **流控 (Flow)：** `xtls-rprx-vision`
- **底层传输安全 (TLS/Security)：** `Reality`
- **SNI (伪装域名)：** `www.apple.com`
- **PublicKey (公钥)：** _【你生成的 Public key】_
- **ShortId：** `88888888`
- **SpiderX / 拨号指纹：** 留空 或填 `/`

保存配置，选中该节点并点击连接。打开浏览器。

这两款客户端的设计逻辑截然不同：Shadowrocket 偏向于在手机端手动填表，而 Clash Verge 更适合通过代码（YAML 配置文件）进行统一部署。

以下是为你量身定制的无缝导入教程，我会直接将你之前的配置参数（如 `xxx.tplinkdns.com` 和 `4433` 端口）代入其中，你只需要填入你的核心密钥即可。

### Shadowrocket

在手机端，我们通过手动添加节点的方式最为稳妥。

1. **新建节点：** 打开 Shadowrocket，点击右上角的 **`+`** 号。
2. **选择类型：** 点击最上方的“类型 (Type)”，在列表中向下滚动，选择 **`VLESS`**。
3. **填写基础信息：**
   - **地址 (Address)：** 申请的动态域名（e.g. `xxx.tplinkdns.com`）
   - **端口 (Port)：** `4433`
   - **UUID：** 粘贴你之前在终端生成的 UUID
4. **配置流控 (Flow)：** 找到“流控 (Flow)”选项，填写或选择 **`xtls-rprx-vision`**。
5. **开启 TLS 并配置 Reality：**
   - 将 **TLS** 的开关打开（变为绿色）。
   - 点击进入 **TLS** 选项内部：
     - **允许不安全 (Allow Insecure)：** 保持关闭。
     - **对等名称 (Peer Name / SNI)：** 填写 `www.apple.com`
     - **ALPN：** 勾选 `h2` 和 `http/1.1`
   - **插件 (Plugin)：** 这一步最关键！点击插件，选择 **`Reality`**，然后进入 Reality 的设置：
     - **Public Key (公钥)：** 粘贴你之前生成的 Public key
     - **Short Id：** 填写 `88888888`
     - **Spider X：** 留空即可
6. **保存并连接：** 点击右上角的**完成/保存**。回到主界面，选中刚刚建好的节点，打开顶部的全局开关进行测试。

### Clash Verge

由于是自己搭建的独立节点，没有机场那种自动生成的“订阅链接”，因此在电脑端的 Clash Verge 中，最优雅的方法是**新建一个本地 YAML 配置文件**。

> **⚠️ 前置检查：** 确保你的 Clash Verge 使用的是 **Clash Mihomo (Meta)** 内核（在左侧“设置” -> “Clash 内核”中确认），只有该内核才支持 VLESS-Reality 协议。

**第一步：创建本地配置**

1. 打开 Clash Verge，点击左侧边栏的 **配置 (Profiles)**。
2. 点击顶部的 **新建 (New)** 按钮，选择 **本地文件 (Local)**。
3. 随便给这个配置起个名字，然后点击保存。

**第二步：填入专属代码**

1. 在刚刚创建好的 Profile 上点击**右键**，选择 **编辑 (Edit)**。
2. 此时会弹出一个文本编辑器（或直接在应用内打开代码编辑界面）。将里面的默认代码全部删掉。
3. 将下面这段 YAML 代码粘贴进去，只需要把里面带括号的 **【你的UUID】** 和 **【你的Public Key】** 替换成真实字符串：

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
