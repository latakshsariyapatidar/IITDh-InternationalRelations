import "dotenv/config";
import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.log(`[SERVER] Running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
