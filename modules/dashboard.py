"""
Dashboard module — Financial overview with metrics and recent transactions.
"""

import streamlit as st
import pandas as pd
import plotly.express as px
from database.db import get_total_income, get_total_expenses, get_recent_transactions, get_expenses_by_category, get_monthly_income, get_monthly_expenses
from utils.helpers import format_currency, get_current_month, savings_percentage, CATEGORY_ICONS


def show_dashboard(user_id: int):
    """Render the main dashboard page."""
    st.title("🏠 Dashboard")
    st.markdown("---")

    current_month = get_current_month()

    # ── All-time totals ───────────────────────────────────────
    total_income = get_total_income(user_id)
    total_expenses = get_total_expenses(user_id)
    balance = total_income - total_expenses
    savings_pct = savings_percentage(total_income, total_expenses)

    # ── Monthly totals ────────────────────────────────────────
    monthly_income = get_monthly_income(user_id, current_month)
    monthly_expenses = get_monthly_expenses(user_id, current_month)

    # ── Metric Cards ──────────────────────────────────────────
    st.subheader("📊 Overall Summary")
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Total Income", format_currency(total_income))
    with col2:
        st.metric("Total Expenses", format_currency(total_expenses))
    with col3:
        st.metric("Balance", format_currency(balance))
    with col4:
        st.metric("Savings", f"{savings_pct}%")

    st.markdown("---")

    # ── Monthly Summary ───────────────────────────────────────
    st.subheader(f"📅 This Month ({current_month})")
    m1, m2, m3 = st.columns(3)
    with m1:
        st.metric("Monthly Income", format_currency(monthly_income))
    with m2:
        st.metric("Monthly Expenses", format_currency(monthly_expenses))
    with m3:
        monthly_balance = monthly_income - monthly_expenses
        st.metric("Monthly Balance", format_currency(monthly_balance))

    st.markdown("---")

    # ── Layout: Chart + Recent Transactions ───────────────────
    chart_col, trans_col = st.columns([1, 1])

    with chart_col:
        st.subheader("🍩 Expense Breakdown")
        cat_data = get_expenses_by_category(user_id, current_month)
        if cat_data:
            df_cat = pd.DataFrame(cat_data)
            fig = px.pie(
                df_cat,
                values="total",
                names="category",
                hole=0.55,
                color_discrete_sequence=["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#06b6d4"],
            )
            fig.update_traces(
                textposition="inside",
                textinfo="percent+label",
                marker=dict(line=dict(color="#ffffff", width=2))
            )
            fig.update_layout(
                showlegend=False,
                margin=dict(t=20, b=20, l=20, r=20),
                height=350,
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                font=dict(color="#334155", family="Plus Jakarta Sans, sans-serif"),
            )
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No expenses recorded this month yet.")

    with trans_col:
        st.subheader("🕐 Recent Transactions")
        transactions = get_recent_transactions(user_id, limit=8)
        if transactions:
            for txn in transactions:
                icon = "🟢" if txn["type"] == "Income" else "🔴"
                sign = "+" if txn["type"] == "Income" else "-"
                st.markdown(
                    f"""
                    <div style="display:flex; justify-content:space-between; align-items:center;
                                padding:12px 18px; margin:8px 0; border-radius:12px;
                                background: rgba(255, 255, 255, 0.7); border:1px solid rgba(15, 23, 42, 0.06);
                                transition: transform 0.2s ease; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.02);">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <span style="font-size:1.2rem;">{icon}</span>
                            <div>
                                <div style="font-weight:600; color:#0f172a; font-size:0.95rem;">{txn['description']}</div>
                                <div style="color:#64748b; font-size:0.8rem; margin-top:2px; font-weight:500;">{txn['date']}</div>
                            </div>
                        </div>
                        <span style="font-weight:700; font-size:1.05rem; color:{'#10b981' if txn['type']=='Income' else '#ec4899'};">
                            {sign}{format_currency(txn['amount'])}
                        </span>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
        else:
            st.info("No transactions recorded yet. Start adding income and expenses!")
