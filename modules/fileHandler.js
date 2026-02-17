const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '..', 'employees.json');

async function read() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function write(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { read, write };
