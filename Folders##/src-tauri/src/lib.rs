// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use base64::encode;
use mouse_position::mouse_position::Mouse;
use std::env;
use std::path::PathBuf;
use std::io::{Error, ErrorKind};
use std::fs::File;
use std::io::Read;
use std::process::Command;
use windows_sys::Win32::Foundation::HWND;
use windows_sys::Win32::Foundation::RECT;
use windows_sys::Win32::UI::WindowsAndMessaging::{GetDesktopWindow, GetWindowRect};
static mut STARTING_POINT: (&str, &str) = ("left", "top");
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            run_command,
            read_png_as_base64,
            ask_for_directions,
            get_icon
        ])
        .setup(|app| {
            let (x, y) = localize_mouse();
            let (screen_width, screen_height) = get_screen_size();
            let mut designated_position = (x, y);
            if x as f64 > (screen_width / 2.0) {
                designated_position.0 = x - 600;
                unsafe {
                    STARTING_POINT.0 = "right";
                }
            }
            if y as f64 > screen_height / 2.0 {
                designated_position.1 = y - 600;
                unsafe {
                    STARTING_POINT.1 = "bottom";
                }
            }
            let _main_window = tauri::WebviewWindowBuilder::new(
                app,
                "core",
                tauri::WebviewUrl::App("folder/index.html".into()),
            )
            .decorations(false)
            .transparent(true)
            .shadow(false)
            .inner_size(500.0, 480.0)
            .max_inner_size(1000.0, 1000.0)
            .resizable(true)
            .position(designated_position.0 as f64, designated_position.1 as f64)
            .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
#[tauri::command]
fn read_png_as_base64(file_path: String) -> Result<String, String> {
    let mut file = File::open(&file_path).map_err(|e| format!("Failed to open file: {}", e))?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)
        .map_err(|e| format!("Failed to read file: {}", e))?;
    Ok(encode(&buffer))
}

#[tauri::command]
fn run_command(command: String) -> Result<(), String> {
    Command::new("powershell")
        .arg("-Command")
        .arg(command)
        .spawn()
        .map_err(|e| format!("Failed to execute command: {}", e))?;
    Ok(())
}

#[tauri::command]
async fn ask_for_directions() -> (&'static str, &'static str) {
    unsafe {
        return STARTING_POINT;
    }
}

#[derive(Debug)]
enum IconError {
    IoError(std::io::Error),
    Utf8Error(std::string::FromUtf8Error),
    Custom(String),
}

// Implement conversion from IoError
impl From<std::io::Error> for IconError {
    fn from(error: std::io::Error) -> Self {
        IconError::IoError(error)
    }
}

// Implement conversion from Utf8Error
impl From<std::string::FromUtf8Error> for IconError {
    fn from(error: std::string::FromUtf8Error) -> Self {
        IconError::Utf8Error(error)
    }
}

// Implement conversion from IconError to String
impl From<IconError> for String {
    fn from(error: IconError) -> String {
        match error {
            IconError::IoError(e) => e.to_string(),
            IconError::Utf8Error(e) => e.to_string(),
            IconError::Custom(s) => s,
        }
    }
}
fn get_executable_dir() -> Result<PathBuf, IconError> {
    env::current_exe()?
        .parent()
        .ok_or_else(|| IconError::Custom("Unable to get executable directory".to_string()))
        .map(PathBuf::from)
}

#[tauri::command]
fn get_icon(path: &str) -> Result<String, String> {
    // Get the directory where our executable is located
    let exe_dir = get_executable_dir()?;
    
    // Construct path to icon.exe
    let icon_exe = exe_dir.join("icon.exe");
    
    // Verify icon.exe exists
    if !icon_exe.exists() {
        return Err(Error::new(
            ErrorKind::NotFound,
            format!("icon.exe not found in {}", exe_dir.display())
        ).to_string());
    }

    // Run icon.exe with the provided shortcut path
    let output = match Command::new(icon_exe)
        .arg(path)
        .output()
    {
        Ok(output) => output,
        Err(e) => return Err(e.to_string()),
    };

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    String::from_utf8(output.stdout).map_err(|e| e.to_string())
}

fn get_screen_size() -> (f64, f64) {
    unsafe {
        let hwnd: HWND = GetDesktopWindow();
        let mut rect = RECT {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        };

        if GetWindowRect(hwnd, &mut rect) != 0 {
            let width = (rect.right - rect.left) as f64;
            let height = (rect.bottom - rect.top) as f64;
            return (width, height);
        }
    }
    (0.0, 0.0)
}

fn localize_mouse() -> (i32, i32) {
    let position = Mouse::get_mouse_position();
    match position {
        Mouse::Position { x, y } => return (x, y),
        Mouse::Error => return (0, 0),
    }
}