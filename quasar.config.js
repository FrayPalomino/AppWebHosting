import { configure } from "quasar/wrappers"

export default configure((ctx) => {
  return {
    eslint: {
      warnings: true,
      errors: true,
    },

    boot: ["supabase", "pinia"],

    css: ["app.css"],

    extras: ["roboto-font", "material-icons"],

    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node20",
      },

      vueRouterMode: "hash",

      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      },
    },

    devServer: {
      open: true,
    },

    framework: {
      config: {},

      plugins: ["Notify", "Dialog", "Loading", "LocalStorage", "SessionStorage"],
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ["render"],
    },

    pwa: {
      workboxMode: "generateSW",
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      inspectPort: 5858,
      bundler: "packager",
      packager: {},
      builder: {
        appId: "static-site-manager",
      },
    },

    bex: {
      contentScripts: ["my-content-script"],
    },
  }
})

