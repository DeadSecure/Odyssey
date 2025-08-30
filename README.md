# Odyssey

<p align="center">
  <img src="public/odyssey.png" alt="Odyssey Logo" width="300"/>
</p>

<p align="center">
  <a href="https://github.com/Javadyakuza/Odyssey/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/Javadyakuza/Odyssey/ci.yml?branch=main&style=plastic" alt="Build"/>
  </a>
  <a href="https://github.com/Javadyakuza/Odyssey/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Javadyakuza/Odyssey?style=plastic" alt="License"/>
  </a>
  <a href="https://github.com/Javadyakuza/Odyssey/blob/main/package.json">
    <img src="https://img.shields.io/github/package-json/v/Javadyakuza/Odyssey?style=plastic" alt="Version"/>
  </a>
  <a href="https://github.com/Javadyakuza/Odyssey/issues">
    <img src="https://img.shields.io/github/issues/Javadyakuza/Odyssey?style=plastic" alt="Issues"/>
  </a>
  <a href="https://github.com/Javadyakuza/Odyssey/pulls">
    <img src="https://img.shields.io/github/issues-pr/Javadyakuza/Odyssey?style=plastic" alt="Pull Requests"/>
  </a>
  <a href="https://github.com/Javadyakuza/Odyssey/stargazers">
    <img src="https://img.shields.io/github/stars/Javadyakuza/Odyssey?style=plastic" alt="Stars"/>
  </a>
  <a href="https://github.com/Javadyakuza/Odyssey/network/members">
    <img src="https://img.shields.io/github/forks/Javadyakuza/Odyssey?style=plastic" alt="Forks"/>
  </a>
  <a href="https://github.com/Javadyakuza/Odyssey/commits/main">
    <img src="https://img.shields.io/github/last-commit/Javadyakuza/Odyssey?style=plastic" alt="Last Commit"/>
  </a>
</p>

A unified monitoring service built on X-ray Core to fully monitor X-ray based services. Odyssey provides a user-friendly web interface to visualize and manage your X-ray instances.

[demo](https://test.odyssey.watch/polnet)
[Telegram Community](https://t.me/odyssey_mointoring)

## Features

- **Automatic detection:** Start with only one subscription link and monitor all your xray based configurations.
- **Real-time Status Monitoring:** View the real-time status of your xray based configurations.
- **Latency Tracking:** Monitor the latency of your xray based configurations.
- **Access Control:** Monitor the access to your xray based configurations to different websites and urls.
- **Interactive Charts:** Visualize data with interactive charts, inspired by [Arvan Cloud Radar](https://radar.arvancloud.ir).
- **Multi-language Support:** Available in English and Farsi.


## Purchase

Do you want to get rid of all configurations and bring up your own monitoring services with one click ?

Purchase the ready to go version of the project from the [Odyssey Telegram Support](https://t.me/javad_yakuzaa).

## ⚠️ Disclaimer

> **Important:**

> - The project is tested **only with subscription links containing `vless` and `vmess`** as their config protocols.

> - If the config protocol is `"ws"` (websocket), the program will detect it but ignore it (since HTTP/1.1 is not supported in the newest version of xray-core).

> - If the protocol of the target configuration is not **vless** or **vmess** then it was not in the testing scope of this project. you can  add a issue to the project if you want it added.

> - The paid version of the project is **identical** to the open-source version — you only pay for configuration and VM hardware.

> - This project is still **in development** and may contain bugs or incomplete features. Use it at your own risk.

> - Tested only on **Ubuntu 20+**.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

**dev**

- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/)

**prod**

- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/doc/install)
- [nginx]()

### Wizard

This project contains a wizard that will help you to add and manage your services.

see the [Wizard Wiki Page](https://github.com/Javadyakuza/Odyssey/wiki/Wizard-Wiki) for more information.

### Installation (ubuntu)

```bash

sudo bash -c "$(curl -sL https://raw.githubusercontent.com/javadyakuza/odyssey/main/install.sh)"

```

> NOTE: if you exited the wizard, you can run `odyssey` to reopen the menu.

### Remove Installation (ubuntu)

```bash

sudo bash -c "$(curl -sL https://raw.githubusercontent.com/javadyakuza/odyssey/main/uninstall.sh)"

```

## Development

First, clone the project with its submodules:

```bash
git clone --recursive https://github.com/javadyakuza/odyssey.git
```

Then, navigate to the project directory and install the dependencies:

```bash
cd odyssey
npm install
```

To run the application in wizard mode, use the following command:

```bash
npm run start
```

To run the application in development mode, use the following command:

```bash
npm run dev
```

> Notice that in development mode, you have to use the `/api/config` and `/api/runCore` endpoints to start and test a service.

### Production

## Built With

- [Next.js](https://nextjs.org/) - The React framework for production
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript
- [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) - A library for high-performance SQLite3 databases
- [X-ray Core](https://github.com/XTLS/Xray-core) - The core of the X-ray proxy service

## Contributing

If you would like to contribute to the project, please read the [contributing guidelines](CONTRIBUTING.md).

## Issues

If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository or contact the developer directly via [Odyssey Telegram Support](https://t.me/javad_yakuzaa).

## License

This project is under the [MIT License](./LICENSE.md).

## Donate

The best way is to give a star to the project on GitHub.

Also If you like this project, consider donating to support its development:

ARBITRUM ADDRESS: 0xefDe3a8E20b7B970D37f35C2b7ba5D4E9Cbb7557

TRON ADDRESS: TKDwVxe2A9L2ndU1BAwmHmq5ztE16SUSNS

## Acknowledgments

- The team behind [X-ray Core](https://github.com/XTLS/Xray-core) for their amazing work.
- The team behind [country.is](https://github.com/lineofflight/country) for their amazing "open source" work.
