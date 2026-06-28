// ── FinTrack Expense Tracker Logical Controller ──

// Category Definition & Styles Configuration
const CATEGORY_CONFIG = {
    // Expenses
    "Food": { icon: "🍔", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
    "Transport": { icon: "🚗", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" },
    "Utilities": { icon: "🔌", color: "#7c3aed", bg: "rgba(124, 58, 237, 0.15)" },
    "Shopping": { icon: "🛍️", color: "#ec4899", bg: "rgba(236, 72, 153, 0.15)" },
    "Entertainment": { icon: "🎮", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },
    "Health": { icon: "💊", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.15)" },
    "Other": { icon: "📦", color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)" },
    // Income
    "Salary": { icon: "💼", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },
    "Other-Inc": { icon: "💵", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" }
};

// Initial Default Mock Data (Represents last 6 months up to June 2026)
const DEFAULT_TRANSACTIONS = [
    // Current Month (June 2026)
    { id: 1, type: "Expense", description: "Weekly Grocery Shopping", amount: 2450, category: "Food", date: "2026-06-18" },
    { id: 2, type: "Income", description: "Monthly Software Job Salary", amount: 85000, category: "Salary", date: "2026-06-01" },
    { id: 3, type: "Expense", description: "Electricity & WiFi Bill", amount: 4200, category: "Utilities", date: "2026-06-05" },
    { id: 4, type: "Expense", description: "Designer Shoes Sale", amount: 7200, category: "Shopping", date: "2026-06-10" },
    { id: 5, type: "Expense", description: "Cinema & Dinner Night out", amount: 3500, category: "Entertainment", date: "2026-06-12" },
    { id: 6, type: "Expense", description: "Uber Ride to Office", amount: 950, category: "Transport", date: "2026-06-14" },
    { id: 7, type: "Expense", description: "Monthly Medical Checkup", amount: 1500, category: "Health", date: "2026-06-16" },
    { id: 8, type: "Income", description: "Freelance Website Development", amount: 15000, category: "Other-Inc", date: "2026-06-15" },
    { id: 9, type: "Expense", description: "Amazon Prime Subscription", amount: 1499, category: "Utilities", date: "2026-06-02" },
    { id: 10, type: "Expense", description: "Weekend Pub Hangout", amount: 4800, category: "Entertainment", date: "2026-06-20" },

    // May 2026
    { id: 11, type: "Income", description: "Monthly Software Job Salary", amount: 85000, category: "Salary", date: "2026-05-01" },
    { id: 12, type: "Expense", description: "Apartment Rent & Bills", amount: 18000, category: "Utilities", date: "2026-05-03" },
    { id: 13, type: "Expense", description: "Organic Food Market", amount: 9200, category: "Food", date: "2026-05-08" },
    { id: 14, type: "Expense", description: "Summer Apparel Clothes", amount: 12500, category: "Shopping", date: "2026-05-14" },
    { id: 15, type: "Expense", description: "Car Repair Workshop", amount: 8900, category: "Transport", date: "2026-05-22" },
    { id: 16, type: "Income", description: "Sold Old Office Monitor", amount: 5000, category: "Other-Inc", date: "2026-05-28" },

    // April 2026
    { id: 17, type: "Income", description: "Monthly Software Job Salary", amount: 85000, category: "Salary", date: "2026-04-01" },
    { id: 18, type: "Expense", description: "Weekly Grocery Supply", amount: 7600, category: "Food", date: "2026-04-09" },
    { id: 19, type: "Expense", description: "Concert Concert Ticket", amount: 6000, category: "Entertainment", date: "2026-04-12" },
    { id: 20, type: "Expense", description: "Electric Supplier Payment", amount: 3900, category: "Utilities", date: "2026-04-04" },
    { id: 21, type: "Expense", description: "Gym Membership Annual fee", amount: 12000, category: "Health", date: "2026-04-15" },

    // March 2026
    { id: 22, type: "Income", description: "Monthly Software Job Salary", amount: 85000, category: "Salary", date: "2026-03-01" },
    { id: 23, type: "Expense", description: "Restocking Pantry Supplies", amount: 6900, category: "Food", date: "2026-03-05" },
    { id: 24, type: "Expense", description: "Home Decor & Furnishing", amount: 15000, category: "Shopping", date: "2026-03-12" },
    { id: 25, type: "Expense", description: "Train Tickets for Weekend trip", amount: 2100, category: "Transport", date: "2026-03-18" },
    
    // February 2026
    { id: 26, type: "Income", description: "Monthly Software Job Salary", amount: 85000, category: "Salary", date: "2026-02-01" },
    { id: 27, type: "Expense", description: "Supermarket Purchase", amount: 8100, category: "Food", date: "2026-02-06" },
    { id: 28, type: "Expense", description: "New Smartphone Upgrade", amount: 32000, category: "Shopping", date: "2026-02-10" },
    { id: 29, type: "Expense", description: "Broadband Router Bills", amount: 2800, category: "Utilities", date: "2026-02-04" },

    // January 2026
    { id: 30, type: "Income", description: "Monthly Software Job Salary", amount: 85000, category: "Salary", date: "2026-01-01" },
    { id: 31, type: "Expense", description: "Grocery Store Restock", amount: 6200, category: "Food", date: "2026-01-08" },
    { id: 32, type: "Expense", description: "Gas Station Refuels", amount: 4500, category: "Transport", date: "2026-01-12" },
    { id: 33, type: "Expense", description: "Netflix & Spotify Billing", amount: 1200, category: "Entertainment", date: "2026-01-15" }
];

const DEFAULT_BUDGETS = {
    "Food": 10000,
    "Transport": 5000,
    "Utilities": 8000,
    "Shopping": 12000,
    "Entertainment": 8000,
    "Health": 5000,
    "Other": 6000
};

const DEFAULT_GOALS = [
    { id: "g1", name: "Emergency Fund", saved: 45000, target: 100000, icon: "🛡️" },
    { id: "g2", name: "Vacation", saved: 12000, target: 30000, icon: "✈️" },
    { id: "g3", name: "New Laptop", saved: 25000, target: 60000, icon: "💻" }
];

const DEFAULT_ALERTS = [
    { id: 1, type: "warning", message: "Food expenses reached 81% of monthly budget limit.", date: "2026-06-20", border: "red" },
    { id: 2, type: "success", message: "Milestone! Savings Goal 'Emergency Fund' reached 45%.", date: "2026-06-18", border: "green" },
    { id: 3, type: "purple", message: "Budget health check: Entertainment limit increased to ₹8,000.", date: "2026-06-15", border: "purple" }
];

// App State
let state = {
    transactions: [],
    budgets: {},
    goals: [],
    alerts: [],
    settings: {
        username: "John Doe",
        currency: "₹",
        enableWarnings: true,
        emailAIReport: true
    },
    activeView: "dashboard",
    currentFormType: "Expense" // "Expense" or "Income"
};

// ── State Persistence (localStorage) ──
function loadState() {
    try {
        const username = localStorage.getItem("fintrack_session") || "admin";
        
        // Setup namespaced keys
        const txnKey = `fintrack_${username}_transactions`;
        const budgetKey = `fintrack_${username}_budgets`;
        const goalKey = `fintrack_${username}_goals`;
        const alertKey = `fintrack_${username}_alerts`;
        const settingsKey = `fintrack_${username}_settings`;

        // Check if namespaced keys exist
        const localTxns = localStorage.getItem(txnKey);
        const localBudgets = localStorage.getItem(budgetKey);
        const localGoals = localStorage.getItem(goalKey);
        const localAlerts = localStorage.getItem(alertKey);
        const localSettings = localStorage.getItem(settingsKey);

        if (localTxns) {
            state.transactions = JSON.parse(localTxns);
        } else {
            // Check legacy global key for migration
            const legacyTxns = localStorage.getItem("fintrack_transactions");
            state.transactions = legacyTxns ? JSON.parse(legacyTxns) : DEFAULT_TRANSACTIONS;
        }

        if (localBudgets) {
            state.budgets = JSON.parse(localBudgets);
        } else {
            const legacyBudgets = localStorage.getItem("fintrack_budgets");
            state.budgets = legacyBudgets ? JSON.parse(legacyBudgets) : DEFAULT_BUDGETS;
        }

        if (localGoals) {
            state.goals = JSON.parse(localGoals);
        } else {
            const legacyGoals = localStorage.getItem("fintrack_goals");
            state.goals = legacyGoals ? JSON.parse(legacyGoals) : DEFAULT_GOALS;
        }

        if (localAlerts) {
            state.alerts = JSON.parse(localAlerts);
        } else {
            const legacyAlerts = localStorage.getItem("fintrack_alerts");
            state.alerts = legacyAlerts ? JSON.parse(legacyAlerts) : DEFAULT_ALERTS;
        }

        if (localSettings) {
            state.settings = JSON.parse(localSettings);
        } else {
            const legacySettings = localStorage.getItem("fintrack_settings");
            if (legacySettings) {
                state.settings = JSON.parse(legacySettings);
            } else {
                const users = JSON.parse(localStorage.getItem("fintrack_users") || "[]");
                const currentUserObj = users.find(u => u.username === username);
                state.settings = {
                    username: currentUserObj ? currentUserObj.name : username,
                    currency: "₹",
                    enableWarnings: true,
                    emailAIReport: true
                };
            }
        }
    } catch (e) {
        console.error("Failed to load local storage state, using fallback defaults.", e);
        state.transactions = DEFAULT_TRANSACTIONS;
        state.budgets = DEFAULT_BUDGETS;
        state.goals = DEFAULT_GOALS;
        state.alerts = DEFAULT_ALERTS;
    }
}

function saveState() {
    const username = localStorage.getItem("fintrack_session") || "admin";
    
    const txnKey = `fintrack_${username}_transactions`;
    const budgetKey = `fintrack_${username}_budgets`;
    const goalKey = `fintrack_${username}_goals`;
    const alertKey = `fintrack_${username}_alerts`;
    const settingsKey = `fintrack_${username}_settings`;

    localStorage.setItem(txnKey, JSON.stringify(state.transactions));
    localStorage.setItem(budgetKey, JSON.stringify(state.budgets));
    localStorage.setItem(goalKey, JSON.stringify(state.goals));
    localStorage.setItem(alertKey, JSON.stringify(state.alerts));
    localStorage.setItem(settingsKey, JSON.stringify(state.settings));
}

// ── Authentication Controller Logic ──
function initAuth() {
    const users = localStorage.getItem("fintrack_users");
    if (!users) {
        localStorage.setItem("fintrack_users", JSON.stringify([
            { username: "admin", password: "admin", name: "Admin User" }
        ]));
    }
}

function setupAuthForms() {
    const tabLoginBtn = document.getElementById("tab-login-btn");
    const tabRegisterBtn = document.getElementById("tab-register-btn");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (tabLoginBtn && tabRegisterBtn && loginForm && registerForm) {
        tabLoginBtn.addEventListener("click", () => {
            tabLoginBtn.classList.add("active");
            tabRegisterBtn.classList.remove("active");
            loginForm.classList.add("active-form");
            registerForm.classList.remove("active-form");
        });

        tabRegisterBtn.addEventListener("click", () => {
            tabRegisterBtn.classList.add("active");
            tabLoginBtn.classList.remove("active");
            registerForm.classList.add("active-form");
            loginForm.classList.remove("active-form");
        });
    }

    const loginFormEl = document.getElementById("login-form");
    if (loginFormEl) {
        loginFormEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById("login-username").value.trim().toLowerCase();
            const passwordInput = document.getElementById("login-password").value;
            const btnSubmit = document.getElementById("btnLoginSubmit");
            const btnText = btnSubmit.querySelector(".btn-text-content");
            const spinner = document.getElementById("login-spinner");

            if (!usernameInput || !passwordInput) return;

            const users = JSON.parse(localStorage.getItem("fintrack_users") || "[]");
            const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

            if (user) {
                btnSubmit.disabled = true;
                if (btnText) btnText.style.display = "none";
                if (spinner) spinner.style.display = "inline-block";

                setTimeout(() => {
                    localStorage.setItem("fintrack_session", user.username);
                    state.currentUser = user.username;
                    
                    document.getElementById("auth-container").style.display = "none";
                    document.getElementById("app-container").style.display = "flex";

                    loadState();
                    
                    const userAvatar = document.querySelector(".user-avatar");
                    if (userAvatar && state.settings.username) {
                        userAvatar.textContent = state.settings.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                        userAvatar.title = `Profile: ${state.settings.username}`;
                    }

                    loginFormEl.reset();
                    if (spinner) spinner.style.display = "none";
                    if (btnText) btnText.style.display = "inline-block";
                    btnSubmit.disabled = false;

                    showToast(`Welcome back, ${user.name}!`);
                    refreshActiveView();
                }, 800);
            } else {
                showToast("Invalid username or password!");
            }
        });
    }

    const registerFormEl = document.getElementById("register-form");
    if (registerFormEl) {
        registerFormEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("register-name").value.trim();
            const usernameInput = document.getElementById("register-username").value.trim().toLowerCase();
            const passwordInput = document.getElementById("register-password").value;
            const btnSubmit = document.getElementById("btnRegisterSubmit");
            const btnText = btnSubmit.querySelector(".btn-text-content");
            const spinner = document.getElementById("register-spinner");

            if (!nameInput || !usernameInput || !passwordInput) return;

            const users = JSON.parse(localStorage.getItem("fintrack_users") || "[]");
            const exists = users.some(u => u.username === usernameInput);

            if (exists) {
                showToast("Username already exists!");
                return;
            }

            btnSubmit.disabled = true;
            if (btnText) btnText.style.display = "none";
            if (spinner) spinner.style.display = "inline-block";

            setTimeout(() => {
                const newUser = {
                    username: usernameInput,
                    password: passwordInput,
                    name: nameInput
                };
                users.push(newUser);
                localStorage.setItem("fintrack_users", JSON.stringify(users));

                localStorage.setItem("fintrack_session", usernameInput);
                state.currentUser = usernameInput;

                loadState();
                saveState();

                document.getElementById("auth-container").style.display = "none";
                document.getElementById("app-container").style.display = "flex";

                const userAvatar = document.querySelector(".user-avatar");
                if (userAvatar && nameInput) {
                    userAvatar.textContent = nameInput.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    userAvatar.title = `Profile: ${nameInput}`;
                }

                registerFormEl.reset();
                if (spinner) spinner.style.display = "none";
                if (btnText) btnText.style.display = "inline-block";
                btnSubmit.disabled = false;

                showToast(`Welcome, ${nameInput}! Account created.`);
                refreshActiveView();
            }, 800);
        });
    }
}

