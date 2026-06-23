module.exports = {
  apps: [
    {
      name: "incarcareauto",
      cwd: "/var/www/incarcareauto",
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      env_file: "/var/www/incarcareauto/.env",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
