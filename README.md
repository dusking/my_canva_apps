# Canva Apps SDK starter kit Helper

This repository is intended as a supplementary resource, not a replacement for the Canva APP SDK Starter Kit available
at https://github.com/canva-sdks/canva-apps-sdk-starter-kit. While this repository offers suggestions for developing
multiple Canva apps, it is crucial to adhere to the instructions provided in the official starter kit.

## Streamlining Development for Multiple Apps

While the starter kit repo (https://github.com/canva-sdks/canva-apps-sdk-starter-kit)
is fantastic for a single app, what if you're itching to create multiple applications or prefer
keeping your app code in a different repository? Here's a neat approach:

1. Organize Your Code:
   Create a new repo specifically for your Canva Applications code. Each application gets its dedicated folder within
   this repository.

2. Custom Development Setup:
   Within each app folder, craft a start.sh file with commands to copy your .env and link your app.tsx to the starter
   kit. This ensures a smooth development process.

```shell
cp ./.env ../../canva-apps-sdk-starter-kit/.env && \
ln -f ./app.tsx ../../canva-apps-sdk-starter-kit/src/app.tsx && \
cd ../../canva-apps-sdk-starter-kit/ && \
npm start
```

3. Configure Package.json:
   In each app folder, set up a package.json file with the necessary scripts.

```shell
{
  "type": "module",
  "scripts": {"start": "source start.sh"}
}
```

By adopting this approach, you can seamlessly work on different apps, pushing only the relevant code into your
repository. This decoupling from the starter kit allows for a flexible and organized development process. Happy coding!

### Step 1: Start the local development server

To start the boilerplate's development server, run the following command from the application folder:

```bash
npm start
```

The server becomes available at http://localhost:8080.

### Step 2: Preview the app

The local development server only exposes a JavaScript bundle, so you can't preview an app by
visiting http://localhost:8080. You can only preview an app via the Canva editor.

To preview an app:

1. Create an app via the [Developer Portal](https://www.canva.com/developers).
2. Select **App source > Development URL**.
3. In the **Development URL** field, enter the URL of the development server.
4. Click **Preview**. This opens the Canva editor (and the app) in a new tab.
5. Click **Use**. (This screen only appears when when using an app for the first time.)

The app will appear in the side panel.

### (Optional) Step 3: Enable Hot Module Replacement

By default, every time you make a change to an app, you have to reload the entire app to see the results of those
changes. If you enable [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) (HMR), changes
will be reflected without a full reload, which significantly speeds up the development loop.

**Note:** HMR does **not** work while running the development server in a Docker container.

To enable HMR:

1. Navigate to the [Your apps](https://www.canva.com/developers/apps) page.
2. Copy the ID of an app from the **App ID** column.
3. In the starter kit's `.env` file:

    1. Set `CANVA_APP_ID` to the ID of the app.
    2. Set `CANVA_HMR_ENABLED` to `TRUE`.

   For example:

   ```bash
   CANVA_APP_ID=AABBccddeeff
   CANVA_BACKEND_PORT=3001
   CANVA_FRONTEND_PORT=8080
   CANVA_BACKEND_HOST=http://localhost:3001
   CANVA_HMR_ENABLED=TRUE
   ```

4. Restart the local server.

## Build

As in https://www.canva.dev/docs/apps/bundling-apps/

Navigate into the starter kit:

```BASH
cd canva-apps-sdk-starter-kit
```

Run the following command:

```BASH
npm run build
```

An app.js file will appear in the dist directory.
