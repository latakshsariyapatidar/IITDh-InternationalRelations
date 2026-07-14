type NodeEnv = "development" | "production" | "test";

interface EnvironmentVariables {
  NODE_ENV: NodeEnv;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
}

function getReqString(key: string): string {
  const value = process.env[key];

  if (value === undefined || value.trim() === "") {
    throw new Error(
      `[env] Missing required environment variable: "${key}"\n` +
        `Make sure "${key}" is defined in your .env file.\n` +
        `See .env.example for the full list of required variables.`,
    );
  }

  return value.trim();
}

function getReqNum(key: string): number {
  const raw = getReqString(key);
  const parsed = parseInt(raw, 10);

  if (isNaN(parsed)) {
    throw new Error(
      `[env] Environment variable "${key}" must be a valid number.\n` +
        `Received: "${raw}"`,
    );
  }

  return parsed;
}

function getNodeEnv(): NodeEnv {
  const value = getReqString("NODE_ENV");
  const validValues = ["development", "production", "test"] as const;

  if (!validValues.includes(value as NodeEnv)) {
    throw new Error(
      `[env] NODE_ENV must be one of: ${validValues.join(", ")}.\n` +
        `Received: "${value}"`,
    );
  }

  return value as NodeEnv;
}

export const env: Readonly<EnvironmentVariables> = Object.freeze({
  NODE_ENV: getNodeEnv(),
  PORT: getReqNum("PORT"),
  DATABASE_URL: getReqString("DATABASE_URL"),
  JWT_SECRET: getReqString("JWT_SECRET"),
  GOOGLE_CLIENT_ID: getReqString("GOOGLE_CLIENT_ID"),
});

console.log(
  `[env] Environment loaded: NODE_ENV=${env.NODE_ENV} | PORT=${env.PORT}`,
);
