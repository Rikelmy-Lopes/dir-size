const { statSync, readdirSync } = require('fs');
const { join } = require('path');
const getDirSize = require('./promises/index.js');

const getFileSize = (filePath, callback) => {
  try {
    const fileStats = statSync(filePath);
    return fileStats.size;
  } catch (error) {
    typeof callback === 'function' && callback(error);
    return 0;
  }
};

const getDirEntries = (dirPath, callback) => {
  try {
    return readdirSync(dirPath, { withFileTypes: true });
  } catch (error) {
    typeof callback === 'function' && callback(error);
    return [];
  }
};

const calculateTotalDirSize = (dirPath, callback) => {
  let totalSize = 0;
  const entries = getDirEntries(dirPath, callback);
  const len = entries.length;

  for (let i = 0; i < len; i += 1) {
    const entryPath = join(dirPath, entries[i].name);
    totalSize += entries[i].isDirectory() ? calculateTotalDirSize(entryPath, callback) : getFileSize(entryPath, callback);
  }
    
  return totalSize;
};


  
/**
   * Calculates the total size of a folder and its subfolders.
   * @param {string} dirPath - The path to the folder.
   * @param {function(Error): void=} callback - A callback function that handles potential errors during the folder size calculation.
   * @returns {number} - The total size in bytes.
   * @throws {TypeError} - Throws an error if the provided path is not a string.
   * @since v1.0.0
   */
const getDirSizeSync = (dirPath, callback) => {
  if (typeof dirPath !== 'string') {
    throw new TypeError(`Path must be a string. Received: ${typeof dirPath}`);
  }

  return calculateTotalDirSize(dirPath, callback);
};
  
module.exports = {
  getDirSize,
  getDirSizeSync
};