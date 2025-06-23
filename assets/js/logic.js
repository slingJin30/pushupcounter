(function () {
            // --- State and Elements ---
            let completedCount = Number(localStorage.getItem('pushupcounter_completedCount')) || 0;
            let goal = Number(localStorage.getItem('pushupcounter_goal')) || 2500;
            let username = localStorage.getItem('pushupcounter_username') || '';
            let theme = localStorage.getItem('pushupcounter_theme') || 'light';
            const motivationalMessages = [
                "Keep going! You're crushing it!",
                "Push through the burn—progress is made now!",
                "Every rep counts. Make them matter!",
                "Eyes on the prize—don't stop now!",
                "You're unstoppable. Prove it to yourself!",
                "Almost there, keep pushing!",
                "Feel the power in every push-up!",
                "You got this! Stay strong!",
                "Stronger with every push-up. Consistency wins!",
                "Your future self will thank you for today!",
                "Push-ups today, strength tomorrow. Keep at it!",
                "Consistency is key—show up for yourself!",
                "You are stronger than you think. Believe it!",
                "Believe in yourself and your progress!",
                "Every push-up is a step closer to your goal!",
                "Champions are made one rep at a time!",
                "Sweat now, shine later!",
                "Small steps, big results. Keep moving!",
                "Discipline beats motivation. Stay disciplined!",
                "Greatness is built with effort—rep by rep!"
            ];

            const completedCountEl = document.getElementById('completedCount');
            const progressBarEl = document.getElementById('progressBar');
            const motivationalMsgEl = document.getElementById('motivationalMsg');
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

            // --- Utility Functions ---
            function setStorage(key, value) {
                try { localStorage.setItem('pushupcounter_' + key, value); } catch (e) {}
            }
            function getStorage(key, fallback) {
                try {
                    const val = localStorage.getItem('pushupcounter_' + key);
                    if (val === null) return fallback;
                    if (!isNaN(fallback)) return Number(val);
                    return val;
                } catch (e) { return fallback; }
            }
            function haptic() {
                if (window.navigator.vibrate) window.navigator.vibrate(30);
            }
            function randomMotivation() {
                return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
            }
            function updateDisplay() {
                completedCountEl.textContent = completedCount;
                const percent = Math.min(100, (completedCount / goal) * 100);
                progressBarEl.style.width = percent + '%';
                progressBarEl.textContent = completedCount + ' / ' + goal;
                completedCountEl.classList.remove('pop');
                void completedCountEl.offsetWidth;
                completedCountEl.classList.add('pop');
                motivationalMsgEl.textContent = completedCount >= goal
                    ? "Goal reached! 🎉 Set a new one!"
                    : randomMotivation();
                setStorage('completedCount', completedCount);
                setStorage('goal', goal);
            }
            function playSound() {
                try {
                    pushupSound.currentTime = 0;
                    pushupSound.play();
                } catch (e) {}
            }

            // --- Theme Handling ---
            function applyTheme(theme) {
                const html = document.documentElement;
                if (theme === 'dark') {
                    html.setAttribute('data-bs-theme', 'dark');
                    themeSwitcher.textContent = '☀️';
                    document.body.style.background = 'linear-gradient(135deg, #18181b 0%, #6366f1 100%)';
                } else {
                    html.setAttribute('data-bs-theme', 'light');
                    themeSwitcher.textContent = '🌙';
                    document.body.style.background = 'linear-gradient(135deg, #0f172a 0%, #6366f1 100%)';
                }
            }
            // Apply saved theme on load
            applyTheme(theme);

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

            // --- Button Actions ---
            debounceBtn(addOneBtn, function () { addPushUps(1); });
            debounceBtn(addFiveBtn, function () { addPushUps(5); });
            debounceBtn(addTenBtn, function () { addPushUps(10); });
            debounceBtn(addFiftyBtn, function () { addPushUps(50); });
            debounceBtn(subtractOneBtn, function () { addPushUps(-1); });
            debounceBtn(subtractTenBtn, function () { addPushUps(-10); });

            const MAX_COUNT = 999999; // Set your desired maximum
            const MAX_GOAL = 999999; // Set your desired goal limit

            function updateCountDisplay() {
                document.getElementById('completedCount').textContent = count;
                const percent = Math.min(100, (completedCount / goal) * 100);
                progressBarEl.style.width = percent + '%';
                progressBarEl.textContent = completedCount + ' / ' + goal;
                completedCountEl.classList.remove('pop');
                void completedCountEl.offsetWidth;
                completedCountEl.classList.add('pop');
                motivationalMsgEl.textContent = completedCount >= goal
                    ? "Goal reached! 🎉 Set a new one!"
                    : randomMotivation();
                setStorage('completedCount', completedCount);
                setStorage('goal', goal);
                // Optionally, disable increment buttons if at max
                const addBtns = [
                    document.getElementById('addOneBtn'),
                    document.getElementById('addFiveBtn'),
                    document.getElementById('addTenBtn'),
                    document.getElementById('addFiftyBtn')
                ];
                addBtns.forEach(btn => {
                    if (completedCount >= MAX_COUNT) {
                        btn.disabled = true;
                    } else {
                        btn.disabled = false;
                    }
                });
            }

            function incrementCount(amount) {
                if (completedCount + amount > MAX_COUNT) {
                    completedCount = MAX_COUNT;
                } else {
                    completedCount += amount;
                }
                playSound();
                haptic();
                updateCountDisplay();
            }

            function addPushUps(amount) {
                completedCount = Math.max(0, completedCount + amount);
                playSound();
                haptic();
                updateDisplay();
            }

            resetBtn.addEventListener('click', function () {
                completedCount = 0;
                updateDisplay();
                haptic();
            });

            setGoalBtn.addEventListener('click', function () {
                goalInput.value = goal;
                goalModal.show();
            });

            saveGoalBtn.addEventListener('click', function () {
                const val = parseInt(goalInput.value, 10);
                if (val > 0 && val <= MAX_GOAL) {
                    goal = val;
                    if (completedCount > goal) completedCount = goal;
                    updateDisplay();
                    goalModal.hide();
                    haptic();
                } else if (val > MAX_GOAL) {
                    alert(`Goal cannot be greater than ${MAX_GOAL}. Please set a lower goal.`);
                }
            });

            // --- Theme Switcher ---
            themeSwitcher.addEventListener('click', function () {
                theme = (theme === 'light') ? 'dark' : 'light';
                setStorage('theme', theme);
                applyTheme(theme);
            });

            // --- Share Button ---
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
                html2canvas(target, {
                    backgroundColor: "#0f172a",
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

            // --- Username Personalization ---
            if (username) {
                displayUsername.textContent = 'Welcome, ' + '@' + username;
                usernameInput.value = username;
            } else {
                displayUsername.textContent = '';
            }
            usernameForm.addEventListener('submit', function (e) {
                e.preventDefault();
                username = usernameInput.value.trim().replace(/\s+/g, '');
                if (username.length > 0) {
                    setStorage('username', username);
                    displayUsername.textContent = 'Welcome, ' + '@' + username;
                } else {
                    displayUsername.textContent = '';
                    localStorage.removeItem('pushupcounter_username');
                }
            });

            // --- Accessibility ---
            motivationalMsgEl.setAttribute('aria-live', 'polite');
            completedCountEl.setAttribute('role', 'status');

            // --- Tooltips ---
            document.addEventListener('DOMContentLoaded', function () {
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.forEach(function (tooltipTriggerEl) {
                    new bootstrap.Tooltip(tooltipTriggerEl);
                });
            });

            // --- YouTube Music Button ---
            if (ytMusicBtn) {
                ytMusicBtn.addEventListener('click', function () {
                    const query = encodeURIComponent('workout music');
                    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
                });
            }

            // --- Initialize Display ---
            updateDisplay();
        })();