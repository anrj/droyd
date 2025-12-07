const fs = require("fs");
const path = require("path");

function cleanupOutputs(maxAgeMinutes = 5) {
  const outputsDir = path.join(__dirname, "media", "outputs");
  const now = Date.now();
  const maxAge = maxAgeMinutes * 60 * 1000;

  try {
    const files = fs.readdirSync(outputsDir);
    let deletedCount = 0;

    files.forEach((file) => {
      if (file === ".gitkeep") {
        return;
      }

      const filePath = path.join(outputsDir, file);
      try {
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
          const age = now - stats.mtimeMs;
          if (age > maxAge) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        }
      } catch (err) {
        console.error(`[CLEANUP] Error deleting ${file}:`, err.message);
      }
    });

    if (deletedCount > 0) {
      console.log(
        `[CLEANUP] Deleted ${deletedCount} old file(s) from outputs/ (older than ${maxAgeMinutes} minutes)`,
      );
    }
  } catch (err) {
    console.error("[CLEANUP] Error reading outputs directory:", err.message);
  }
}

function cleanupMediaRoot(maxAgeMinutes = 5) {
  const mediaDir = path.join(__dirname, "media");
  const now = Date.now();
  const maxAge = maxAgeMinutes * 60 * 1000;

  try {
    const files = fs.readdirSync(mediaDir);
    let deletedCount = 0;

    files.forEach((file) => {
      const filePath = path.join(mediaDir, file);
      try {
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
          const age = now - stats.mtimeMs;
          if (age > maxAge) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        }
      } catch (err) {
        console.error(`[CLEANUP] Error deleting ${file}:`, err.message);
      }
    });

    if (deletedCount > 0) {
      console.log(
        `[CLEANUP] Deleted ${deletedCount} file(s) from media/ (older than ${maxAgeMinutes} minutes)`,
      );
    }
  } catch (err) {
    console.error("[CLEANUP] Error reading media directory:", err.message);
  }
}

function cleanup(maxAgeMinutes = 5) {
  cleanupOutputs(maxAgeMinutes);
  cleanupMediaRoot(maxAgeMinutes);
}

module.exports = {
  cleanupOutputs,
  cleanupMediaRoot,
  cleanup,
};
