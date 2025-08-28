# Odyssey Wizard Commands

The Odyssey wizard is a command-line interface (CLI) tool for managing Odyssey monitoring services. Here's a breakdown of the available commands:

### `✚ Add Service`

This command allows you to add a new monitoring service. It will prompt you for the following information:

- **Subscription Link**: The subscription link for the service (unlimited in days and traffic).
- **Service Name**: A name for the service.
- **Telegram Support ID**: The Telegram support ID for the service (e.g., `@PolNetSupport`).

After you provide this information, the wizard will generate a new page and configuration file for the service.

### `🗑️ Delete Service`

This command allows you to delete an existing service. It will remove the service's page, logs, and configuration.

### `🚀 Start Service`

This command starts a monitoring service. It will first check if the base Odyssey server is running and start it if it's not. Then, it will start the selected service.

### `▐▐ Stop Service core`

This command stops a running monitoring service.

### `🔄 Running Services`

This command lists all the currently running services.

### `✔ Added Services`

This command lists all the services that have been added.

### `⏻ Stop Odyssey`

This command stops the base Odyssey server and all running services.

### `🏃🚪Exit`

This command exits the wizard but does "NOT" stop the base Odyssey server or running services.
