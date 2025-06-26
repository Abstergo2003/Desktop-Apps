#define INITGUID
#include <windows.h>
#include <shlobj.h>
#include <iostream>
#include <string>
#include <ctime>

std::wstring ExePath() {
    wchar_t buffer[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, buffer, MAX_PATH);
    std::wstring fullPath(buffer);
    std::wstring::size_type pos = fullPath.find_last_of(L"\\/");
    return fullPath.substr(0, pos + 1);
}

bool CreateDesktopShortcut(const std::wstring& targetPath,
                            const std::wstring& shortcutName,
                            const std::wstring& arguments,
                            const std::wstring& description = L"") {
    wchar_t desktopPath[MAX_PATH];
    if (FAILED(SHGetFolderPathW(NULL, CSIDL_DESKTOP, NULL, 0, desktopPath))) {
        std::wcerr << L"Failed to get desktop path." << std::endl;
        return false;
    }

    std::wstring shortcutPath = std::wstring(desktopPath) + L"\\" + shortcutName + L".lnk";

    HRESULT hr = CoInitializeEx(NULL, COINIT_APARTMENTTHREADED | COINIT_DISABLE_OLE1DDE);
    if (FAILED(hr)) {
        std::wcerr << L"Failed to initialize COM library." << std::endl;
        return false;
    }

    IShellLinkW* pShellLink = NULL;
    hr = CoCreateInstance(CLSID_ShellLink, NULL, CLSCTX_INPROC_SERVER, IID_IShellLinkW, (LPVOID*)&pShellLink);
    
    if (SUCCEEDED(hr)) {
        pShellLink->SetPath(targetPath.c_str());
        pShellLink->SetArguments(arguments.c_str());
        pShellLink->SetDescription(description.c_str());

        IPersistFile* pPersistFile;
        hr = pShellLink->QueryInterface(IID_IPersistFile, (void**)&pPersistFile);
        
        if (SUCCEEDED(hr)) {
            hr = pPersistFile->Save(shortcutPath.c_str(), TRUE);
            pPersistFile->Release();
        }

        pShellLink->Release();
    }

    CoUninitialize();
    
    return SUCCEEDED(hr);
}

int main() {
    time_t now = time(nullptr);
    std::wstring fileItem = L"folders.exe";
    std::wstring exPath = ExePath();
    std::wstring targetPath = exPath + fileItem;
    std::wstring arguments = std::to_wstring(now);
    std::wstring shortcutName = L"My Folder";
    std::wstring description = L"Open App Folder";

    if (CreateDesktopShortcut(targetPath, shortcutName, arguments, description)) {
        std::wcout << L"Shortcut created successfully!" << std::endl;
    } else {
        std::wcout << L"Failed to create shortcut." << std::endl;
    }

    return 0;
}