// ── Currency Formatting Utility ──
function formatCurrency(amount) {
    const formattedVal = Math.abs(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `${state.settings.currency}${formattedVal}`;
}

// ── Count Up Animation Utility ──
function countUp(elementId, targetValue, prefix = '₹', suffix = '', duration = 1000) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let start = 0;
    const startTimestamp = performance.now();

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = progress * targetValue;
        
        if (prefix === '₹' || prefix === '$' || prefix === '€' || prefix === '£') {
            el.textContent = `${prefix}${currentVal.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        } else {
            el.textContent = `${prefix}${Math.floor(currentVal)}${suffix}`;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            if (prefix === '₹' || prefix === '$' || prefix === '€' || prefix === '£') {
                el.textContent = `${prefix}${targetValue.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            } else {
                el.textContent = `${prefix}${targetValue}${suffix}`;
            }
        }
    }

    window.requestAnimationFrame(step);
}

// ── Live Calculation Logic ──
function updateDashboardMetrics() {
    // Current active month transactions (June 2026)
    const June2026Txns = state.transactions.filter(t => t.date.startsWith("2026-06"));
    
    // Totals Calculations
    let totalIncome = 0;
    let totalExpenses = 0;
    
    June2026Txns.forEach(t => {
        if (t.type === "Income") {
            totalIncome += t.amount;
        } else {
            totalExpenses += t.amount;
        }
    });

    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    // Run Count up Animations
    countUp("val-income", totalIncome, state.settings.currency);
    countUp("val-expenses", totalExpenses, state.settings.currency);
    
    // Net balance handles negative sign placement
    const balanceSign = netBalance < 0 ? "-" : "";
    const balanceVal = document.getElementById("val-balance");
    if (balanceVal) {
        if (netBalance < 0) {
            balanceVal.style.color = "var(--expense-color)";
        } else {
            balanceVal.style.color = "var(--text-primary)";
        }
        countUp("val-balance", Math.abs(netBalance), balanceSign + state.settings.currency);
    }
    
    countUp("val-savings", savingsRate, "", "%");

    // Recalculate Savings Rate details
    const savingsTrendEl = document.querySelector(".savings-card .stat-trend");
    if (savingsTrendEl) {
        if (savingsRate >= 30) {
            savingsTrendEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> Excellent savings!`;
            savingsTrendEl.className = "stat-trend trend-up";
        } else if (savingsRate >= 15) {
            savingsTrendEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> Good savings rate.`;
            savingsTrendEl.className = "stat-trend trend-up";
        } else if (savingsRate >= 0) {
            savingsTrendEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg> Tight cash reserve.`;
            savingsTrendEl.className = "stat-trend trend-neutral";
        } else {
            savingsTrendEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg> Net negative budget.`;
            savingsTrendEl.className = "stat-trend trend-down";
        }
    }
}

