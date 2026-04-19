// LeatherCraft Universal Theme, Auth & Profile Manager
// Works with the new Material Design 3 UI

// ─── 1. Theme Setup ───────────────────────────────────────────────────────────
(function applyThemeImmediately() {
    const stored = localStorage.getItem('leathercraft_theme') || 'light';
    if (stored === 'dark') {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
})();

// ─── 2. Wire Theme Toggle Buttons ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Find all theme toggle buttons (they contain 'light_mode' or 'dark_mode' icon text)
    const themeButtons = document.querySelectorAll('button.material-symbols-outlined, button > span.material-symbols-outlined');

    // Collect all buttons that are theme toggles
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        const text = btn.textContent.trim();
        if (text === 'light_mode' || text === 'dark_mode') {
            updateThemeIcon(btn);
            btn.addEventListener('click', () => {
                const isDark = document.documentElement.classList.contains('dark');
                if (isDark) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    localStorage.setItem('leathercraft_theme', 'light');
                } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('leathercraft_theme', 'dark');
                }
                updateThemeIcon(btn);
            });
        }

        // Wire account_circle button → navigate to profile.html
        if (text === 'account_circle') {
            btn.addEventListener('click', () => {
                const inPages = window.location.pathname.includes('/pages/');
                if (!localStorage.getItem('leathercraft_user')) {
                    window.location.href = inPages ? 'auth.html' : 'pages/auth.html';
                } else {
                    window.location.href = inPages ? 'profile.html' : 'pages/profile.html';
                }
            });
        }
    });
});

function updateThemeIcon(btn) {
    const isDark = document.documentElement.classList.contains('dark');
    btn.textContent = isDark ? 'dark_mode' : 'light_mode';
}

// ─── 3. Profile Modal ─────────────────────────────────────────────────────────
function injectProfileModal() {
    if (document.getElementById('profileModal')) return; // already injected

    const user = JSON.parse(localStorage.getItem('leathercraft_user') || '{}');

    const modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'hidden fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[200] backdrop-blur-sm';
    modal.innerHTML = `
        <div id="profileModalInner" class="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-2xl p-8 w-full max-w-md transform scale-95 transition-all duration-300">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h2 class="font-serif text-2xl font-bold text-primary">Artisan Profile</h2>
                    <p class="text-sm text-on-surface-variant mt-1">${user.name || 'Unknown'} · <span class="font-bold text-secondary">${user.role || 'Artisan'}</span></p>
                </div>
                <button id="closeProfileBtn" class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">close</button>
            </div>

            <form id="profileForm" class="space-y-6">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Currency Preference</label>
                    <select id="prefCurrency" class="w-full bg-surface-container-low border-b-2 border-outline-variant/30 py-3 px-0 text-on-surface focus:outline-none focus:border-secondary transition-all text-sm font-bold">
                        <option value="USD">USD ($) — US Dollar</option>
                        <option value="INR">INR (₹) — Indian Rupee</option>
                        <option value="EUR">EUR (€) — Euro</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Change Password</label>
                    <input type="password" id="prefPassword" placeholder="Leave blank to keep unchanged"
                        class="w-full bg-surface-container-low border-b-2 border-outline-variant/30 py-3 px-0 text-on-surface focus:outline-none focus:border-secondary transition-all text-sm">
                </div>
                <p id="profileMsg" class="text-xs text-center hidden"></p>
                <div class="flex gap-4 pt-4">
                    <button type="button" id="logoutBtn" class="flex-1 py-3 border border-error/30 text-error font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-error/5 transition-all">
                        Sign Out
                    </button>
                    <button type="submit" class="flex-1 py-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-lg hover:opacity-90 transition-all">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Populate currency from stored user
    const storedUser = JSON.parse(localStorage.getItem('leathercraft_user') || '{}');
    document.getElementById('prefCurrency').value = storedUser.currency || 'USD';

    // Close button
    document.getElementById('closeProfileBtn').addEventListener('click', () => closeProfileModal());
    modal.addEventListener('click', (e) => { if (e.target === modal) closeProfileModal(); });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('leathercraft_token');
        localStorage.removeItem('leathercraft_user');
        window.location.href = window.location.pathname.includes('/pages/') ? 'auth.html' : 'pages/auth.html';
    });

    // Submit
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const currency = document.getElementById('prefCurrency').value;
        const password = document.getElementById('prefPassword').value;
        const msg = document.getElementById('profileMsg');

        try {
            const payload = { currency };
            if (password) payload.password = password;
            const res = await window.api.updateProfile(payload);

            const currentUser = JSON.parse(localStorage.getItem('leathercraft_user') || '{}');
            currentUser.currency = res.currency;
            localStorage.setItem('leathercraft_user', JSON.stringify(currentUser));

            msg.textContent = '✓ Profile updated!';
            msg.className = 'text-xs text-center text-secondary font-bold';
            msg.classList.remove('hidden');
            setTimeout(() => { closeProfileModal(); window.location.reload(); }, 1200);
        } catch (err) {
            msg.textContent = 'Error: ' + err.message;
            msg.className = 'text-xs text-center text-error font-bold';
            msg.classList.remove('hidden');
        }
    });
}

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    const inner = document.getElementById('profileModalInner');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => { inner && inner.classList.replace('scale-95', 'scale-100'); }, 10);
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    const inner = document.getElementById('profileModalInner');
    if (!modal) return;
    inner && inner.classList.replace('scale-100', 'scale-95');
    setTimeout(() => modal.classList.add('hidden'), 250);
}

// ─── 4. Currency Helper ───────────────────────────────────────────────────────
window.getCurrencySymbol = () => {
    const user = JSON.parse(localStorage.getItem('leathercraft_user') || '{}');
    if (user.currency === 'INR') return '₹';
    if (user.currency === 'EUR') return '€';
    return '$';
};

// ─── 5. Auth Guard ────────────────────────────────────────────────────────────
window.requireAuth = () => {
    const token = localStorage.getItem('leathercraft_token');
    if (!token) {
        const inPages = window.location.pathname.includes('/pages/');
        window.location.href = inPages ? 'auth.html' : 'pages/auth.html';
        return false;
    }
    return true;
};

// ─── 6. Get logged in user ────────────────────────────────────────────────────
window.getCurrentUser = () => {
    const str = localStorage.getItem('leathercraft_user');
    return str ? JSON.parse(str) : null;
};
