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
    // Ensure 'https://honeysweetpot.netlify.app' is in your Supabase Redirect URLs.
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://honeysweetpot.netlify.app',
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
    const logo = document.querySelector(".logo");

    // Remove existing user menu if any
    const existingUserMenu = document.getElementById("userMenu");
    if (existingUserMenu) existingUserMenu.remove();

    // Handle My Account Link in Logo
    let myAccountLink = document.getElementById("myAccountLinkLogo");

    if (session) {
        if (loginBtn) loginBtn.style.display = "none";
        if (signupBtn) signupBtn.style.display = "none";

        const userMenu = document.createElement("div");
        userMenu.id = "userMenu";
        userMenu.style.display = "flex";
        userMenu.style.alignItems = "center";
        userMenu.style.gap = "10px";

        // 👇 Build "Hi username" instead of showing the email
        const userGreeting = document.createElement("span");
        userGreeting.id = "userGreeting";
        userGreeting.className = "user-greeting";
        userGreeting.style.fontSize = "0.9rem";
        userGreeting.style.color = "#fff";
        userGreeting.style.fontWeight = "700"; // ← Make it bold

        const rawUsername =
            session.user.user_metadata?.username &&
            session.user.user_metadata.username.trim().length > 0
                ? session.user.user_metadata.username.trim()
                : (session.user.email || "").split("@")[0];

        userGreeting.textContent = `Hi ${rawUsername}`;
        const logoutBtn = document.createElement("button");
        logoutBtn.className = "btn";
        logoutBtn.textContent = "Logout";
        logoutBtn.onclick = async () => {
            await signOut();
            window.location.reload();
        };

        userMenu.appendChild(userGreeting);

        // Admin Link Check
        if (session.user.email && session.user.email.toLowerCase() === "compsody@gmail.com") {
            const adminLink = document.createElement("a");
            adminLink.href = "admin.html";
            adminLink.className = "btn";
            adminLink.textContent = "Admin Panel";
            adminLink.style.backgroundColor = "#333";
            adminLink.style.border = "1px solid #333";
            userMenu.appendChild(adminLink);
        } else {
            // Regular User Link
            const myAdsLink = document.createElement("a");
            myAdsLink.href = "my-ads.html";
            myAdsLink.className = "btn";
            myAdsLink.textContent = "My Ads";
            myAdsLink.style.backgroundColor = "#00008B"; // Match theme
            myAdsLink.style.color = "#fff";
            myAdsLink.style.border = "1px solid #00008B";
            userMenu.appendChild(myAdsLink);
        }

        userMenu.appendChild(logoutBtn);
        
        // Insert before the "Post Ad" button
        const postAdBtn = document.getElementById("postAdBtn");
        if (postAdBtn && postAdBtn.parentNode) {
            postAdBtn.parentNode.insertBefore(userMenu, postAdBtn);
        } else {
            headerActions.appendChild(userMenu);
        }

        // --- Inject My Account Link below Logo ---
        if (logo) {
            // Ensure logo structure is prepared for vertical stacking
            if (!logo.classList.contains('modified-for-auth')) {
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.gap = '6px'; // Maintain original gap
                
                // Move all current children to wrapper
                while (logo.firstChild) {
                    wrapper.appendChild(logo.firstChild);
                }
                logo.appendChild(wrapper);
                logo.classList.add('modified-for-auth');
                
                // Change logo to column
                logo.style.flexDirection = 'column';
                logo.style.alignItems = 'flex-start';
            }

            if (!myAccountLink) {
                myAccountLink = document.createElement('a');
                myAccountLink.id = 'myAccountLinkLogo';
                myAccountLink.href = 'my-account.html';
                myAccountLink.textContent = 'My Account';
                // Styling
                myAccountLink.style.fontSize = '0.75rem';
                myAccountLink.style.color = '#FFDB58'; // Match the 'Pot' color
                myAccountLink.style.textDecoration = 'none';
                myAccountLink.style.fontWeight = '600';
                myAccountLink.style.marginTop = '2px';
                myAccountLink.style.border = '1px solid #FFDB58';
                myAccountLink.style.borderRadius = '12px';
                myAccountLink.style.padding = '2px 8px';
                
                myAccountLink.addEventListener('mouseenter', () => {
                    myAccountLink.style.backgroundColor = 'rgba(255, 219, 88, 0.2)';
                });
                myAccountLink.addEventListener('mouseleave', () => {
                    myAccountLink.style.backgroundColor = 'transparent';
                });

                logo.appendChild(myAccountLink);
            }
        }

    } else {
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (signupBtn) signupBtn.style.display = "inline-block";

        // Remove My Account link if exists
        if (myAccountLink) {
            myAccountLink.remove();
        }
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
