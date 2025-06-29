(function () {
    // --- Dexie DB Definition ---
    const db = new Dexie('PushUpCounterDB');
    db.version(1).stores({
        exercises: '++id, &name, count, goal', // Auto-incrementing id, unique name
        userSettings: '&key, value' // Primary key 'key' (e.g., 'username', 'theme')
    });

    // --- Constants ---
    const MAX_COUNT = 999999;
    const MAX_GOAL = 999999;
    const DEFAULT_EXERCISE_NAME = "Push Ups";

    // --- State Variables ---
    let exercises = []; // This will now be populated from IndexedDB
    let currentExerciseIndex = 0; // Index relative to the runtime 'exercises' array
    let username = ''; // Populated from IndexedDB
    let theme = 'light'; // Populated from IndexedDB
    let currentAccentColor = 'indigo'; // Populated from IndexedDB
    let currentExerciseName = DEFAULT_EXERCISE_NAME; // Name of the currently active exercise, stored in DB

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
                indigo: { main: '#6366f1', light: '#a5b4fc', rgb: '99, 102, 241', darker: '#4f52b5', shadowDark: '#313278' },
                green:  { main: '#10b981', light: '#6ee7b7', rgb: '16, 185, 129', darker: '#0d9467', shadowDark: '#085c40' },
                orange: { main: '#f97316', light: '#fdba74', rgb: '249, 115, 22', darker: '#c75c12', shadowDark: '#7c3a0b' },
                purple: { main: '#8b5cf6', light: '#c4b5fd', rgb: '139, 92, 246', darker: '#6f49c5', shadowDark: '#452e7b' }
            };

            // --- Utility Functions ---
            // The 'storage' object (localStorage wrapper) is no longer needed for main app data.
            // Migration logic uses localStorage directly for its flag.

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
                db.userSettings.put({ key: 'theme', value: theme }).catch(err => console.error("Failed to save theme:", err));
            }

            function applyAccentColor(accentName) {
                if (!accentColors[accentName]) {
                    console.warn(`Accent colour ${accentName} not found. Defaulting to indigo.`);
                    accentName = 'indigo';
                }
                const selectedAccent = accentColors[accentName];
                document.documentElement.style.setProperty('--accent-color', selectedAccent.main);
                document.documentElement.style.setProperty('--accent-color-light', selectedAccent.light);
                document.documentElement.style.setProperty('--accent-color-rgb', selectedAccent.rgb);
                document.documentElement.style.setProperty('--accent-color-darker', selectedAccent.darker);
                document.documentElement.style.setProperty('--accent-color-shadow-dark', selectedAccent.shadowDark);

                // Update body class for potential specific overrides if needed elsewhere
                // Remove old accent classes
                for (const color in accentColors) {
                    document.body.classList.remove(`accent-${color}`);
                }
                // Add new accent class
                document.body.classList.add(`accent-${accentName}`);

                currentAccentColor = accentName;
                // Use 'accentColour' as the key to be consistent with migration logic if that was the intent
                db.userSettings.put({ key: 'accentColour', value: currentAccentColor }).catch(err => console.error("Failed to save accent colour:", err));
            }

            // --- Exercise Data Management ---
            function createNewExercise(name) { // This function is still useful for creating the initial object structure
                return {
                    // id will be assigned by IndexedDB
                    name: name,
                    count: 0,
                    goal: 2500 // Default goal for a new exercise
                };
            }

            // loadExercises() is replaced by logic in initializeApp()
            // saveExercises() is replaced by direct DB updates in relevant functions

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
                // saveExercises(); // Removed: Data is saved directly on modification
            }

            async function switchExercise(index) {
                if (index >= 0 && index < exercises.length) {
                    currentExerciseIndex = index;
                    currentExerciseName = exercises[currentExerciseIndex].name; // Update global state variable

                    try {
                        await db.userSettings.put({ key: 'currentExerciseName', value: currentExerciseName });
                    } catch (error) {
                        console.error("Failed to save current exercise name to DB:", error);
                        // Non-critical for immediate UI, but log it.
                    }

                    updateExerciseDropdown(); // Update active state in dropdown
                    updateDisplay(); // Refresh main display for the new exercise
                    // Update goal modal input if it's open or when it's next opened
                    if (exercises[currentExerciseIndex]) { // Ensure exercise exists
                        goalInput.value = exercises[currentExerciseIndex].goal;
                    }
                }
            }


            // --- Initialization Function ---
            async function initializeApp() {
                await migrateFromLocalStorage();

                // Load data from IndexedDB
                const dbExercises = await db.exercises.toArray();
                const dbUsername = await db.userSettings.get('username');
                const dbTheme = await db.userSettings.get('theme');
                const dbAccentColour = await db.userSettings.get('accentColour'); // Ensure key matches what's saved in migration
                const dbCurrentExerciseName = await db.userSettings.get('currentExerciseName');

                exercises = dbExercises;
                username = dbUsername ? dbUsername.value : '';
                theme = dbTheme ? dbTheme.value : 'light';
                currentAccentColor = dbAccentColour ? dbAccentColour.value : 'indigo';
                currentExerciseName = dbCurrentExerciseName ? dbCurrentExerciseName.value : DEFAULT_EXERCISE_NAME;

                if (exercises.length === 0) {
                    const defaultEx = createNewExercise(DEFAULT_EXERCISE_NAME);
                    // Add to DB and then update local 'exercises' array
                    const id = await db.exercises.put({ name: defaultEx.name, count: defaultEx.count, goal: defaultEx.goal });
                    defaultEx.id = id; // Assign the auto-generated id
                    exercises.push(defaultEx);
                    currentExerciseName = defaultEx.name; // Ensure currentExerciseName is set
                    await db.userSettings.put({ key: 'currentExerciseName', value: currentExerciseName });
                }

                // Determine currentExerciseIndex based on currentExerciseName
                currentExerciseIndex = exercises.findIndex(ex => ex.name === currentExerciseName);
                if (currentExerciseIndex === -1) { // Fallback if name not found
                    currentExerciseIndex = 0;
                    if (exercises.length > 0) {
                        currentExerciseName = exercises[0].name;
                        // Optionally update currentExerciseName in DB if it was mismatched
                        await db.userSettings.put({ key: 'currentExerciseName', value: currentExerciseName });
                    } else {
                        // This case should ideally not be reached if the empty exercises block above works.
                        currentExerciseName = DEFAULT_EXERCISE_NAME;
                    }
                }

                // Apply theme and accent
                applyTheme(theme); // applyTheme will also call storage.setItem('theme', theme); - this needs to change
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
            async function handleAddNewExercise(e) {
                if (e) e.preventDefault();
                const newExerciseName = prompt("Enter the name for the new exercise:", `Exercise ${exercises.length + 1}`);
                if (newExerciseName === null) return; // User cancelled

                const trimmedName = newExerciseName.trim();
                if (trimmedName === "") {
                    alert("Exercise name cannot be empty.");
                    return;
                }
                // Check against local 'exercises' array first for immediate feedback,
                // though DB's unique constraint on 'name' is the ultimate guard.
                if (exercises.some(ex => ex.name.toLowerCase() === trimmedName.toLowerCase())) {
                    alert("An exercise with this name already exists. Please choose a different name.");
                    return;
                }

                const newExercise = createNewExercise(trimmedName);
                try {
                    // Add to DB. The 'name' field has a unique index.
                    // Dexie's `put` would also work and would update if name existed, but `add` is stricter for new items.
                    // However, since schema has `++id`, `put` is fine for adding as it will auto-gen ID.
                    // If name constraint is violated, this will throw an error.
                    const id = await db.exercises.put({ name: newExercise.name, count: newExercise.count, goal: newExercise.goal });
                    newExercise.id = id; // Assign the auto-generated ID to the local object
                    exercises.push(newExercise); // Add to local array
                    switchExercise(exercises.length - 1); // Switch to the new exercise
                    // updateExerciseDropdown(); // Called by switchExercise
                } catch (error) {
                    console.error("Failed to add new exercise to DB:", error);
                    if (error.name === 'ConstraintError') {
                        alert("An exercise with this name already exists in the database. Please choose a different name.");
                    } else {
                        alert("Failed to save new exercise. Please try again.");
                    }
                    return; // Don't proceed if save failed
                }
                // No explicit saveExercises() needed. updateExerciseDropdown() is called by switchExercise().
            }

            async function handleRenameCurrentExercise(e) {
                if (e) e.preventDefault();
                if (!exercises[currentExerciseIndex]) return;

                const exerciseToRename = exercises[currentExerciseIndex];
                const oldName = exerciseToRename.name;
                const newNamePrompt = prompt(`Enter new name for "${oldName}":`, oldName);

                if (newNamePrompt === null) return; // User cancelled

                const trimmedNewName = newNamePrompt.trim();
                if (trimmedNewName === "") {
                    alert("Exercise name cannot be empty.");
                    return;
                }
                if (trimmedNewName.toLowerCase() === oldName.toLowerCase()) {
                    return; // No change
                }

                // Check if new name already exists in other exercises (local check for quick feedback)
                if (exercises.some((ex, index) => index !== currentExerciseIndex && ex.name.toLowerCase() === trimmedNewName.toLowerCase())) {
                    alert("An exercise with this name already exists. Please choose a different name.");
                    return;
                }

                try {
                    // Update in DB. The unique constraint on 'name' will be checked by Dexie.
                    await db.exercises.update(exerciseToRename.id, { name: trimmedNewName });
                    exerciseToRename.name = trimmedNewName; // Update local array

                    // If this was the globally current exercise, update its name in userSettings
                    if (currentExerciseName === oldName) {
                        currentExerciseName = trimmedNewName;
                        await db.userSettings.put({ key: 'currentExerciseName', value: currentExerciseName });
                    }
                    updateExerciseDropdown(); // Redraw dropdown
                } catch (error) {
                    console.error("Failed to rename exercise in DB:", error);
                     if (error.name === 'ConstraintError') {
                        alert("An exercise with this name already exists in the database. Please choose a different name.");
                    } else {
                        alert("Failed to rename exercise. Please try again.");
                    }
                }
            }

            async function handleDeleteCurrentExercise(e) {
                if (e) e.preventDefault();
                if (!exercises[currentExerciseIndex]) return;

                const exerciseToDelete = exercises[currentExerciseIndex];
                const exerciseNameToDelete = exerciseToDelete.name;

                if (!confirm(`Are you sure you want to delete "${exerciseNameToDelete}"? This action cannot be undone.`)) {
                    return; // User cancelled
                }

                try {
                    if (exercises.length === 1) {
                        // Last exercise: reset to default instead of deleting it entirely from DB, then update it.
                        const defaultExerciseData = createNewExercise(DEFAULT_EXERCISE_NAME);
                        await db.exercises.update(exerciseToDelete.id, defaultExerciseData); // Update existing record to default
                        exercises[0] = { ...defaultExerciseData, id: exerciseToDelete.id }; // Update local array

                        currentExerciseIndex = 0;
                        currentExerciseName = exercises[0].name;
                        await db.userSettings.put({ key: 'currentExerciseName', value: currentExerciseName });
                        alert(`"${exerciseNameToDelete}" was the last exercise and has been reset to "${DEFAULT_EXERCISE_NAME}".`);
                    } else {
                        await db.exercises.delete(exerciseToDelete.id); // Delete from DB
                        exercises.splice(currentExerciseIndex, 1); // Remove from local array

                        // Adjust currentExerciseIndex if it's now out of bounds
                        if (currentExerciseIndex >= exercises.length) {
                            currentExerciseIndex = exercises.length - 1;
                        }
                        currentExerciseName = exercises[currentExerciseIndex].name; // Update currentExerciseName based on new index
                        await db.userSettings.put({ key: 'currentExerciseName', value: currentExerciseName });
                    }

                    switchExercise(currentExerciseIndex); // This will call updateExerciseDropdown and updateDisplay
                } catch (error) {
                    console.error("Failed to delete/reset exercise in DB:", error);
                    alert("Failed to delete exercise. Please try again.");
                }
            }


            async function addCountToCurrentExercise(amount) {
                if (!exercises[currentExerciseIndex]) return;
                let currentEx = exercises[currentExerciseIndex];

                currentEx.count += amount;
                if (currentEx.count < 0) currentEx.count = 0;
                if (currentEx.count > MAX_COUNT) currentEx.count = MAX_COUNT;

                try {
                    await db.exercises.put(currentEx); // Save the updated exercise object (Dexie's put handles add or update)
                } catch (error) {
                    console.error("Failed to save exercise count update to DB:", error);
                    // Optionally, alert the user or handle the error
                }

                playSound();
                haptic();
                updateDisplay();
            }

            // --- Button Actions Setup ---
            debounceBtn(addOneBtn, () => addCountToCurrentExercise(1));
            debounceBtn(addFiveBtn, () => addCountToCurrentExercise(5));
            debounceBtn(addTenBtn, () => addCountToCurrentExercise(10));
            debounceBtn(addFiftyBtn, () => addCountToCurrentExercise(50));
            debounceBtn(subtractOneBtn, () => addCountToCurrentExercise(-1));
            debounceBtn(subtractTenBtn, () => addCountToCurrentExercise(-10));

            // --- Hammer.js Swipe Gestures ---
            if (typeof Hammer !== 'undefined') {
                const hammer = new Hammer(completedCountEl);
                hammer.on('swipeleft', function () {
                    addCountToCurrentExercise(1);
                });
                hammer.on('swiperight', function () {
                    addCountToCurrentExercise(-1);
                });
            } else {
                console.warn('Hammer.js not loaded, swipe gestures disabled.');
            }

            resetBtn.addEventListener('click', async function () {
                if (!exercises[currentExerciseIndex]) return;
                const currentEx = exercises[currentExerciseIndex];
                if (confirm(`Are you sure you want to reset the count for "${currentEx.name}"?`)) {
                    currentEx.count = 0;
                    try {
                        await db.exercises.put(currentEx); // Save updated exercise
                        haptic();
                        updateDisplay();
                    } catch (error) {
                        console.error("Failed to reset count in DB:", error);
                        alert("Failed to reset count. Please try again.");
                    }
                }
            });

            setGoalBtn.addEventListener('click', function () {
                if (!exercises[currentExerciseIndex]) return;
                goalInput.value = exercises[currentExerciseIndex].goal; // Set current exercise's goal
                goalModal.show();
            });

            saveGoalBtn.addEventListener('click', async function () {
                if (!exercises[currentExerciseIndex]) return;
                const currentEx = exercises[currentExerciseIndex];
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

                currentEx.goal = val;
                try {
                    await db.exercises.put(currentEx); // Save updated exercise
                    haptic();
                    updateDisplay();
                    goalModal.hide();
                } catch (error) {
                    console.error("Failed to save goal in DB:", error);
                    alert("Failed to save goal. Please try again.");
                }
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
                db.userSettings.put({ key: 'username', value: username })
                    .then(() => {
                        displayUsername.textContent = 'Welcome, ' + username;
                    })
                    .catch(err => {
                        console.error("Failed to save username:", err);
                        alert("Failed to save username. Please try again.");
                        // Optionally revert UI or username variable if critical
                    });
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

            // --- Data Migration from localStorage to IndexedDB ---
            async function migrateFromLocalStorage() {
                const migrationDone = localStorage.getItem('pushupcounter_migrationDone');
                if (migrationDone) {
                    // console.log("Migration already performed.");
                    return;
                }

                console.log("Starting migration from localStorage to IndexedDB...");
                try {
                    const oldStoragePrefix = 'pushupcounter_';
                    const lsExercises = JSON.parse(localStorage.getItem(oldStoragePrefix + 'exercises'));
                    const lsCurrentExerciseIndex = JSON.parse(localStorage.getItem(oldStoragePrefix + 'currentExerciseIndex'));
                    const lsUsername = JSON.parse(localStorage.getItem(oldStoragePrefix + 'username'));
                    const lsTheme = JSON.parse(localStorage.getItem(oldStoragePrefix + 'theme'));
                    const lsAccentColor = JSON.parse(localStorage.getItem(oldStoragePrefix + 'accentColor'));

                    await db.transaction('rw', db.exercises, db.userSettings, async () => {
                        if (lsExercises && Array.isArray(lsExercises)) {
                            // Upsert exercises by name. If name isn't unique, this might need adjustment
                            // or rely on the schema's unique constraint on 'name'.
                            // Dexie's put will add or replace based on primary key. If 'name' is unique index,
                            // we might need to query first or handle potential constraint errors if not using 'id'.
                            // For simplicity, we assume new items or items that can be identified by name if 'id' is not present.
                            // The schema is '++id, &name,...', so 'name' is unique.
                            // We'll try to put them, and if an exercise with the same name exists, it gets updated.
                            // If `id` was part of lsExercises, Dexie would use it. Since it's not, it will auto-increment.
                            const exercisesToPut = lsExercises.map(ex => ({
                                name: ex.name,
                                count: ex.count,
                                goal: ex.goal
                            }));
                            await db.exercises.bulkPut(exercisesToPut);
                            console.log("Migrated exercises:", exercisesToPut);
                        }

                        const settingsToPut = [];
                        if (lsUsername !== null) settingsToPut.push({ key: 'username', value: lsUsername });
                        if (lsTheme !== null) settingsToPut.push({ key: 'theme', value: lsTheme });
                        if (lsAccentColor !== null) settingsToPut.push({ key: 'accentColour', value: lsAccentColor }); // Note: 'accentColor' -> 'accentColour' if we standardise key name

                        let lsCurrentExerciseName = DEFAULT_EXERCISE_NAME;
                        if (lsExercises && lsExercises[lsCurrentExerciseIndex]) {
                            lsCurrentExerciseName = lsExercises[lsCurrentExerciseIndex].name;
                        }
                        settingsToPut.push({ key: 'currentExerciseName', value: lsCurrentExerciseName });

                        if (settingsToPut.length > 0) {
                            await db.userSettings.bulkPut(settingsToPut);
                            console.log("Migrated settings:", settingsToPut);
                        }
                    });

                    localStorage.setItem('pushupcounter_migrationDone', 'true');
                    console.log("Migration completed successfully.");

                    // Optional: Clear old localStorage items after successful migration
                    // localStorage.removeItem(oldStoragePrefix + 'exercises');
                    // localStorage.removeItem(oldStoragePrefix + 'currentExerciseIndex');
                    // localStorage.removeItem(oldStoragePrefix + 'username');
                    // localStorage.removeItem(oldStoragePrefix + 'theme');
                    // localStorage.removeItem(oldStoragePrefix + 'accentColor');
                    // console.log("Old localStorage items cleared.");

                } catch (error) {
                    console.error("Migration failed:", error);
                    // If migration fails, we might not want to set the flag, so it can be retried.
                    // Or, handle specific errors.
                }
            }

            // --- Import/Export Functionality ---
            const exportDataBtn = document.getElementById('exportDataBtn');
            const importDataBtn = document.getElementById('importDataBtn');
            const importFile = document.getElementById('importFile');

            if (exportDataBtn) {
                exportDataBtn.addEventListener('click', async () => {
                    try {
                        const allExercises = await db.exercises.toArray();
                        const allUserSettings = await db.userSettings.toArray();

                        // Remove Dexie's auto-generated 'id' from exercises if you want cleaner export
                        // or if you plan to rely solely on 'name' for uniqueness during import.
                        // However, keeping 'id' can be useful if you want to preserve exact records.
                        // For this implementation, we'll keep 'id' as it's part of the schema.

                        const dataToExport = {
                            databaseName: 'PushUpCounterDB',
                            version: db.verno, // Dexie's way to get current DB version
                            timestamp: new Date().toISOString(),
                            data: {
                                exercises: allExercises,
                                userSettings: allUserSettings
                            }
                        };

                        const jsonString = JSON.stringify(dataToExport, null, 2);
                        const blob = new Blob([jsonString], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                        a.href = url;
                        a.download = `pushup_data_${timestamp}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        alert('Data exported successfully!');
                    } catch (error) {
                        console.error('Export failed:', error);
                        alert('Data export failed. See console for details.');
                    }
                });
            }

            if (importDataBtn && importFile) {
                importDataBtn.addEventListener('click', () => {
                    importFile.click(); // Trigger hidden file input
                });

                importFile.addEventListener('change', async (event) => {
                    const file = event.target.files[0];
                    if (!file) {
                        return;
                    }

                    if (file.type !== 'application/json') {
                        alert('Invalid file type. Please select a .json file.');
                        event.target.value = null; // Reset file input
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        try {
                            const importedData = JSON.parse(e.target.result);

                            // --- Basic Validation ---
                            if (typeof importedData !== 'object' || importedData === null) {
                                throw new Error("Invalid JSON structure: root is not an object.");
                            }
                            if (importedData.databaseName !== 'PushUpCounterDB') {
                                alert(`Warning: Importing data from an unknown database (${importedData.databaseName || 'unknown'}). Proceed with caution.`);
                                // Could add a confirm dialog here if desired
                            }
                            if (importedData.version !== db.verno) {
                                 alert(`Warning: Database version mismatch. File version: ${importedData.version}, App DB version: ${db.verno}. Data might not be fully compatible.`);
                                // Could add a confirm dialog here
                            }
                            if (!importedData.data || typeof importedData.data !== 'object' || importedData.data === null) {
                                throw new Error("Invalid JSON structure: 'data' property missing or not an object.");
                            }
                            if (!Array.isArray(importedData.data.exercises)) {
                                throw new Error("Invalid JSON structure: 'data.exercises' is not an array.");
                            }
                            if (!Array.isArray(importedData.data.userSettings)) {
                                throw new Error("Invalid JSON structure: 'data.userSettings' is not an array.");
                            }
                            // Further validation could check individual exercise/setting objects

                            // --- Import Data ---
                            await db.transaction('rw', db.exercises, db.userSettings, async () => {
                                await db.exercises.clear();
                                await db.userSettings.clear();
                                // When bulkPutting exercises, Dexie will auto-generate new 'id's if they are not present
                                // or if they conflict with the '++id' schema if you try to force them.
                                // If IDs from the JSON are to be preserved, the schema should be just '&name' for exercises
                                // and the import logic would need to ensure 'id' from JSON is used or remapped.
                                // For simplicity with '++id', we let Dexie generate new IDs.
                                // This means relationships based on old IDs would break if any existed.
                                const exercisesToImport = importedData.data.exercises.map(ex => ({
                                    name: ex.name, // Name is unique index, critical
                                    count: ex.count,
                                    goal: ex.goal
                                    // id is omitted, so Dexie generates a new one
                                }));
                                await db.exercises.bulkPut(exercisesToImport);
                                await db.userSettings.bulkPut(importedData.data.userSettings);
                            });

                            alert('Data imported successfully! The app will now reload.');
                            // Reload the application state by re-initializing
                            // This is a simple way to ensure all components reflect the new data.
                            // Could also manually update state and call UI refresh functions.
                            await initializeApp();
                            // Or simply: window.location.reload(); if initializeApp() handles everything from DB.
                            // initializeApp() seems more appropriate as it re-fetches from DB and updates UI.

                        } catch (error) {
                            console.error('Import failed:', error);
                            alert(`Data import failed: ${error.message}. Please check the file format and console for details.`);
                        } finally {
                            event.target.value = null; // Reset file input
                        }
                    };
                    reader.onerror = () => {
                        alert('Failed to read the file.');
                        event.target.value = null; // Reset file input
                    };
                    reader.readAsText(file);
                });
            }

            // --- App Initialization ---
            // DOMContentLoaded to ensure all elements are available, then initialize.
            document.addEventListener('DOMContentLoaded', initializeApp);

        })();