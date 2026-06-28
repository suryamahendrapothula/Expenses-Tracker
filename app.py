"""
Expense Tracker — Main Application Entry Point
================================================
Run with: streamlit run app.py
"""

import streamlit as st
import os

# ── Page Configuration (must be first Streamlit call) ─────────
st.set_page_config(
    page_title="Expense Tracker",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Load Custom CSS ───────────────────────────────────────────
css_path = os.path.join(os.path.dirname(__file__), "assets", "style.css")
if os.path.exists(css_path):
    with open(css_path) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# ── Initialize Database ──────────────────────────────────────
from database.db import init_db
init_db()

# ── Initialize Session ───────────────────────────────────────
from modules.auth import init_session, show_auth_page, logout_user
init_session()

# ── Auth Gate ─────────────────────────────────────────────────
if not st.session_state["logged_in"]:
    show_auth_page()
    st.stop()

# ── Import Modules (only after auth) ─────────────────────────
from modules.dashboard import show_dashboard
from modules.expenses import show_expenses
from modules.income import show_income
from modules.analytics import show_analytics
from modules.budget import show_budget
from modules.reports import show_reports
from modules.insights import show_insights

# ── Sidebar Navigation ───────────────────────────────────────
with st.sidebar:
    st.markdown(
        f"""
        <div style="text-align:center; padding:16px 0 8px 0;">
            <span style="font-size:2.2rem;">💰</span>
            <h2 style="margin:4px 0 0 0; font-size:1.3rem;">Expense Tracker</h2>
            <p style="color:#aaa; font-size:0.85rem; margin:2px 0 16px 0;">
                Welcome, <strong>{st.session_state['username']}</strong>
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("---")

    page = st.radio(
        "Navigation",
        [
            "🏠 Dashboard",
            "💸 Expenses",
            "💰 Income",
            "📊 Analytics",
            "🎯 Budget",
            "📑 Reports",
            "💡 Insights",
        ],
        label_visibility="collapsed",
    )

    st.markdown("---")

    if st.button("🚪 Logout", use_container_width=True):
        logout_user()
        st.rerun()

    st.markdown(
        """
        <div style="text-align:center; padding:20px 0 0 0; color:#666; font-size:0.75rem;">
            Expense Tracker v1.0<br>
            Built with ❤️ using Streamlit
        </div>
        """,
        unsafe_allow_html=True,
    )

# ── Page Router ───────────────────────────────────────────────
user_id = st.session_state["user_id"]
username = st.session_state["username"]

if page == "🏠 Dashboard":
    show_dashboard(user_id)
elif page == "💸 Expenses":
    show_expenses(user_id)
elif page == "💰 Income":
    show_income(user_id)
elif page == "📊 Analytics":
    show_analytics(user_id)
elif page == "🎯 Budget":
    show_budget(user_id)
elif page == "📑 Reports":
    show_reports(user_id, username)
elif page == "💡 Insights":
    show_insights(user_id)