// ── Add Category Dropdown Dynamic Loader ──
function loadFormCategories() {
    const catSelect = document.getElementById("txn-category");
    if (!catSelect) return;

    catSelect.innerHTML = `<option value="" disabled selected>Select Category</option>`;
    
    Object.keys(CATEGORY_CONFIG).forEach(cat => {
        const conf = CATEGORY_CONFIG[cat];
        // Filter: Income gets Salary/Other-Inc. Expense gets all others.
        if (state.currentFormType === "Income") {
            if (cat === "Salary" || cat === "Other-Inc") {
                catSelect.innerHTML += `<option value="${cat}">${conf.icon} ${cat}</option>`;
            }
        } else {
            if (cat !== "Salary" && cat !== "Other-Inc") {
                catSelect.innerHTML += `<option value="${cat}">${conf.icon} ${cat}</option>`;
            }
        }
    });
}

// ── 6-Month comparative Horizontal trend bar graph ──
function renderTrendBars() {
    const trendContainer = document.getElementById("monthly-trend-bars");
    if (!trendContainer) return;

    // Define last 6 months keys YYYY-MM
    const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
    const monthLabels = ["January", "February", "March", "April", "May", "June"];

    // Compute income and expenses per month
    const monthlyData = months.map(m => {
        let income = 0;
        let expense = 0;
        state.transactions.forEach(t => {
            if (t.date.startsWith(m)) {
                if (t.type === "Income") income += t.amount;
                else expense += t.amount;
            }
        });
        return { month: m, income, expense };
    });

    // Find maximum single value to scale widths relative to maximum limit
    let maxValue = 1000;
    monthlyData.forEach(d => {
        if (d.income > maxValue) maxValue = d.income;
        if (d.expense > maxValue) maxValue = d.expense;
    });

    trendContainer.innerHTML = "";

    monthlyData.forEach((data, index) => {
        const isCurrent = data.month === "2026-06";
        const incPct = Math.max((data.income / maxValue) * 100, 3); // minimum visible width
        const expPct = Math.max((data.expense / maxValue) * 100, 3);

        const rowHtml = `
            <div class="trend-bar-row ${isCurrent ? 'highlighted' : ''}">
                <div class="trend-bar-label-group ${isCurrent ? 'highlighted-month' : ''}">
                    <span class="month-name">${monthLabels[index]}${isCurrent ? ' (Active)' : ''}</span>
                    <span>Inc: ${formatCurrency(data.income)} | Exp: ${formatCurrency(data.expense)}</span>
                </div>
                <div class="trend-bar-visuals">
                    <div class="bar-track">
                        <div class="bar-fill income" style="width: 0%;" data-width="${incPct}%"></div>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill expense" style="width: 0%;" data-width="${expPct}%"></div>
                    </div>
                </div>
            </div>
        `;
        trendContainer.innerHTML += rowHtml;
    });

    // Force animation trigger
    setTimeout(() => {
        const fills = trendContainer.querySelectorAll(".bar-fill");
        fills.forEach(fill => {
            fill.style.width = fill.getAttribute("data-width");
        });
    }, 100);
}

