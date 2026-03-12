use std::sync::Mutex;

mod db;
mod models;

struct DBState {
    conn: Mutex<rusqlite::Connection>,
}

#[tauri::command]
fn list_tasks(state: tauri::State<DBState>) -> Result<Vec<models::Task>, String> {
    let conn = &state.conn.lock().unwrap();
    db::list_tasks(conn, false, false).map_err(|e| e.to_string())
}

#[tauri::command]
fn add_task(name: String, state: tauri::State<DBState>) -> Result<(), String> {
    let conn = &state.conn.lock().unwrap();
    db::add_task(conn, &name).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_task_datetime(
    id: i64,
    datetime: chrono::DateTime<chrono::Utc>,
    state: tauri::State<DBState>,
) -> Result<(), String> {
    let conn = &state.conn.lock().unwrap();
    db::update_task_datetime(conn, id, datetime).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let conn = db::open_connection().expect("could not open connection");
    let state = DBState {
        conn: Mutex::new(conn),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            list_tasks,
            add_task,
            update_task_datetime
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
