import sqlite3 from 'sqlite3';
const sqld = sqlite3.verbose();
import fs from 'fs';
const db = new sqld.Database('db/sqlite.db');

const runSQLScript = (filename) => {
    const script = fs.readFileSync(filename, 'utf8');
    db.exec(script, (err) => {
        if (err) {
            console.log("erroer exec script: ", err);
        } else {
            console.log(`SQL script ${filename} run successfully`);
        }
    });
};

db.serialize(() => {
    /* runSQLScript('scripts/schema.sql');
    runSQLScript('scripts/dump.sql'); */
});

export default db;