// ── Budget Tracker list progress bars ──
function renderBudgets() {
    const container = document.getElementById("category-budgets");
    if (!container) return;

    container.innerHTML = "";
    
    const categories = Object.keys(state.budgets);
    let totalJuneExpenses = 0;
    let totalJuneBudgetLimit = 0;

    // Filter June 2026 active transactions
    const JuneTxns = state.transactions.filter(t => t.date.startsWith("2026-06"));

    categories.forEach(cat => {
        const limit = state.budgets[cat];
        totalJuneBudgetLimit += limit;

        // Calculate expenses spent in category
        let spent = 0;
        JuneTxns.forEach(t => {
            if (t.type === "Expense" && t.category === cat) {
                spent += t.amount;
            }
        });
        totalJuneExpenses += spent;

        const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
        const overwarning = spent > limit ? `<span class="over-warning">Over!</span>` : "";
        const isOver = spent > limit;
        
        let barColor = "var(--accent)"; // Default purple
        if (pct >= 100) barColor = "var(--expense-color)"; // Red
        else if (pct >= 85) barColor = "var(--savings-color)"; // Orange

        const rowHtml = `
            <div class="budget-row">
                <div class="budget-info">
                    <span class="cat-name">${CATEGORY_CONFIG[cat].icon} ${cat}</span>
                    <span class="val-pct">
                        ${overwarning} ${formatCurrency(spent)} / ${formatCurrency(limit)} (${pct}%)
                    </span>
                </div>
                <div class="budget-bar">
                    <div class="budget-fill" style="width: ${Math.min(pct, 100)}%; background-color: ${barColor}"></div>
                </div>
            </div>
        `;
        container.innerHTML += rowHtml;
    });

    // Update Overall Budget Health Bar
    const overallPct = totalJuneBudgetLimit > 0 ? Math.round((totalJuneExpenses / totalJuneBudgetLimit) * 100) : 0;
    const overallPctEl = document.getElementById("overall-budget-pct");
    const overallBar = document.getElementById("overall-budget-progress");

    if (overallPctEl) overallPctEl.textContent = `${overallPct}%`;
    if (overallBar) {
        overallBar.style.width = `${Math.min(overallPct, 100)}%`;
        if (overallPct >= 100) {
            overallBar.style.background = "var(--expense-color)";
        } else if (overallPct >= 85) {
            overallBar.style.background = "var(--savings-color)";
        } else {
            overallBar.style.background = "linear-gradient(90deg, var(--accent) 0%, #a855f7 100%)";
        }
    }
}

// ── Savings Goals listing rendering ──
function renderSavingsGoals() {
    const listEl = document.getElementById("savings-goals-list");
    if (!listEl) return;

    listEl.innerHTML = "";
    
    let totalSaved = 0;
    state.goals.forEach(g => {
        totalSaved += g.saved;
        const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;

        const goalHtml = `
            <div class="goal-card">
                <div class="goal-header">
                    <span class="goal-title">${g.icon} ${g.name}</span>
                    <span class="goal-target-text">Target: ${formatCurrency(g.target)}</span>
                </div>
                <div class="goal-progress-group">
                    <div class="goal-bar">
                        <div class="goal-fill" style="width: ${Math.min(pct, 100)}%"></div>
                    </div>
                    <div class="goal-stats">
                        <span class="current">Saved: ${formatCurrency(g.saved)}</span>
                        <span class="percent">${pct}%</span>
                    </div>
                </div>
            </div>
        `;
        listEl.innerHTML += goalHtml;
    });

    const totalSavedEl = document.getElementById("goals-total-saved");
    const activeCountEl = document.getElementById("goals-active-count");

    if (totalSavedEl) totalSavedEl.textContent = formatCurrency(totalSaved);
    if (activeCountEl) activeCountEl.textContent = state.goals.length;
}

// ── Recent Transactions Feed List ──
function renderRecentTransactionsFeed() {
    const feed = document.getElementById("transactions-feed");
    if (!feed) return;

    feed.innerHTML = "";

    // Show latest 7 transactions
    const sortedTxns = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);

    if (sortedTxns.length === 0) {
        feed.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px 0;">No transactions available.</div>`;
        return;
    }

    sortedTxns.forEach((t) => {
        const isInc = t.type === "Income";
        const amtSign = isInc ? "+" : "-";
        const classAmt = isInc ? "income-amt" : "expense-amt";
        const config = CATEGORY_CONFIG[t.category] || { icon: "📦", bg: "rgba(255,255,255,0.05)", color: "white" };

        const rowHtml = `
            <div class="txn-row" id="txn-item-${t.id}">
                <div class="txn-info-left">
                    <div class="cat-icon-container" style="background-color: ${config.bg}; color: ${config.color}">
                        ${config.icon}
                    </div>
                    <div class="txn-name-tag">
                        <span class="txn-name">${t.description}</span>
                        <div class="txn-meta">
                            <span class="txn-date">${t.date}</span>
                            <span class="txn-tag">${t.category}</span>
                        </div>
                    </div>
                </div>
                <div class="txn-amount ${classAmt}">
                    ${amtSign}${formatCurrency(t.amount)}
                </div>
            </div>
        `;
        feed.innerHTML += rowHtml;
    });
}

// ── AI Insights panel updates ──
function updateAIInsights() {
    const listEl = document.getElementById("ai-insights-list");
    if (!listEl) return;

    // Filter June 2026 active transactions
    const JuneTxns = state.transactions.filter(t => t.date.startsWith("2026-06"));
    let juneExpenses = 0;
    let categoryExpenses = {};
    
    JuneTxns.forEach(t => {
        if (t.type === "Expense") {
            juneExpenses += t.amount;
            categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
        }
    });

    // Check high expense categories
    let highCat = null;
    let highAmt = 0;
    Object.keys(categoryExpenses).forEach(cat => {
        if (categoryExpenses[cat] > highAmt) {
            highAmt = categoryExpenses[cat];
            highCat = cat;
        }
    });

    const overallJuneBudgetLimit = Object.values(state.budgets).reduce((sum, v) => sum + v, 0);

    // Dynamic generation
    const positiveInsight = {
        title: "Cashflow Healthy",
        desc: "You saved over 18% of your overall monthly earnings so far this week. Great work!"
    };

    if (juneExpenses < overallJuneBudgetLimit * 0.5) {
        positiveInsight.title = "High Budget Buffer";
        positiveInsight.desc = "Nice pacing! You have used less than 50% of your total budget limit for June.";
    }

    const warningInsight = {
        title: "No Budget Alerts",
        desc: "Your expenses are currently within limits in all standard categories."
    };

    if (highCat && highAmt > state.budgets[highCat] * 0.8) {
        const pct = Math.round((highAmt / state.budgets[highCat]) * 100);
        warningInsight.title = `${highCat} Budget Warning`;
        warningInsight.desc = `Your ${highCat} spending is at ${pct}% of your limit. Consider cooling down purchases.`;
    }

    const tipInsight = {
        title: "Goal Allocation Tip",
        desc: "Save an extra ₹1,500 in your 'New Laptop' fund to meet your target 2 weeks ahead!"
    };

    listEl.innerHTML = `
        <div class="insight-card positive">
            <span class="insight-icon">🌟</span>
            <div class="insight-text-box">
                <span class="insight-title">${positiveInsight.title}</span>
                <span class="insight-desc">${positiveInsight.desc}</span>
            </div>
        </div>
        
        <div class="insight-card warning">
            <span class="insight-icon">⚠️</span>
            <div class="insight-text-box">
                <span class="insight-title">${warningInsight.title}</span>
                <span class="insight-desc">${warningInsight.desc}</span>
            </div>
        </div>

        <div class="insight-card tip">
            <span class="insight-icon">💡</span>
            <div class="insight-text-box">
                <span class="insight-title">${tipInsight.title}</span>
                <span class="insight-desc">${tipInsight.desc}</span>
            </div>
        </div>
    `;
}

// ── Smart Alerts panel updates ──
function updateSmartAlerts() {
    const listEl = document.getElementById("smart-alerts-list");
    if (!listEl) return;

    listEl.innerHTML = "";

    // Show latest 3 alerts from state
    const latestAlerts = state.alerts.slice(0, 3);
    
    latestAlerts.forEach(a => {
        let borderClass = "";
        if (a.border === "red") borderClass = "border-red";
        else if (a.border === "green") borderClass = "border-green";

        const rowHtml = `
            <div class="alert-row ${borderClass}">
                <span>${a.message}</span>
                <span class="alert-date">${a.date}</span>
            </div>
        `;
        listEl.innerHTML += rowHtml;
    });

    // Update alert count badge in sidebar
    const badge = document.getElementById("sidebar-alerts-badge");
    if (badge) {
        badge.textContent = state.alerts.length;
        badge.style.display = state.alerts.length > 0 ? "inline-block" : "none";
    }
}

// ── Form Submit Transaction Handler ──
function setupFormSubmit() {
    const form = document.getElementById("transaction-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const desc = document.getElementById("txn-desc").value.trim();
        const amt = parseFloat(document.getElementById("txn-amount").value);
        const cat = document.getElementById("txn-category").value;

        if (!desc || isNaN(amt) || amt <= 0 || !cat) {
            showToast("Please fill in valid transaction fields!");
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        // Create new transaction object
        const newTxn = {
            id: Date.now(),
            type: state.currentFormType,
            description: desc,
            amount: amt,
            category: cat,
            date: today
        };

        // Prepend to state
        state.transactions.unshift(newTxn);
        saveState();

        // ── Real-time Alert checks ──
        if (state.currentFormType === "Expense") {
            const JuneTxns = state.transactions.filter(t => t.date.startsWith("2026-06"));
            let spent = 0;
            JuneTxns.forEach(t => {
                if (t.type === "Expense" && t.category === cat) {
                    spent += t.amount;
                }
            });

            const limit = state.budgets[cat];
            if (limit && spent > limit) {
                // Add Budget Exceeded Alert
                const newAlert = {
                    id: Date.now(),
                    type: "warning",
                    message: `Exceeded! ${cat} spending exceeded budget limit by ${formatCurrency(spent - limit)}.`,
                    date: today,
                    border: "red"
                };
                state.alerts.unshift(newAlert);
                saveState();
            } else if (limit && spent > limit * 0.8) {
                // Add Budget Exceeded Warning Alert
                const newAlert = {
                    id: Date.now(),
                    type: "warning",
                    message: `Caution: ${cat} spending is over 80% of budget limit.`,
                    date: today,
                    border: "red"
                };
                state.alerts.unshift(newAlert);
                saveState();
            }
        }

        // Reset Form Fields
        form.reset();
        loadFormCategories();

        // Show Feedback Toast
        showToast(`Transaction added successfully!`);

        // Refresh Active Dashboard View
        refreshActiveView();
    });
}

// ── Interactive Sidebar router page toggle navigation ──
function setupSidebarRouter() {
    const navItems = document.querySelectorAll(".nav-item");
    const panels = document.querySelectorAll(".view-panel");
    const pageTitle = document.getElementById("page-title");

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const view = item.getAttribute("data-view");

            // Update Nav class
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // Update state
            state.activeView = view;

            // Toggle HTML view panels
            panels.forEach(p => {
                p.classList.remove("active-panel");
                if (p.id === `panel-${view}`) {
                    p.classList.add("active-panel");
                }
            });

            // Update title
            const capitalizedTitle = view.charAt(0).toUpperCase() + view.slice(1);
            if (pageTitle) pageTitle.textContent = capitalizedTitle;

            // Trigger view-specific loads
            refreshActiveView();
        });
    });

    // Setup Logout Button Click
    const btnLogout = document.getElementById("btnLogout");
    const logoutModal = document.getElementById("logout-confirm-modal");
    if (btnLogout && logoutModal) {
        btnLogout.addEventListener("click", () => {
            logoutModal.classList.add("active");
        });
    }
}

// ── Refresh specific page views when clicked or updated ──
function refreshActiveView() {
    loadState();
    
    // Always refresh metrics & alerts count in sidebar
    updateDashboardMetrics();
    const badge = document.getElementById("sidebar-alerts-badge");
    if (badge) {
        badge.textContent = state.alerts.length;
        badge.style.display = state.alerts.length > 0 ? "inline-block" : "none";
    }

    if (state.activeView === "dashboard") {
        renderTrendBars();
        renderBudgets();
        renderSavingsGoals();
        renderRecentTransactionsFeed();
        updateAIInsights();
        updateSmartAlerts();
        loadFormCategories();
    } else if (state.activeView === "transactions") {
        renderLedgerTable();
        populateLedgerFilterCats();
    } else if (state.activeView === "analytics") {
        renderAnalyticsCharts();
    } else if (state.activeView === "budget") {
        renderBudgetSettingsList();
    } else if (state.activeView === "goals") {
        renderGoalsSettingsList();
    } else if (state.activeView === "alerts") {
        renderAlertsHistoryList();
    }
}

