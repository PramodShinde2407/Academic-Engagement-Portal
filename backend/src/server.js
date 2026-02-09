import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port}`);
});
// Trigger restart
