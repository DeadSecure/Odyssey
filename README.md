# Odyssey

![Odyssey Logo](public/odyssey.png)

[![Build Status](https://img.shields.io/travis/com/Javadyakuza/Odyssey.svg?style=for-the-badge)](https://travis-ci.com/Javadyakuza/Odyssey)
[![License](https://img.shields.io/github/license/Javadyakuza/Odyssey?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/Javadyakuza/Odyssey?style=for-the-badge)](package.json)

A unified monitoring service built on X-ray Core to fully monitor X-ray based services. Odyssey provides a user-friendly web interface to visualize and manage your X-ray instances.

## Features

- **Automatic detection:** Start with only one subscription link and monitor all your xray based configurations.
- **Real-time Status Monitoring:** View the real-time status of your xray based configurations.
- **Latency Tracking:** Monitor the latency of your xray based configurations.
- **Access Control:** Monitor the access to your xray based configurations to different websites and urls.
- **Interactive Charts:** Visualize data with interactive charts, inspired by [Arvan Cloud Radar](https://radar.arvancloud.ir).
- **Multi-language Support:** Available in English and Farsi.

## Purchase

Do you want to get rid of all configurations and bring up your own monitoring services with one subscription link ?

Purchase the ready to go version of the project from the [Odyssey Telegram Support](https://t.me/javad_yakuzaa).

## Disclaimer

The paid version of the project is absolutely the same with its open-source and free version, only the cost of configuration and the hardware of the vm will be paid.

This project is still in development and may contain bugs or incomplete features. Use it at your own risk.

This project is only tested on ubuntu 20 or higher versions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/)

### Installation (ubuntu)

```bash

sudo bash -c "$(curl -sL https://raw.githubusercontent.com/javadyakuza/odyssey/feat/automation/install.sh)"

```

### Remove Installation (ubuntu)

```bash

sudo bash -c "$(curl -sL https://raw.githubusercontent.com/javadyakuza/odyssey/feat/automation/uninstall.sh)"

```

## Usage

### Development

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
npm run wizard
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

This project is under the [MIT License](./LICENSE).

## Donate

If you like this project, consider donating to support its development:

ARBITRUM ADDRESS: 0xefDe3a8E20b7B970D37f35C2b7ba5D4E9Cbb7557

TRON ADDRESS: TKDwVxe2A9L2ndU1BAwmHmq5ztE16SUSNS

## Acknowledgments

- The team behind [X-ray Core](https://github.com/XTLS/Xray-core) for their amazing work.