// ── View-specific: Ledger Transactions Table rendering ──
function renderLedgerTable() {
    const tbody = document.getElementById("ledger-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const searchVal = document.getElementById("ledger-search").value.toLowerCase();
    const typeVal = document.getElementById("ledger-filter-type").value;
    const catVal = document.getElementById("ledger-filter-cat").value;

    let filtered = [...state.transactions];

    // Search description filter
    if (searchVal) {
        filtered = filtered.filter(t => t.description.toLowerCase().includes(searchVal));
    }
    
    // Type filter
    if (typeVal !== "all") {
        filtered = filtered.filter(t => t.type === typeVal);
    }

    // Category filter
    if (catVal !== "all") {
        filtered = filtered.filter(t => t.category === catVal);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding:30px;">No matching transactions found.</td></tr>`;
        return;
    }

    // Sort by Date Descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(t => {
        const isInc = t.type === "Income";
        const amtColor = isInc ? "var(--income-color)" : "var(--expense-color)";
        const amtSign = isInc ? "+" : "-";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${t.date}</strong></td>
            <td><span class="txn-tag" style="background-color: ${isInc ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; color: ${amtColor}">${t.type}</span></td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td style="color: ${amtColor}; font-weight: 700; font-family: var(--font-display)">${amtSign}${formatCurrency(t.amount)}</td>
            <td>
                <button class="btn-delete-row" data-id="${t.id}" title="Delete Transaction">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </td>
        `;

        // Attach event listener for row deletion
        row.querySelector(".btn-delete-row").addEventListener("click", () => {
            if (confirm(`Delete transaction "${t.description}"?`)) {
                state.transactions = state.transactions.filter(item => item.id !== t.id);
                saveState();
                showToast("Transaction deleted successfully.");
                renderLedgerTable();
            }
        });

        tbody.appendChild(row);
    });
}

function populateLedgerFilterCats() {
    const catFilter = document.getElementById("ledger-filter-cat");
    if (!catFilter) return;

    const previousVal = catFilter.value;
    catFilter.innerHTML = `<option value="all">All Categories</option>`;
    
    Object.keys(CATEGORY_CONFIG).forEach(cat => {
        catFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
    });

    catFilter.value = previousVal;
}

// ── View-specific: SVG mock charts rendering ──
function renderAnalyticsCharts() {
    const flowContainer = document.getElementById("cashflow-chart-container");
    const categoryContainer = document.getElementById("category-chart-container");

    if (!flowContainer || !categoryContainer) return;

    // Build Mock SVG Trend Cash Flow graph
    flowContainer.innerHTML = `
        <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:center;">
            <svg class="svg-chart" viewBox="0 0 500 220" width="100%" height="180">
                <!-- Grid Lines -->
                <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                <line x1="40" y1="170" x2="480" y2="170" stroke="var(--text-muted)" stroke-width="1.5"/>

                <!-- Monthly Labels -->
                <text x="75" y="195" fill="var(--text-secondary)" font-size="10" text-anchor="middle">Jan</text>
                <text x="145" y="195" fill="var(--text-secondary)" font-size="10" text-anchor="middle">Feb</text>
                <text x="215" y="195" fill="var(--text-secondary)" font-size="10" text-anchor="middle">Mar</text>
                <text x="285" y="195" fill="var(--text-secondary)" font-size="10" text-anchor="middle">Apr</text>
                <text x="355" y="195" fill="var(--text-secondary)" font-size="10" text-anchor="middle">May</text>
                <text x="425" y="195" fill="var(--text-secondary)" font-size="10" text-anchor="middle">Jun</text>

                <!-- Value Axis Labels -->
                <text x="30" y="24" fill="var(--text-muted)" font-size="9" text-anchor="end">₹100K</text>
                <text x="30" y="74" fill="var(--text-muted)" font-size="9" text-anchor="end">₹75K</text>
                <text x="30" y="124" fill="var(--text-muted)" font-size="9" text-anchor="end">₹50K</text>
                <text x="30" y="174" fill="var(--text-muted)" font-size="9" text-anchor="end">₹0K</text>

                <!-- Paired Charts bars (Jan-Jun) -->
                <!-- Jan (Inc: 85k, Exp: 12k) -->
                <rect x="65" y="85" width="10" height="85" fill="var(--income-color)" rx="3"/>
                <rect x="77" y="158" width="10" height="12" fill="var(--expense-color)" rx="3"/>
                
                <!-- Feb (Inc: 85k, Exp: 43k) -->
                <rect x="135" y="85" width="10" height="85" fill="var(--income-color)" rx="3"/>
                <rect x="147" y="127" width="10" height="43" fill="var(--expense-color)" rx="3"/>
                
                <!-- Mar (Inc: 85k, Exp: 24k) -->
                <rect x="205" y="85" width="10" height="85" fill="var(--income-color)" rx="3"/>
                <rect x="217" y="146" width="10" height="24" fill="var(--expense-color)" rx="3"/>
                
                <!-- Apr (Inc: 85k, Exp: 35.5k) -->
                <rect x="275" y="85" width="10" height="85" fill="var(--income-color)" rx="3"/>
                <rect x="287" y="134" width="10" height="36" fill="var(--expense-color)" rx="3"/>
                
                <!-- May (Inc: 90k, Exp: 48k) -->
                <rect x="345" y="80" width="10" height="90" fill="var(--income-color)" rx="3"/>
                <rect x="357" y="122" width="10" height="48" fill="var(--expense-color)" rx="3"/>
                
                <!-- Jun (Inc: 100K, Exp: 31k) -->
                <rect x="415" y="70" width="10" height="100" fill="var(--income-color)" rx="3"/>
                <rect x="427" y="139" width="10" height="31" fill="var(--expense-color)" rx="3"/>
            </svg>
            <div class="chart-legend">
                <div class="legend-item"><span class="legend-dot inc"></span><span>Income</span></div>
                <div class="legend-item"><span class="legend-dot exp"></span><span>Expenses</span></div>
            </div>
        </div>
    `;

    // Compute active June expense categories shares
    const JuneTxns = state.transactions.filter(t => t.date.startsWith("2026-06") && t.type === "Expense");
    let categoryExpenses = {};
    let totalSpent = 0;
    
    JuneTxns.forEach(t => {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
        totalSpent += t.amount;
    });

    if (totalSpent === 0) {
        categoryContainer.innerHTML = `<div style="color:var(--text-muted); text-align:center;">Add some expenses in the dashboard to see breakdown!</div>`;
        return;
    }

    // Render list chart percentages
    let listHtml = `<div style="display:flex; flex-direction:column; gap:12px; width:100%; padding: 10px 0;">`;
    
    Object.keys(categoryExpenses).forEach(cat => {
        const amt = categoryExpenses[cat];
        const pct = Math.round((amt / totalSpent) * 100);
        const config = CATEGORY_CONFIG[cat] || { color: "#7c3aed" };
        
        listHtml += `
            <div style="display:flex; flex-direction:column; gap:6px;">
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700;">
                    <span>${CATEGORY_CONFIG[cat].icon} ${cat}</span>
                    <span style="color: ${config.color}">${pct}% (${formatCurrency(amt)})</span>
                </div>
                <div style="height:6px; background-color: var(--inner-dark); border-radius:3px;">
                    <div style="height:100%; border-radius:3px; width:${pct}%; background-color: ${config.color}"></div>
                </div>
            </div>
        `;
    });

    listHtml += "</div>";
    categoryContainer.innerHTML = listHtml;
}

// ── View-specific: Budget Adjustment Limits settings panel ──
function renderBudgetSettingsList() {
    const listEl = document.getElementById("budget-settings-list");
    if (!listEl) return;

    listEl.innerHTML = "";

    Object.keys(state.budgets).forEach(cat => {
        const limit = state.budgets[cat];
        const row = document.createElement("div");
        row.className = "budget-adjust-row";
        
        row.innerHTML = `
            <div class="budget-adjust-info">
                <span style="font-size: 1.3rem;">${CATEGORY_CONFIG[cat].icon}</span>
                <span class="budget-adjust-cat">${cat}</span>
            </div>
            <div class="budget-control-group">
                <button class="btn-ctrl btn-dec">-</button>
                <div class="budget-value-display">${formatCurrency(limit)}</div>
                <button class="btn-ctrl btn-inc">+</button>
            </div>
        `;

        // Event: decrement budget limit
        row.querySelector(".btn-dec").addEventListener("click", () => {
            if (state.budgets[cat] > 500) {
                state.budgets[cat] -= 500;
                saveState();
                renderBudgetSettingsList();
            }
        });

        // Event: increment budget limit
        row.querySelector(".btn-inc").addEventListener("click", () => {
            state.budgets[cat] += 500;
            saveState();
            renderBudgetSettingsList();
        });

        listEl.appendChild(row);
    });
}

// ── View-specific: Savings Goals details list ──
function renderGoalsSettingsList() {
    const gridEl = document.getElementById("goals-settings-list");
    if (!gridEl) return;

    gridEl.innerHTML = "";

    state.goals.forEach((g, index) => {
        const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
        
        const card = document.createElement("div");
        card.className = "goal-detail-card";
        card.innerHTML = `
            <div class="goal-detail-header">
                <div>
                    <h4 style="font-size: 1rem; font-weight:700; margin-bottom:2px;">${g.name}</h4>
                    <span style="font-size:0.75rem; color:var(--text-secondary)">Target: ${formatCurrency(g.target)}</span>
                </div>
                <div class="goal-icon-glow">${g.icon}</div>
            </div>
            <div class="goal-progress-group">
                <div class="goal-bar">
                    <div class="goal-fill" style="width: ${Math.min(pct, 100)}%"></div>
                </div>
                <div class="goal-stats">
                    <span class="current">Saved: ${formatCurrency(g.saved)}</span>
                    <span class="percent">${pct}%</span>
                </div>
            </div>
            <div class="goal-detail-actions">
                <button class="btn-add-fund btn-add-savings-trigger" data-id="${g.id}">Add Savings</button>
                <button class="btn-delete-goal" data-index="${index}" title="Remove Goal">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;

        // Event: Delete Goal
        card.querySelector(".btn-delete-goal").addEventListener("click", () => {
            if (confirm(`Remove savings goal "${g.name}"?`)) {
                state.goals.splice(index, 1);
                saveState();
                showToast(`Goal "${g.name}" deleted.`);
                renderGoalsSettingsList();
            }
        });

        // Event: Trigger Allocating Savings Modal
        card.querySelector(".btn-add-savings-trigger").addEventListener("click", () => {
            openSavingsModal(g.id, g.name);
        });

        gridEl.appendChild(card);
    });
}

