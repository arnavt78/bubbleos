const fs = require("fs").promises;
const path = require("path");

const _getSize = async (sizePath, type) => {
  if (type === "directory") {
    let totalSize = 0;
    const queue = [sizePath];

    while (queue.length > 0) {
      // Process directories in parallel (batch size tweakable)
      const batch = queue.splice(0, 20);

      const sizeResults = await Promise.all(
        batch.map(async (dirPath) => {
          try {
            const fileNames = await fs.readdir(dirPath); // Faster without { withFileTypes: true }
            const filePaths = fileNames.map((name) => path.join(dirPath, name));

            const statPromises = filePaths.map(async (filePath) => {
              try {
                const stats = await fs.stat(filePath);

                if (stats.isDirectory()) {
                  queue.push(filePath);
                  return 0; // Directories don't count toward size
                } else if (stats.isFile()) {
                  return stats.size;
                }
              } catch {
                return 0; // Skip inaccessible files
              }
            });

            return (await Promise.all(statPromises)).reduce((acc, size) => acc + size, 0);
          } catch {
            return 0; // Skip inaccessible directories
          }
        })
      );

      totalSize += sizeResults.reduce((acc, size) => acc + size, 0);
    }

    return totalSize;
  } else if (type === "file") {
    try {
      return (await fs.stat(sizePath)).size;
    } catch {
      throw new Error(`Cannot access file: ${sizePath}`);
    }
  } else {
    throw new Error(`Type ${type} was not a file or directory`);
  }
};

module.exports = _getSize;
