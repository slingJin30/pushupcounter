# 🏋️ Push-Up Counter Pro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_BADGE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_NETLIFY_SITE_NAME/deploys) <!-- TODO: Replace with actual Netlify badge ID and site name -->

**A modern, feature-rich, and customisable push-up (and other exercises!) counter web app designed for personal fitness tracking and motivation.**

Track your workouts, set goals, save progress locally, personalise your experience, and share your achievements with ease. Built with HTML, CSS, JavaScript, and leveraging modern browser features for a seamless experience.

![Example screenshot of Push-Up Counter Pro](readme-example-image.png)

---

## ✨ Key Features

*   **💪 Multi-Exercise Tracking:** Log not just push-ups, but any exercise you define (e.g., Sit Ups, Squats, Pull Ups).
*   🎯 **Customisable Goals:** Set your target for each exercise and visually track your progress.
*    motivationalMsgEl.textContent = newMessage; motivationalMsgEl.classList.remove('animate-new-message'); void motivationalMsgEl.offsetWidth; // Trigger reflow motivationalMsgEl.classList.add('animate-new-message');
*    motivatingMsgEl.textContent = newMessage; motivationalMsgEl.classList.remove('animate-new-message'); void motivationalMsgEl.offsetWidth; // Trigger reflow motivationalMsgEl.classList.add('animate-new-message');
*   💡 **Motivational Messages:** Receive encouraging messages to keep you going.
*   👤 **Personalisation:** Add your username for a more personal touch.
*   🎨 **Theme Customisation:**
    *   Switch between **Light and Dark modes**.
    *   Select your preferred **accent colour** to style the app.
*   💾 **Local Data Storage:** All progress and settings are saved securely in your browser's IndexedDB.
    *   **Warning:** Clearing browser data will erase this information unless backed up.
*   🔄 **Import/Export Data:** Easily back up your exercise data and settings to a JSON file and import it back when needed.
*   📱 **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices.
*   👆 **Swipe Controls:** Quickly add/subtract counts with intuitive swipe gestures on mobile.
*   📸 **Instant Screenshots:** Capture and download an image of your current progress.
*   🎵 **YouTube Music Integration:** Quick link to YouTube for workout music based on your current exercise.
*   🚫 **No Account Needed:** All features work offline and without registration.
*   🔒 **Privacy Focused:** Your data stays on your device.
*   🌟 **Open Source:** Free to use, modify, and share under the MIT License.

---

## 🛠️ Technologies Used

*   **HTML5**
*   **CSS3**
*   **JavaScript (ES6+)**
*   [**Bootstrap 5**](https://getbootstrap.com/) - For responsive layout and UI components.
*   [**Dexie.js**](https://dexie.org/) - For easy IndexedDB management.
*   [**Hammer.js**](https://hammerjs.github.io/) - For touch gesture (swipe) support.
*   [**html2canvas**](https://html2canvas.hertzen.com/) - For screenshot functionality.
*   [**QRCode.js**](https://davidshimjs.github.io/qrcodejs/) - For generating QR codes (e.g., Bitcoin address).

---

## 🚀 Getting Started

No installation is needed for general use!

**Live Demo:** 👉 **[Try Push-Up Counter Pro Now!](https://countpushups.netlify.app/)** 👈

### For Local Development/Modification:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/slingJin30/pushupcounter.git
    ```
2.  **Navigate to the directory:**
    ```bash
    cd pushupcounter
    ```
3.  **Open `index.html` in your browser.**
    That's it! All necessary libraries are either included or loaded via CDN.

---

## 📖 How to Use

1.  **Personalise (Optional):**
    *   Enter your username and click "Save".
    *   Choose your preferred theme (Light/Dark) using the 🌙/☀️ icon.
    *   Select an accent colour.
2.  **Select or Add an Exercise:**
    *   Use the "Select Exercise" dropdown.
    *   Click "Add New Exercise" to create a custom exercise.
    *   You can also "Rename Current" or "Delete Current" exercise from the dropdown.
3.  **Set Your Goal:**
    *   Click the "Set Goal" button (🚩 icon).
    *   Enter your target number for the current exercise and save.
4.  **Track Your Reps:**
    *   Use the `+1`, `+5`, `+10`, `+50` buttons to add reps.
    *   Use the `-1`, `-10` buttons to subtract reps.
    *   On touch devices, **swipe left** on the count display to add 1 rep, or **swipe right** to subtract 1 rep.
5.  **Monitor Progress:**
    *   The counter displays your current reps.
    *   The progress bar shows your reps against your goal.
    *   Motivational messages will appear to cheer you on!
6.  **Save/Share Progress:**
    *   Click "Save Progress Image" (📸 icon) to download a screenshot of your stats.
7.  **Data Management:**
    *   Your data (exercises, counts, goals, settings) is saved automatically in your browser.
    *   Use **"Export Data"** (in the footer) to save all your data to a JSON file as a backup.
    *   Use **"Import Data"** (in the footer) to restore your data from a previously exported JSON file.
8.  **Reset:**
    *   Click "Reset" (🔄 icon) to set the current exercise's count back to 0.

---

## 🖼️ Screenshot

*(Current screenshot is `readme-example-image.png`. Consider updating with a newer one showcasing more features if desired.)*

![Current App Screenshot](readme-example-image.png)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please ensure your code adheres to basic good practices and that the application remains functional.

---

## 🔐 Privacy

*   **No Data Transmission:** This app operates entirely within your browser. No personal data, exercise logs, or settings are sent to any external server.
*   **Local Storage:** All your data (exercises, progress, username, theme preferences) is stored locally in your browser's IndexedDB.
*   **Data Control:** You have full control over your data. You can export it, import it, or it will be deleted if you clear your browser's site data for this app.
*   **Hosting:** The app is hosted on Netlify. Netlify may collect standard web server logs (like IP addresses and access times) for operational and analytics purposes, but this does not include your specific fitness data entered into the app.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 🙏 Acknowledgements

*   Bootstrap
*   Dexie.js
*   Hammer.js
*   html2canvas
*   QRCode.js
*   Contributors & Users!

---

## 📧 Contact

Your Name / Alias - slingJin30
Project Link: [https://github.com/slingJin30/pushupcounter](https://github.com/slingJin30/pushupcounter)

Got questions or feedback? Feel free to open an issue on GitHub!
