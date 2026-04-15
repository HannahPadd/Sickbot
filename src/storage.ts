import { Database, sqlite3 } from "sqlite3";
import { open } from "sqlite";
import { join } from 'path';


export function Storage() {
    
const db = new Database(join(process.cwd(), 'database.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS game_pool (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    game_name TEXT NOT NULL,
    added_by TEXT,
    UNIQUE(guild_id, game_name)
  )
`);
}