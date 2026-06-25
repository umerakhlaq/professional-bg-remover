# 🪄 Professional Background Remover

[![Made with HTML](https://img.shields.io/badge/Made%20with-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![API](https://img.shields.io/badge/Powered%20by-remove.bg-4F7CFF?style=for-the-badge)](https://www.remove.bg/)

> **A sleek, AI-powered web tool to remove image backgrounds instantly – directly in your browser. No sign-ups, no installations.**

---

## ✨ Features

- 📤 **File Upload** – Drag & drop or browse images (PNG, JPG, WEBP, up to 10MB).
- 🔗 **URL Support** – Paste any image URL and process it directly.
- ⚡ **Instant AI Processing** – Uses the powerful `remove.bg` API to remove backgrounds in seconds.
- 👁️ **Side-by-Side Preview** – Compare the original image with the result.
- 💾 **HD Download** – Download the transparent-background PNG with one click.
- 📱 **Fully Responsive** – Works seamlessly on desktop, tablet, and mobile.
- 🎨 **Modern UI** – Clean, professional interface with real-time status feedback.

---

## 🚀 How to Use

1.  **Clone or download** this repository.
2.  Open `index.html` in your favourite browser (Chrome, Edge, Firefox, etc.).
3.  Choose your input method:
    - **Upload File**: Click the drop-zone or drag an image.
    - **Image URL**: Paste a direct image link in the URL tab.
4.  Click the **"Remove Background"** button.
5.  Wait a moment, and the result will appear alongside the original.
6.  Click **"Download HD Image"** to save the result as `no-bg.png`.

---

## 🛠️ Tech Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **API**: [remove.bg](https://www.remove.bg/) v1.0 REST API
- **Icons**: Font Awesome 6
- **Font**: Inter (Google Fonts)

---

## 🔧 Configuration (API Key)

> **Important**: This tool uses the remove.bg API. By default, the code includes a demo API key. For production use, replace it with your own.

1.  Go to [remove.bg](https://www.remove.bg/) and create a free account.
2.  Get your API key from the dashboard.
3.  Open `index.html` and find this line:
    ```javascript
    const API_KEY = 'M6t7eBWGwaxPMP1oBttTJ9vk';
