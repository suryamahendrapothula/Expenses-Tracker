"""
Authentication module — Registration, Login, Logout, Session management.
"""

import streamlit as st
import bcrypt
from database.db import create_user, get_user_by_username


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its bcrypt hash."""
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def init_session():
    """Initialize session state defaults."""
    defaults = {
        "logged_in": False,
        "user_id": None,
        "username": None,
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


def login_user(user_id: int, username: str):
    """Set session state on successful login."""
    st.session_state["logged_in"] = True
    st.session_state["user_id"] = user_id
    st.session_state["username"] = username


def logout_user():
    """Clear session state on logout."""
    st.session_state["logged_in"] = False
    st.session_state["user_id"] = None
    st.session_state["username"] = None


def show_auth_page():
    """Render the Login / Register page."""
    # Inject marker and background mesh
    st.markdown(
        """
        <div class="auth-page-marker"></div>
        <div class="auth-bg-glow-mesh">
            <div class="auth-mesh-glow-1"></div>
            <div class="auth-mesh-glow-2"></div>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    # Inject brand header
    st.markdown(
        """
        <div class="custom-auth-header">
            <div class="custom-auth-brand">
                <span class="custom-brand-emoji">💰</span>
                <span class="custom-brand-name">Expense Tracker</span>
            </div>
            <p class="custom-auth-subtitle">Your Ultimate Intelligent Financial Copilot</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    tab_login, tab_register = st.tabs(["🔑 Sign In", "📝 Create Account"])

    # ── Login Tab ─────────────────────────────────────────────
    with tab_login:
        with st.form("login_form", clear_on_submit=False):
            st.markdown('<div class="custom-form-title">Welcome Back</div>', unsafe_allow_html=True)
            username = st.text_input("Username", placeholder="Enter your username", key="login_user")
            password = st.text_input("Password", type="password", placeholder="Enter your password", key="login_pass")
            submitted = st.form_submit_button("Login", use_container_width=True)

            if submitted:
                if not username or not password:
                    st.error("Please fill in all fields.")
                else:
                    user = get_user_by_username(username)
                    if user and verify_password(password, user["password"]):
                        login_user(user["id"], user["username"])
                        st.success(f"Welcome back, {username}! 🎉")
                        st.rerun()
                    else:
                        st.error("Invalid username or password.")

    # ── Register Tab ──────────────────────────────────────────
    with tab_register:
        with st.form("register_form", clear_on_submit=True):
            st.markdown('<div class="custom-form-title">Create Account</div>', unsafe_allow_html=True)
            new_username = st.text_input("Username", placeholder="Choose a username", key="reg_user")
            new_email = st.text_input("Email", placeholder="Enter your email", key="reg_email")
            new_password = st.text_input("Password", type="password", placeholder="Choose a password", key="reg_pass")
            confirm_password = st.text_input(
                "Confirm Password", type="password", placeholder="Re-enter password", key="reg_confirm"
            )
            submitted = st.form_submit_button("Register", use_container_width=True)

            if submitted:
                if not all([new_username, new_email, new_password, confirm_password]):
                    st.error("Please fill in all fields.")
                elif new_password != confirm_password:
                    st.error("Passwords do not match.")
                elif len(new_password) < 6:
                    st.error("Password must be at least 6 characters.")
                else:
                    hashed = hash_password(new_password)
                    success = create_user(new_username, new_email, hashed)
                    if success:
                        st.success("Account created successfully! Please login. ✅")
                    else:
                        st.error("Username or email already exists.")

    # Render a demo credentials hint
    st.markdown(
        """
        <div class="custom-auth-footer-container">
            <div class="custom-auth-footer">
                Demo Account: <strong>admin</strong> / password: <strong>admin</strong>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )
