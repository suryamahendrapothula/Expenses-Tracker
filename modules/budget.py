"""
Budget Management module — Set monthly budget, track usage, generate alerts.
"""

import streamlit as st
from datetime import datetime
from database.db import set_budget, get_budget, get_monthly_expenses
from utils.helpers import format_currency, get_current_month


def show_budget(user_id: int):
    """Render the Budget Management page."""
    st.title("🎯 Budget Management")
    st.markdown("---")

    current_month = get_current_month()

    # ── Set Budget ────────────────────────────────────────────
    st.subheader("📝 Set Monthly Budget")

    with st.form("set_budget_form"):
        col1, col2 = st.columns(2)
        with col1:
            # Build month options for the next 12 months
            now = datetime.now()
            month_options = []
            for i in range(12):
                m = now.month + i
                y = now.year + (m - 1) // 12
                m = ((m - 1) % 12) + 1
                month_options.append(f"{y}-{m:02d}")

            selected_month = st.selectbox("Month", month_options)
        with col2:
            budget_amount = st.number_input("Budget Amount (₹)", min_value=0.0, step=500.0, format="%.2f")

        submitted = st.form_submit_button("💾 Set Budget", use_container_width=True)
        if submitted:
            if budget_amount <= 0:
                st.error("Budget amount must be greater than zero.")
            else:
                set_budget(user_id, selected_month, budget_amount)
                st.success(f"Budget for {selected_month} set to {format_currency(budget_amount)} ✅")
                st.rerun()

    st.markdown("---")

    # ── Current Month Budget Tracker ──────────────────────────
    st.subheader(f"📊 Budget Tracker — {current_month}")

    budget_data = get_budget(user_id, current_month)
    monthly_expenses = get_monthly_expenses(user_id, current_month)

    if not budget_data:
        st.info("No budget set for this month. Set one above to start tracking! ☝️")
        return

    budget_limit = budget_data["budget_amount"]
    usage_pct = (monthly_expenses / budget_limit * 100) if budget_limit > 0 else 0
    remaining = budget_limit - monthly_expenses

    # ── Metric Cards ──────────────────────────────────────────
    c1, c2, c3 = st.columns(3)
    with c1:
        st.metric("Budget", format_currency(budget_limit))
    with c2:
        st.metric("Spent", format_currency(monthly_expenses))
    with c3:
        st.metric("Remaining", format_currency(max(remaining, 0)))

    st.markdown("")

    # ── Progress Bar ──────────────────────────────────────────
    st.markdown(f"**Usage: {usage_pct:.1f}%**")
    progress_val = min(usage_pct / 100, 1.0)
    st.progress(progress_val)

    # ── Alert System ──────────────────────────────────────────
    st.markdown("")
    if usage_pct >= 100:
        st.error("🚨 **Budget limit exceeded!** You've spent more than your monthly budget.")
    elif usage_pct >= 80:
        st.warning("⚠️ **Warning!** Budget nearly exhausted. You've used {:.1f}% of your budget.".format(usage_pct))
    elif usage_pct >= 50:
        st.info("ℹ️ Half of your budget has been used. ({:.1f}%)".format(usage_pct))
    else:
        st.success("✅ You're within budget. Keep it up! ({:.1f}% used)".format(usage_pct))

    st.markdown("---")

    # ── Visual Gauge ──────────────────────────────────────────
    if usage_pct >= 100:
        bar_color = "#ef4444"
    elif usage_pct >= 80:
        bar_color = "#d97706"
    elif usage_pct >= 50:
        bar_color = "#3b82f6"
    else:
        bar_color = "#10b981"

    st.markdown(
        f"""
        <div style="background: rgba(255, 255, 255, 0.7); border-radius: 16px; padding: 24px; 
                    border: 1px solid rgba(15, 23, 42, 0.06); margin-top: 8px;
                    box-shadow: 0 4px 15px rgba(15, 23, 42, 0.02);">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span style="font-weight:600; color:#0f172a;">Budget Usage</span>
                <span style="font-weight:700; color:{bar_color};">{usage_pct:.1f}%</span>
            </div>
            <div style="background: rgba(15, 23, 42, 0.06); border-radius:10px; height:20px; overflow:hidden;">
                <div style="width:{min(usage_pct, 100):.1f}%; height:100%; background: {bar_color}; 
                            border-radius:10px; transition: width 0.5s ease;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.85rem; color:#64748b; font-weight:500;">
                <span>₹0</span>
                <span>{format_currency(budget_limit)}</span>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
