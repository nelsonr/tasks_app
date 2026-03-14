use anyhow::{Context, Result};
use chrono::{self, SubsecRound};
use std::fs;

use crate::models::Task;

pub fn open_connection() -> Result<rusqlite::Connection> {
    let db_path = dirs::data_local_dir()
        .context("could not find local data directory")?
        .join("tasks_cli/tasks.db");

    fs::create_dir_all(
        db_path
            .parent()
            .context("could not find parent directory")?,
    )?;

    let conn = rusqlite::Connection::open(&db_path)?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            datetime DATETIME NOT NULL
        )",
        [],
    )?;

    Ok(conn)
}

pub fn list_tasks(
    conn: &rusqlite::Connection,
    today_only: bool,
    sort_ascending: bool,
) -> Result<Vec<Task>> {
    let today_date = chrono::Utc::now().date_naive();
    let order = if sort_ascending { "ASC" } else { "DESC" };

    let mut stmt = match today_only {
        true => conn.prepare(&format!(
            "SELECT id, name, datetime FROM tasks
            WHERE datetime >= {today_date}
            ORDER BY datetime {order}"
        ))?,
        false => conn.prepare(&format!(
            "SELECT id, name, datetime FROM tasks ORDER BY datetime {order}"
        ))?,
    };

    let rows = stmt.query_map([], |row| {
        Ok(Task {
            id: row.get(0)?,
            name: row.get(1)?,
            datetime: row.get(2)?,
        })
    })?;

    let mut tasks = Vec::new();
    for row in rows {
        tasks.push(row?);
    }

    Ok(tasks)
}

pub fn add_task(conn: &rusqlite::Connection, name: &str) -> Result<()> {
    conn.execute(
        "INSERT INTO tasks (name, datetime) VALUES (?, ?)",
        rusqlite::params![name, chrono::Utc::now().trunc_subsecs(0)],
    )?;

    Ok(())
}

pub fn delete_task(conn: &rusqlite::Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM tasks WHERE id = ?", rusqlite::params![id])?;

    Ok(())
}

pub fn update_task_name(conn: &rusqlite::Connection, id: i64, name: String) -> Result<()> {
    conn.execute(
        "UPDATE tasks SET name = ? WHERE id = ?",
        rusqlite::params![name, id],
    )?;

    Ok(())
}
pub fn update_task_datetime(
    conn: &rusqlite::Connection,
    id: i64,
    datetime: chrono::DateTime<chrono::Utc>,
) -> Result<()> {
    conn.execute(
        "UPDATE tasks SET datetime = ? WHERE id = ?",
        rusqlite::params![datetime, id],
    )?;

    Ok(())
}
