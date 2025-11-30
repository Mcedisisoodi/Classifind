import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://vmgpyjpbxfvnttnjbpsa.supabase.co";
const SUPABASE_KEY = "sb_publishable_eFTbKKlL1mileWxBduPXDQ_zZDUAtOW";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabaseClient = supabaseClient;

// --- Auth Functions ---

export async function signUp(email, password, metadata) {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
        },
    });
    return { data, error };
}

export async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function resetPassword(email) {
    // Note: This sends a password reset link to the email.
    // The user must click the link to be redirected back to the site to set a new password.
    // Ensure 'https://classifind.netlify.app' is in your Supabase Redirect URLs.
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://classifind.netlify.app',
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    return { error };
}

export async function getSession() {
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
}

// --- UI Helpers ---

export function updateAuthUI(session) {
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const headerActions = document.querySelector(".header-actions");

    // Remove existing user menu if any
    const existingUserMenu = document.getElementById("userMenu");
    if (existingUserMenu) existingUserMenu.remove();

    if (session) {
        if (loginBtn) loginBtn.style.display = "none";
        if (signupBtn) signupBtn.style.display = "none";

        const userMenu = document.createElement("div");
        userMenu.id = "userMenu";
        userMenu.style.display = "flex";
        userMenu.style.alignItems = "center";
        userMenu.style.gap = "10px";

        const userEmail = document.createElement("span");
        userEmail.textContent = session.user.email;
        userEmail.style.fontSize = "0.9rem";
        userEmail.style.color = "#fff";

        const logoutBtn = document.createElement("button");
        logoutBtn.className = "btn";
        logoutBtn.textContent = "Logout";
        logoutBtn.onclick = async () => {
            await signOut();
            window.location.reload();
        };

        userMenu.appendChild(userEmail);
        userMenu.appendChild(logoutBtn);
        
        // Insert before the "Post Ad" button
        const postAdBtn = document.getElementById("postAdBtn");
        if (postAdBtn && postAdBtn.parentNode) {
            postAdBtn.parentNode.insertBefore(userMenu, postAdBtn);
        } else {
            headerActions.appendChild(userMenu);
        }
    } else {
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (signupBtn) signupBtn.style.display = "inline-block";
    }
}

// Password Toggle Logic
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-password');
    if (btn) {
        const input = btn.previousElementSibling;
        if (input && input.tagName === 'INPUT') {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            btn.textContent = type === 'password' ? '👁️' : '🙈';
        }
    }
});

// Initialize Auth State Listener
supabaseClient.auth.onAuthStateChange((event, session) => {
    updateAuthUI(session);
});

// Check initial session
getSession().then(session => {
    updateAuthUI(session);
});