// ── View-specific: Alerts center list ──
function renderAlertsHistoryList() {
    const listEl = document.getElementById("alerts-history-list");
    if (!listEl) return;

    listEl.innerHTML = "";

    if (state.alerts.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:40px 0; color:var(--text-muted)">No notification alerts logged yet.</div>`;
        return;
    }

    state.alerts.forEach(a => {
        const item = document.createElement("div");
        item.className = "alert-history-item";
        item.innerHTML = `
            <div class="alert-history-left">
                <span class="alert-status-dot ${a.border === 'red' ? 'red' : a.border === 'green' ? 'green' : 'purple'}"></span>
                <span class="alert-history-message">${a.message}</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted);">${a.date}</span>
        `;
        listEl.appendChild(item);
    });
}

// ── MODALS LOGIC ──

// Toast Notifications
function showToast(message) {
    const toast = document.getElementById("toast-notif");
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = "block";
    
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

// Open Savings goal dialog trigger
function openSavingsModal(goalId, goalName) {
    const modal = document.getElementById("add-savings-modal");
    const inputId = document.getElementById("add-savings-goal-id");
    const label = document.getElementById("add-savings-label");

    if (modal && inputId && label) {
        inputId.value = goalId;
        label.textContent = `Allocate savings to "${goalName}":`;
        modal.classList.add("active");
    }
}

// Setup Dialog Triggers & Closing handlers
function setupModals() {
    // General overlays closing click listener
    const overlays = document.querySelectorAll(".modal-overlay");
    overlays.forEach(overlay => {
        overlay.querySelector(".btn-close").addEventListener("click", () => {
            overlay.classList.remove("active");
        });
    });

    // Close buttons on forms
    const btnCloseGoal = document.getElementById("btnCloseGoalModal");
    const goalModal = document.getElementById("new-goal-modal");
    if (btnCloseGoal && goalModal) {
        btnCloseGoal.addEventListener("click", () => goalModal.classList.remove("active"));
    }

    const btnCloseSavings = document.getElementById("btnCloseSavingsModal");
    const savingsModal = document.getElementById("add-savings-modal");
    if (btnCloseSavings && savingsModal) {
        btnCloseSavings.addEventListener("click", () => savingsModal.classList.remove("active"));
    }

    // Logout Modal Actions Setup
    const logoutModal = document.getElementById("logout-confirm-modal");
    const btnConfirmLogout = document.getElementById("btnConfirmLogout");
    const btnCancelLogout = document.getElementById("btnCancelLogout");
    if (btnCancelLogout && logoutModal) {
        btnCancelLogout.addEventListener("click", () => {
            logoutModal.classList.remove("active");
        });
    }
    if (btnConfirmLogout && logoutModal) {
        btnConfirmLogout.addEventListener("click", () => {
            localStorage.removeItem("fintrack_session");
            logoutModal.classList.remove("active");
            showToast("Logged out successfully! Redirecting...");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }

    // Open Create Goal Modal trigger
    const btnNewGoal = document.getElementById("btnNewGoal");
    if (btnNewGoal && goalModal) {
        btnNewGoal.addEventListener("click", () => {
            goalModal.classList.add("active");
        });
    }

    // Submit Create Goal Form
    const newGoalForm = document.getElementById("new-goal-form");
    if (newGoalForm) {
        newGoalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("goal-name").value.trim();
            const target = parseFloat(document.getElementById("goal-target").value);
            const saved = parseFloat(document.getElementById("goal-saved").value) || 0;

            if (!name || isNaN(target) || target <= 0) {
                showToast("Please input valid target fields!");
                return;
            }

            const newGoal = {
                id: "g_" + Date.now(),
                name,
                target,
                saved,
                icon: "🎯"
            };

            state.goals.push(newGoal);
            saveState();
            
            // Add Milestone Alert
            const today = new Date().toISOString().split('T')[0];
            const newAlert = {
                id: Date.now(),
                type: "success",
                message: `New Goal Created: '${name}' target set at ${formatCurrency(target)}.`,
                date: today,
                border: "green"
            };
            state.alerts.unshift(newAlert);
            saveState();

            // Reset & Close
            newGoalForm.reset();
            goalModal.classList.remove("active");
            showToast(`Savings goal "${name}" created.`);
            renderGoalsSettingsList();
        });
    }

    // Submit Add Savings Form
    const addSavingsForm = document.getElementById("add-savings-form");
    if (addSavingsForm && savingsModal) {
        addSavingsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const goalId = document.getElementById("add-savings-goal-id").value;
            const amt = parseFloat(document.getElementById("add-savings-amount").value);

            if (isNaN(amt) || amt <= 0) {
                showToast("Please input a valid amount!");
                return;
            }

            // Find goal and update saved funds
            const goal = state.goals.find(g => g.id === goalId);
            if (goal) {
                goal.saved += amt;
                saveState();

                // Add Smart Alert check on milestone complete
                if (goal.saved >= goal.target) {
                    const today = new Date().toISOString().split('T')[0];
                    const completeAlert = {
                        id: Date.now(),
                        type: "success",
                        message: `Goal Met! You completed savings goal target for '${goal.name}'. 🎉`,
                        date: today,
                        border: "green"
                    };
                    state.alerts.unshift(completeAlert);
                    saveState();
                }

                addSavingsForm.reset();
                savingsModal.classList.remove("active");
                showToast(`Fund allocation confirmed!`);
                renderGoalsSettingsList();
            }
        });
    }

    // Settings Profile Form Submit
    const settingsForm = document.getElementById("settings-form");
    if (settingsForm) {
        settingsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById("settings-username").value.trim();
            const currencyInput = document.getElementById("settings-currency").value;
            const notifInput = document.getElementById("settings-notif").checked;
            const emailInput = document.getElementById("settings-email").checked;

            state.settings.username = usernameInput || state.settings.username;
            state.settings.currency = currencyInput;
            state.settings.enableWarnings = notifInput;
            state.settings.emailAIReport = emailInput;

            saveState();
            
            // Update UI username representation if needed
            const userAvatar = document.querySelector(".user-avatar");
            if (userAvatar && usernameInput) {
                userAvatar.textContent = usernameInput.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                userAvatar.title = `Profile: ${usernameInput}`;
            }

            showToast("Settings updated successfully!");
        });
    }

    // Clear Alert Logs
    const btnClearAlerts = document.getElementById("btnClearAlerts");
    if (btnClearAlerts) {
        btnClearAlerts.addEventListener("click", () => {
            if (confirm("Clear all logs?")) {
                state.alerts = [];
                saveState();
                showToast("Logs cleared successfully.");
                renderAlertsHistoryList();
            }
        });
    }
}

