#include <windows.h>
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <algorithm>
#include <shobjidl.h>
#include <shlguid.h>

// RAII wrapper for COM initialization
class CoInitializeWrapper {
public:
    CoInitializeWrapper() { 
        if (FAILED(CoInitialize(nullptr))) {
            throw std::runtime_error("Failed to initialize COM");
        }
    }
    ~CoInitializeWrapper() { CoUninitialize(); }
    // Prevent copying
    CoInitializeWrapper(const CoInitializeWrapper&) = delete;
    CoInitializeWrapper& operator=(const CoInitializeWrapper&) = delete;
};

// Smart pointer release functions for COM interfaces
template<typename T>
void SafeRelease(T*& ptr) {
    if (ptr) {
        ptr->Release();
        ptr = nullptr;
    }
}

std::wstring GetLnkTarget(const std::wstring& lnkPath) {
    std::wstring result;
    
    try {
        CoInitializeWrapper coinit;
        
        IShellLinkW* pShellLink = nullptr;
        IPersistFile* pPersistFile = nullptr;
        
        HRESULT hres = CoCreateInstance(CLSID_ShellLink, nullptr, CLSCTX_INPROC_SERVER,
                                      IID_IShellLinkW, (void**)&pShellLink);
        if (FAILED(hres)) {
            throw std::runtime_error("Failed to create IShellLink instance");
        }
        
        hres = pShellLink->QueryInterface(IID_IPersistFile, (void**)&pPersistFile);
        if (SUCCEEDED(hres)) {
            if (SUCCEEDED(pPersistFile->Load(lnkPath.c_str(), STGM_READ))) {
                WCHAR targetPath[MAX_PATH];
                WIN32_FIND_DATAW wfd;
                if (SUCCEEDED(pShellLink->GetPath(targetPath, MAX_PATH, &wfd, SLGP_UNCPRIORITY))) {
                    result = targetPath;
                }
            }
        }
        
        SafeRelease(pPersistFile);
        SafeRelease(pShellLink);
    }
    catch (const std::exception& e) {
        std::cerr << "Error in GetLnkTarget: " << e.what() << std::endl;
    }
    
    return result;
}

// Base64 encoding table
static const std::string base64_chars = 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789+/";

std::string base64_encode(const std::vector<BYTE>& data) {
    std::string ret;
    ret.reserve(((data.size() + 2) / 3) * 4); // Pre-allocate space
    
    size_t i = 0;
    while (i + 2 < data.size()) {
        ret += base64_chars[(data[i] & 0xfc) >> 2];
        ret += base64_chars[((data[i] & 0x03) << 4) + ((data[i + 1] & 0xf0) >> 4)];
        ret += base64_chars[((data[i + 1] & 0x0f) << 2) + ((data[i + 2] & 0xc0) >> 6)];
        ret += base64_chars[data[i + 2] & 0x3f];
        i += 3;
    }
    
    // Handle remaining bytes
    if (i < data.size()) {
        ret += base64_chars[(data[i] & 0xfc) >> 2];
        if (i + 1 < data.size()) {
            ret += base64_chars[((data[i] & 0x03) << 4) + ((data[i + 1] & 0xf0) >> 4)];
            ret += base64_chars[((data[i + 1] & 0x0f) << 2)];
        } else {
            ret += base64_chars[(data[i] & 0x03) << 4];
            ret += '=';
        }
        ret += '=';
    }
    
    return ret;
}

struct IconResource {
    WORD id;
    std::vector<BYTE> data;
    
    bool operator<(const IconResource& other) const {
        return id < other.id;
    }
};

std::vector<IconResource> GetIconResources(const std::wstring& exePath) {
    std::vector<IconResource> icons;
    
    HMODULE hModule = LoadLibraryExW(exePath.c_str(), NULL, LOAD_LIBRARY_AS_DATAFILE);
    if (!hModule) {
        std::cerr << "Failed to load module: " << GetLastError() << std::endl;
        return icons;
    }
    
    // Use MAKEINTRESOURCEW(3) for RT_ICON
    EnumResourceNamesW(hModule, MAKEINTRESOURCEW(3), 
        [](HMODULE hModule, LPCWSTR lpszType, LPWSTR lpszName, LONG_PTR lParam) -> BOOL {
            auto& icons = *reinterpret_cast<std::vector<IconResource>*>(lParam);
            
            IconResource icon;
            icon.id = IS_INTRESOURCE(lpszName) ? 
                     static_cast<WORD>(reinterpret_cast<ULONG_PTR>(lpszName)) : 0;
            
            if (HRSRC hResInfo = FindResourceW(hModule, lpszName, lpszType)) {
                if (HGLOBAL hRes = LoadResource(hModule, hResInfo)) {
                    DWORD size = SizeofResource(hModule, hResInfo);
                    if (LPVOID pResource = LockResource(hRes)) {
                        icon.data.resize(size);
                        memcpy(icon.data.data(), pResource, size);
                        icons.push_back(icon);
                    }
                }
            }
            return TRUE;
        }, reinterpret_cast<LONG_PTR>(&icons));
    
    FreeLibrary(hModule);
    
    // Sort icons by ID to get the highest numbered one
    std::sort(icons.begin(), icons.end());
    
    return icons;
}

int main(int argc, char* argv[]) {
    try {
        if (argc != 2) {
            throw std::runtime_error("Usage: program <path-to-shortcut.lnk>");
        }
        // Convert input path to wide string
        int wchars_num = MultiByteToWideChar(CP_UTF8, 0, argv[1], -1, NULL, 0);
        if (wchars_num == 0) {
            throw std::runtime_error("Failed to convert input path to wide string");
        }

        std::vector<wchar_t> wstr(wchars_num);
        if (MultiByteToWideChar(CP_UTF8, 0, argv[1], -1, wstr.data(), wchars_num) == 0) {
            throw std::runtime_error("Failed to convert input path to wide string");
        }

        std::wstring shortcutPath(wstr.data());
        std::wstring targetPath = GetLnkTarget(shortcutPath);
        
        if (targetPath.empty()) {
            throw std::runtime_error("Failed to get shortcut target path");
        }

        auto icons = GetIconResources(targetPath);
        if (icons.empty()) {
            throw std::runtime_error("No icons found in target executable");
        }

        // Get the last (highest numbered) icon
        const auto& lastIcon = icons.back();
        std::string base64Icon = base64_encode(lastIcon.data);
        
        std::cout << base64Icon << std::endl;
        return 0;
    }
    catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
}