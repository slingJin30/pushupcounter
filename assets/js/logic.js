(function () {
    // --- Constants ---
    const MAX_COUNT = 999999;
    const MAX_GOAL = 999999;
    const DEFAULT_EXERCISE_NAME = "Push Ups";

    // --- State Variables ---
    let exercises = [];
    let currentExerciseIndex = 0;
    let username = '';
    let theme = 'light';
    let currentAccentColor = 'indigo'; // Default accent color

    const motivationalMessages = [
        "Keep going! You're crushing it!",
        "Push through the burn!",
                "Every rep counts.",
                "Eyes on the prize!",
                "You're unstoppable.",
                "Almost there, keep pushing!",
                "Feel the power!",
                "You got this! Stay strong!",
                "You are Strong!",
                "Your future is bright!",
                "Do Push-ups today!",
                "Consistency is key!",
                "You are Powerful!",
                "Believe in yourself!",
                "Every push-up counts!",
                "Your are a champion!",
                "Sweat now, shine later!",
                "Small steps, big results!",
                "Discipline beats motivation.",
                "Greatness is coming!"
            ];

            const completedCountEl = document.getElementById('completedCount');
            const progressBarEl = document.getElementById('progressBar');
            const motivationalMsgEl = document.getElementById('motivationalMsg');
            const exerciseDropdownBtn = document.getElementById('exerciseDropdownBtn');
            const exerciseListUl = document.getElementById('exerciseList');
            const addNewExerciseBtn = document.getElementById('addNewExerciseBtn');
            const addOneBtn = document.getElementById('addOneBtn');
            const addFiveBtn = document.getElementById('addFiveBtn');
            const addTenBtn = document.getElementById('addTenBtn');
            const addFiftyBtn = document.getElementById('addFiftyBtn');
            const subtractOneBtn = document.getElementById('subtractOneBtn');
            const subtractTenBtn = document.getElementById('subtractTenBtn');
            const resetBtn = document.getElementById('resetBtn');
            const setGoalBtn = document.getElementById('setGoalBtn');
            const goalModal = new bootstrap.Modal(document.getElementById('goalModal'));
            const goalInput = document.getElementById('goalInput');
            const saveGoalBtn = document.getElementById('saveGoalBtn');
            const themeSwitcher = document.getElementById('themeSwitcher');
            const shareBtn = document.getElementById('shareBtn');
            const pushupSound = document.getElementById('pushupSound');
            const screenshotBtn = document.getElementById('screenshotBtn');
            const usernameForm = document.getElementById('usernameForm');
            const usernameInput = document.getElementById('usernameInput');
            const displayUsername = document.getElementById('displayUsername');
            const ytMusicBtn = document.getElementById('ytMusicBtn');
            const accentColorSelector = document.getElementById('accentColorSelector');

            // --- Accent Color Definitions ---
            const accentColors = {
                indigo: { main: '#6366f1', light: '#a5b4fc' },
                green: { main: '#10b981', light: '#6ee7b7' },
                orange: { main: '#f97316', light: '#fdba74' },
                purple: { main: '#8b5cf6', light: '#c4b5fd' }
            };

            // --- Utility Functions ---
            // --- Local Storage Abstraction ---
            const storage = {
                prefix: 'pushupcounter_',
                setItem: function(key, value) {
                    try {
                        localStorage.setItem(this.prefix + key, JSON.stringify(value));
                    } catch (e) {
                        console.error("Error saving to localStorage:", key, e);
                        // alert("Could not save settings. Your browser's local storage might be full or disabled.");
                    }
                },
                getItem: function(key, fallback) {
                    try {
                        const val = localStorage.getItem(this.prefix + key);
                        return val === null ? fallback : JSON.parse(val);
                    } catch (e) {
                        console.error("Error reading from localStorage:", key, e);
                        return fallback;
                    }
                }
            };

            // --- Utility Functions ---
            function haptic() {
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(30);
                }
            }

            function randomMotivation() {
                return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
            }

            function playSound() {
                try {
                    pushupSound.currentTime = 0;
                    pushupSound.play().catch(e => console.warn("Audio play failed:", e)); // Catch promise rejection
                } catch (e) {
                    console.warn("Audio play error:", e);
                }
            }

            // --- Theme Handling ---
            function applyTheme(newTheme) {
                const html = document.documentElement;
                html.setAttribute('data-bs-theme', newTheme);
                if (newTheme === 'dark') {
                    themeSwitcher.textContent = '☀️'; // Sun icon for dark mode (to switch to light)
                    // Body background is now primarily controlled by CSS using [data-bs-theme="dark"]
                } else {
                    themeSwitcher.textContent = '🌙'; // Moon icon for light mode (to switch to dark)
                    // Body background is now primarily controlled by CSS using [data-bs-theme="light"] or default
                }
                // Update the global theme variable
                theme = newTheme;
                storage.setItem('theme', theme);
            }

            function applyAccentColor(accentName) {
                if (!accentColors[accentName]) {
                    console.warn(`Accent colour ${accentName} not found. Defaulting to indigo.`);
                    accentName = 'indigo';
                }
                const { main, light } = accentColors[accentName];
                document.documentElement.style.setProperty('--accent-color', main);
                document.documentElement.style.setProperty('--accent-color-light', light);

                // Update body class for potential specific overrides if needed elsewhere
                // Remove old accent classes
                for (const color in accentColors) {
                    document.body.classList.remove(`accent-${color}`);
                }
                // Add new accent class
                document.body.classList.add(`accent-${accentName}`);

                currentAccentColor = accentName;
                storage.setItem('accentColor', currentAccentColor);
            }

            // --- Exercise Data Management ---
            function createNewExercise(name) {
                return {
                    name: name,
                    count: 0,
                    goal: 2500 // Default goal for a new exercise
                };
            }

            function saveExercises() {
                storage.setItem('exercises', exercises);
                storage.setItem('currentExerciseIndex', currentExerciseIndex);
            }

            function loadExercises() {
                exercises = storage.getItem('exercises', []);
                currentExerciseIndex = storage.getItem('currentExerciseIndex', 0);

                if (exercises.length === 0) {
                    exercises.push(createNewExercise(DEFAULT_EXERCISE_NAME));
                    currentExerciseIndex = 0;
                }
                // Ensure currentExerciseIndex is valid
                if (currentExerciseIndex >= exercises.length || currentExerciseIndex < 0) {
                    currentExerciseIndex = 0;
                }
            }

            // --- UI Update Functions ---
            function updateExerciseDropdown() {
                exerciseListUl.innerHTML = ''; // Clear existing items
                exercises.forEach((ex, index) => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.classList.add('dropdown-item');
                    a.href = '#';
                    a.textContent = ex.name;
                    if (index === currentExerciseIndex) {
                        a.classList.add('active');
                        exerciseDropdownBtn.textContent = ex.name; // Update dropdown button text
                    }
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        switchExercise(index);
                    });
                    li.appendChild(a);
                    exerciseListUl.appendChild(li);
                });
                // Add separator and "Add New" button
                const divider = document.createElement('li');
                divider.innerHTML = '<hr class="dropdown-divider">';
                exerciseListUl.appendChild(divider);
                const addNewLi = document.createElement('li');
                addNewLi.innerHTML = `<a class="dropdown-item" href="#" id="addNewExerciseBtnListener"><i class="bi bi-plus-circle-fill me-2"></i>Add New Exercise</a>`;
                exerciseListUl.appendChild(addNewLi);
                // Re-attach event listener for the new "Add New Exercise" button
                const addNewBtnListener = document.getElementById('addNewExerciseBtnListener');
                if (addNewBtnListener) {
                    addNewBtnListener.addEventListener('click', handleAddNewExercise);
                }

                // Add "Rename Current Exercise" and "Delete Current Exercise"
                if (exercises.length > 0) { // Only show if there are exercises
                    const renameLi = document.createElement('li');
                    renameLi.innerHTML = `<a class="dropdown-item" href="#" id="renameCurrentExerciseBtn"><i class="bi bi-pencil-fill me-2"></i>Rename Current</a>`;
                    exerciseListUl.appendChild(renameLi);
                    document.getElementById('renameCurrentExerciseBtn').addEventListener('click', handleRenameCurrentExercise);

                    const deleteLi = document.createElement('li');
                    deleteLi.innerHTML = `<a class="dropdown-item text-danger" href="#" id="deleteCurrentExerciseBtn"><i class="bi bi-trash-fill me-2"></i>Delete Current</a>`;
                    exerciseListUl.appendChild(deleteLi);
                    document.getElementById('deleteCurrentExerciseBtn').addEventListener('click', handleDeleteCurrentExercise);
                }
            }


            function updateDisplay() {
                if (!exercises[currentExerciseIndex]) return; // Should not happen if initialized correctly

                const currentEx = exercises[currentExerciseIndex];
                completedCountEl.textContent = currentEx.count;
                const percent = Math.min(100, (currentEx.count / currentEx.goal) * 100);
                progressBarEl.style.width = percent + '%';
                progressBarEl.textContent = `${currentEx.count} / ${currentEx.goal}`;

                completedCountEl.classList.remove('pop');
                void completedCountEl.offsetWidth; // Trigger reflow
                completedCountEl.classList.add('pop');

                const newMessage = currentEx.count >= currentEx.goal
                    ? "Goal reached! 🎉 Set a new one!"
                    : randomMotivation();

                // Only update and animate if the message is different or it's the initial load
                if (motivationalMsgEl.textContent !== newMessage || !motivationalMsgEl.classList.contains('animate-new-message')) {
                    motivationalMsgEl.textContent = newMessage;
                    motivationalMsgEl.classList.remove('animate-new-message');
                    void motivationalMsgEl.offsetWidth; // Trigger reflow
                    motivationalMsgEl.classList.add('animate-new-message');
                }

                // Update button states (e.g., disable add if at max_count for THIS exercise)
                 const addBtns = [addOneBtn, addFiveBtn, addTenBtn, addFiftyBtn];
                 addBtns.forEach(btn => {
                    btn.disabled = currentEx.count >= MAX_COUNT;
                 });
                saveExercises(); // Save state whenever display updates
            }

            function switchExercise(index) {
                if (index >= 0 && index < exercises.length) {
                    currentExerciseIndex = index;
                    updateExerciseDropdown(); // Update active state in dropdown
                    updateDisplay(); // Refresh main display for the new exercise
                    // Update goal modal input if it's open or when it's next opened
                    goalInput.value = exercises[currentExerciseIndex].goal;
                }
            }


            // --- Initialization Function ---
            function initializeApp() {
                // Load data
                username = storage.getItem('username', '');
                theme = storage.getItem('theme', 'light');
                currentAccentColor = storage.getItem('accentColor', 'indigo');
                loadExercises();

                // Apply theme and accent
                applyTheme(theme);
                applyAccentColor(currentAccentColor);

                // Populate Accent Color Selector
                for (const colorName in accentColors) {
                    const btn = document.createElement('button');
                    btn.classList.add('btn', 'btn-sm', 'accent-picker-btn');
                    btn.style.backgroundColor = accentColors[colorName].main;
                    btn.dataset.accent = colorName;
                    btn.title = `Switch to ${colorName.charAt(0).toUpperCase() + colorName.slice(1)} accent`;
                    if (colorName === currentAccentColor) {
                        btn.classList.add('active');
                    }
                    btn.addEventListener('click', () => {
                        applyAccentColor(colorName);
                        // Update active class on buttons
                        accentColorSelector.querySelectorAll('.accent-picker-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                    });
                    accentColorSelector.appendChild(btn);
                }


                // Initialize UI components
                if (username) {
                    displayUsername.textContent = 'Welcome, ' + username;
                    usernameInput.value = username;
                } else {
                    displayUsername.textContent = '';
                }
                updateExerciseDropdown();
                updateDisplay(); // This also calls saveExercises, which is fine.
                goalInput.value = exercises[currentExerciseIndex].goal;

                // Setup tooltips
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.forEach(function (tooltipTriggerEl) {
                    new bootstrap.Tooltip(tooltipTriggerEl);
                });

                // Generate Bitcoin QR Code
                const btcAddressEl = document.getElementById('bitcoinAddress');
                const btcQrCodeEl = document.getElementById('bitcoinQrCode');
                const copyBitcoinAddressBtn = document.getElementById('copyBitcoinAddressBtn');

                if (btcAddressEl && btcQrCodeEl && typeof QRCode !== 'undefined') {
                    const btcAddress = btcAddressEl.textContent.trim();
                    if (btcAddress) {
                        new QRCode(btcQrCodeEl, {
                            text: btcAddress,
                            width: 128,
                            height: 128,
                            colorDark : "#000000",
                            colorLight : "#ffffff",
                            correctLevel : QRCode.CorrectLevel.H
                        });

                        if (copyBitcoinAddressBtn) {
                            copyBitcoinAddressBtn.addEventListener('click', async () => {
                                try {
                                    await navigator.clipboard.writeText(btcAddress);
                                    const originalText = copyBitcoinAddressBtn.innerHTML;
                                    copyBitcoinAddressBtn.innerHTML = `Copied! <i class="bi bi-check-lg"></i>`;
                                    copyBitcoinAddressBtn.disabled = true;

                                    setTimeout(() => {
                                        copyBitcoinAddressBtn.innerHTML = originalText;
                                        copyBitcoinAddressBtn.disabled = false;
                                    }, 2500);
                                } catch (err) {
                                    console.error('Failed to copy Bitcoin address: ', err);
                                    // Optionally, provide feedback to the user that copy failed
                                    const originalText = copyBitcoinAddressBtn.innerHTML;
                                    copyBitcoinAddressBtn.innerHTML = `Copy Failed`;
                                     setTimeout(() => {
                                        copyBitcoinAddressBtn.innerHTML = originalText;
                                    }, 2500);
                                }
                            });
                        }
                    }
                } else {
                    console.warn("Bitcoin QR Code elements not found or QRCode library not loaded.");
                }
            }


            // --- Debounce Helper ---
            function debounceBtn(btn, fn, delay) {
                let locked = false;
                btn.addEventListener('click', function () {
                    if (locked) return;
                    locked = true;
                    fn();
                    setTimeout(function () { locked = false; }, delay || 120);
                });
            }

            // --- Event Handlers ---
            function handleAddNewExercise(e) {
                if (e) e.preventDefault();
                const newExerciseName = prompt("Enter the name for the new exercise:", `Exercise ${exercises.length + 1}`);
                if (newExerciseName === null) return; // User cancelled

                const trimmedName = newExerciseName.trim();
                if (trimmedName === "") {
                    alert("Exercise name cannot be empty.");
                    return;
                }
                if (exercises.some(ex => ex.name.toLowerCase() === trimmedName.toLowerCase())) {
                    alert("An exercise with this name already exists. Please choose a different name.");
                    return;
                }
                exercises.push(createNewExercise(trimmedName));
                switchExercise(exercises.length - 1);
                saveExercises();
                updateExerciseDropdown(); // This also calls updateDisplay indirectly via switchExercise if index changes
                // updateDisplay(); // Not strictly needed here if switchExercise caused a display update
            }

            function handleRenameCurrentExercise(e) {
                if (e) e.preventDefault();
                if (!exercises[currentExerciseIndex]) return;

                const currentName = exercises[currentExerciseIndex].name;
                const newNamePrompt = prompt(`Enter new name for "${currentName}":`, currentName);

                if (newNamePrompt === null) return; // User cancelled

                const trimmedNewName = newNamePrompt.trim();
                if (trimmedNewName === "") {
                    alert("Exercise name cannot be empty.");
                    return;
                }
                // Check if new name is different and if it already exists (excluding the current one)
                if (trimmedNewName.toLowerCase() !== currentName.toLowerCase() &&
                    exercises.some((ex, index) => index !== currentExerciseIndex && ex.name.toLowerCase() === trimmedNewName.toLowerCase())) {
                    alert("An exercise with this name already exists. Please choose a different name.");
                    return;
                }

                exercises[currentExerciseIndex].name = trimmedNewName;
                saveExercises();
                updateExerciseDropdown(); // Will update dropdown button text and list
                // updateDisplay(); // Not strictly needed as dropdown update should cover visual change of name
            }

            function handleDeleteCurrentExercise(e) {
                if (e) e.preventDefault();
                if (!exercises[currentExerciseIndex]) return;

                const exerciseNameToDelete = exercises[currentExerciseIndex].name;
                if (!confirm(`Are you sure you want to delete "${exerciseNameToDelete}"? This action cannot be undone.`)) {
                    return; // User cancelled
                }

                if (exercises.length === 1) {
                    // Last exercise: reset to default instead of deleting
                    exercises[0] = createNewExercise(DEFAULT_EXERCISE_NAME); // Reset to default
                    currentExerciseIndex = 0; // Ensure index is 0
                    alert(`"${exerciseNameToDelete}" was the last exercise and has been reset to "${DEFAULT_EXERCISE_NAME}".`);
                } else {
                    exercises.splice(currentExerciseIndex, 1); // Remove the exercise
                    // Adjust currentExerciseIndex if it's now out of bounds
                    if (currentExerciseIndex >= exercises.length) {
                        currentExerciseIndex = exercises.length - 1;
                    }
                     // No alert needed here, UI will just update
                }

                saveExercises();
                // switchExercise will call updateExerciseDropdown and updateDisplay
                switchExercise(currentExerciseIndex);
            }


            function addCountToCurrentExercise(amount) {
                if (!exercises[currentExerciseIndex]) return;
                let currentEx = exercises[currentExerciseIndex];

                currentEx.count += amount;
                if (currentEx.count < 0) currentEx.count = 0;
                if (currentEx.count > MAX_COUNT) currentEx.count = MAX_COUNT;

                playSound();
                haptic();
                updateDisplay(); // This will also call saveExercises
            }

            // --- Button Actions Setup ---
            debounceBtn(addOneBtn, () => addCountToCurrentExercise(1));
            debounceBtn(addFiveBtn, () => addCountToCurrentExercise(5));
            debounceBtn(addTenBtn, () => addCountToCurrentExercise(10));
            debounceBtn(addFiftyBtn, () => addCountToCurrentExercise(50));
            debounceBtn(subtractOneBtn, () => addCountToCurrentExercise(-1));
            debounceBtn(subtractTenBtn, () => addCountToCurrentExercise(-10));

            resetBtn.addEventListener('click', function () {
                if (!exercises[currentExerciseIndex]) return;
                if (confirm(`Are you sure you want to reset the count for "${exercises[currentExerciseIndex].name}"?`)) {
                    exercises[currentExerciseIndex].count = 0;
                    haptic();
                    updateDisplay();
                }
            });

            setGoalBtn.addEventListener('click', function () {
                if (!exercises[currentExerciseIndex]) return;
                goalInput.value = exercises[currentExerciseIndex].goal; // Set current exercise's goal
                goalModal.show();
            });

            saveGoalBtn.addEventListener('click', function () {
                if (!exercises[currentExerciseIndex]) return;
                const rawValue = goalInput.value.trim();
                if (rawValue === "") {
                    alert("Goal input cannot be empty. Please enter a number.");
                    return;
                }
                const val = parseInt(rawValue, 10);

                if (isNaN(val)) {
                    alert("Invalid input. Please enter a valid number for the goal.");
                    return;
                }
                if (val <= 0) {
                    alert("Goal must be a positive number.");
                    return;
                }
                if (val > MAX_GOAL) {
                    alert(`Goal cannot be greater than ${MAX_GOAL}. Please set a lower goal.`);
                    return;
                }

                exercises[currentExerciseIndex].goal = val;
                haptic();
                updateDisplay();
                goalModal.hide();
            });

            // Theme Switcher
            themeSwitcher.addEventListener('click', function () {
                const newTheme = theme === 'light' ? 'dark' : 'light';
                applyTheme(newTheme); // applyTheme will also save it
            });

            // Share Button
            shareBtn.addEventListener('click', async function () {
                const shareData = {
                    title: 'Push Up Counter',
                    text: 'Push Up Counter - Track your push-ups, set goals, save progress, and share your achievements!',
                    url: window.location.href
                };
                try {
                    if (navigator.share) {
                        await navigator.share(shareData);
                    } else {
                        await navigator.clipboard.writeText(window.location.href);
                        shareBtn.textContent = 'Link Copied!';
                        setTimeout(function () { shareBtn.textContent = 'Share Site'; }, 2000);
                    }
                } catch (e) {}
            });

            // --- Screenshot Button ---
            screenshotBtn.addEventListener('click', function () {
                screenshotBtn.disabled = true;
                screenshotBtn.textContent = "Capturing...";
                const target = document.getElementById('screenshotArea');
                // Dynamically set background for html2canvas based on current theme
                const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
                const screenshotBgColor = currentTheme === 'dark' ?
                    getComputedStyle(document.documentElement).getPropertyValue('--dark-card-bg').trim() || '#1e293b' : // Fallback to a dark colour
                    getComputedStyle(document.documentElement).getPropertyValue('--light-card-bg').trim() || '#ffffff'; // Fallback to white

                html2canvas(target, {
                    backgroundColor: screenshotBgColor,
                    useCORS: true,
                    scale: 2
                }).then(function (canvas) {
                    // Generate a unique filename using timestamp and random string
                    const uniqueName = `pushup-progress-${Date.now()}-${Math.random().toString(36).substr(2, 6)}.png`;
                    const link = document.createElement('a');
                    link.download = uniqueName;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    screenshotBtn.textContent = "📸 Save Progress as Image";
                    screenshotBtn.disabled = false;
                }).catch(function () {
                    alert('Screenshot failed. Try again.');
                    screenshotBtn.textContent = "📸 Save Progress as Image";
                    screenshotBtn.disabled = false;
                });
            });

            // Username Personalization
            usernameForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const newUsername = usernameInput.value.trim();
                if (newUsername.length === 0) {
                    alert("Username cannot be empty.");
                    return;
                }
                if (newUsername.length > 20) {
                    alert("Username cannot be longer than 20 characters.");
                    return;
                }
                if (!/^[a-zA-Z0-9\s]*$/.test(newUsername)) {
                    alert("Username can only contain letters, numbers, and spaces.");
                    return;
                }
                username = newUsername;
                storage.setItem('username', username);
                displayUsername.textContent = 'Welcome, ' + username;
            });

            // YouTube Music Button
            if (ytMusicBtn) {
                ytMusicBtn.addEventListener('click', function () {
                    const query = encodeURIComponent('workout music'); // Default query
                    const currentExerciseName = exercises[currentExerciseIndex] ? exercises[currentExerciseIndex].name : 'workout';
                    const dynamicQuery = encodeURIComponent(`${currentExerciseName} workout music`);
                    window.open(`https://www.youtube.com/results?search_query=${dynamicQuery}`, '_blank');
                });
            }

            // --- Accessibility ---
            motivationalMsgEl.setAttribute('aria-live', 'polite');
            completedCountEl.setAttribute('role', 'status');

            // --- App Initialization ---
            // DOMContentLoaded to ensure all elements are available, then initialize.
            document.addEventListener('DOMContentLoaded', initializeApp);

        })();