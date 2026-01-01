#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::Manager;

#[tauri::command]
fn login_user(_email: String, _password: String) -> bool {
    true
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![login_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
