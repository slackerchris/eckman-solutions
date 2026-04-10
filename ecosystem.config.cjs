module.exports = {
  apps: [
    {
      name: "eckman-solutions",
      script: "npm",
      args: "run start -- --hostname 127.0.0.1 --port 3000",
      cwd: "/var/www/eckman",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "400M",
    },
  ],
};