
# Hệ thống Smart Home Operating System

Đây là đồ án môn học Phân thích & Thiết kế Hệ thống - System Analysis & Design. Dự án quản lý khách sạn bao gồm Front-end (ReactJS) và Back-end (C# - ASP.NET Core).

## Công nghệ sử dụng
* **Back-end:** C# (ASP.NET Core), Xử lý Business Logic, RESTful APIs, System Time triggers.
* **Cơ sở dữ liệu:** MariaDB
* **Front-end:** ReactJS, Vite, Axios
* **Dữ liệu mẫu:** Python Scripts (Tự động gọi API để sinh dữ liệu)

## Hướng dẫn cài đặt và chạy dự án

### 1. Chạy Back-end (C# - ASP.NET Core)
* Mở thư mục SM_OS bằng Visual Studio/ JetBrains Rider
* Mở thư mục `Properties`.
* Cấu hình database MariaDB trong file `launchSetting,json`:
  * `{`
  * `  "$schema": "https://json.schemastore.org/launchsettings.json",`
  * `  "profiles": {`
  * `    "http": {`
  * `    "commandName": "Project",`
  * `    "dotnetRunMessages": true,`
  * `    "launchBrowser": false,`
  * `    "applicationUrl": "http://localhost:5291",`
  * `    "environmentVariables": {`
  * `      "ASPNETCORE_ENVIRONMENT": "Development"`
  * `    }`
  * `  },`
  * `  "https": {`
  * `    "commandName": "Project",`
  * `    "dotnetRunMessages": true,`
  * `    "launchBrowser": false,`
  * `    "applicationUrl": "https://localhost:7079;http://localhost:5291",`
  * `    "environmentVariables": {`
  * `      "ASPNETCORE_ENVIRONMENT": "Development"`
  * `      }`
  * `    }`
  * `  }`
  * `}`
### 2. Chạy Front-end (React)
* Mở Terminal, di chuyển vào thư mục `SM_OS_Frontend`.
* Chạy lệnh cài đặt thư viện: `npm install`
* Chạy ứng dụng: `npm run dev`
* Truy cập ứng dụng tại `http://localhost:5173` (hoặc port Vite cung cấp).

### 3. Tạo dữ liệu mẫu (Mock Data)
* Chạy file `mock_data.py` bằng Python để tự động bơm dữ liệu vào database thông qua API.

   **1. GenerateHotelData.py**
  [mock_data.py](https://github.com/user-attachments/files/27506815/mock_data.py)