// ── Interactive AI financial advisor chatmodal ──
function setupAIAdvisorChat() {
    const btnAsk = document.getElementById("btnAskAI");
    const chatModal = document.getElementById("ai-chat-modal");
    const btnSend = document.getElementById("btnSendChat");
    const textInput = document.getElementById("chat-input-text");
    const chatMessages = document.getElementById("chat-messages-container");

    if (!btnAsk || !chatModal || !btnSend || !textInput || !chatMessages) return;

    btnAsk.addEventListener("click", () => {
        chatModal.classList.add("active");
    });

    function sendMessage() {
        const text = textInput.value.trim();
        if (!text) return;

        // Append User bubble
        const userBubble = document.createElement("div");
        userBubble.className = "chat-bubble user";
        userBubble.textContent = text;
        chatMessages.appendChild(userBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        textInput.value = "";

        // Generate dynamic mock AI response depending on user keywords
        setTimeout(() => {
            const aiBubble = document.createElement("div");
            aiBubble.className = "chat-bubble ai";

            // Compute current stats to mention in advice
            const JuneTxns = state.transactions.filter(t => t.date.startsWith("2026-06"));
            let totalIncome = 0;
            let totalExpenses = 0;
            JuneTxns.forEach(t => {
                if (t.type === "Income") totalIncome += t.amount;
                else totalExpenses += t.amount;
            });
            const rate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

            let response = "That's a great question. Looking at your current June statistics, you've spent " + formatCurrency(totalExpenses) + " out of an income of " + formatCurrency(totalIncome) + ". Your savings rate is " + rate + "%. ";
            
            const lowerText = text.toLowerCase();
            if (lowerText.includes("save") || lowerText.includes("savings") || lowerText.includes("invest")) {
                response += "To increase your savings, try lowering non-essential categories like 'Shopping' or 'Entertainment'. Setting up automated transfers to your 'Emergency Fund' savings goal on payday is also highly recommended!";
            } else if (lowerText.includes("food") || lowerText.includes("eat") || lowerText.includes("grocery")) {
                response += "Food purchases are typically variable. Consider reducing food delivery and planning meal preps for weekdays. This single change can lower your weekly food budget by up to 25%!";
            } else if (lowerText.includes("budget") || lowerText.includes("limit") || lowerText.includes("over")) {
                response += "It looks like you set limits on 7 categories. Review your 'Budget' settings view. If you keep exceeding category limits, try splitting targets weekly rather than monthly to keep check.";
            } else if (lowerText.includes("salary") || lowerText.includes("earn") || lowerText.includes("income")) {
                response += "Your core income is ₹85,000. Any freelance work or investments (e.g. ₹15,000 from web dev) increases your net balance directly. Aim to direct 100% of side earnings to your Savings Goals!";
            } else {
                response += "To optimize your cash flow, prioritize fully funding your 'Emergency Fund' goal. Once that meets 6 months of expenses, allocate extra funds to 'Vacation' or investments to grow your net worth.";
            }

            aiBubble.textContent = response;
            chatMessages.appendChild(aiBubble);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);
    }

    btnSend.addEventListener("click", sendMessage);
    textInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
}

// ── Export transactions ledger to CSV format ──
function setupExportCSV() {
    const btn = document.getElementById("btnExport");
    if (!btn) return;

    btn.addEventListener("click", () => {
        if (state.transactions.length === 0) {
            showToast("No transaction ledger items to export!");
            return;
        }

        // CSV Headers
        let csvContent = "data:text/csv;charset=utf-8,ID,Type,Description,Amount,Category,Date\n";

        // Append items row-wise
        state.transactions.forEach(t => {
            const escapedDesc = t.description.replace(/"/g, '""');
            csvContent += `${t.id},${t.type},"${escapedDesc}",${t.amount},${t.category},${t.date}\n`;
        });

        // Trigger download attachment link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Expense_Tracker_Transactions_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast("CSV Export downloaded!");
    });
}

// ── Setup Form Expense / Income toggling visual classes ──
function setupFormToggle() {
    const btnExpense = document.getElementById("toggle-expense");
    const btnIncome = document.getElementById("toggle-income");
    const submitBtn = document.getElementById("btnSubmitTxn");

    if (!btnExpense || !btnIncome || !submitBtn) return;

    btnExpense.addEventListener("click", () => {
        btnExpense.classList.add("active");
        btnIncome.classList.remove("active");
        state.currentFormType = "Expense";
        submitBtn.style.background = "linear-gradient(135deg, var(--expense-color) 0%, #f87171 100%)";
        submitBtn.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
        loadFormCategories();
    });

    btnIncome.addEventListener("click", () => {
        btnIncome.classList.add("active");
        btnExpense.classList.remove("active");
        state.currentFormType = "Income";
        submitBtn.style.background = "linear-gradient(135deg, var(--income-color) 0%, #34d399 100%)";
        submitBtn.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.3)";
        loadFormCategories();
    });

    // Default Submit buttons styling state
    submitBtn.style.background = "linear-gradient(135deg, var(--expense-color) 0%, #f87171 100%)";
    submitBtn.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
}

function initApp() {
    initAuth();
    setupAuthForms();
    setupSidebarRouter();
    setupFormToggle();
    setupModals();
    setupAIAdvisorChat();
    setupExportCSV();

    const session = localStorage.getItem("fintrack_session");
    if (session) {
        state.currentUser = session;
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("app-container").style.display = "flex";
        
        loadState();
        
        const userAvatar = document.querySelector(".user-avatar");
        if (userAvatar && state.settings.username) {
            userAvatar.textContent = state.settings.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            userAvatar.title = `Profile: ${state.settings.username}`;
        }
        
        refreshActiveView();
    } else {
        document.getElementById("auth-container").style.display = "flex";
        document.getElementById("app-container").style.display = "none";
    }
}

// ── Initial Bootstrapper ──
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
