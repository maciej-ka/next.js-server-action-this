import { Database } from "sqlite3";

const db = new Database('mydb.sqlite')

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, title TEXT)')
})

export default db;
