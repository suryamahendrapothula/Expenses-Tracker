"""
Smart Spending Insights module — Rule-based financial recommendations.
"""

# pyrefly: ignore [missing-import]
import streamlit as st
from database.db import get_total_expenses, get_total_income, get_expenses_by_category
from utils.helpers import format_currency, get_current_month, savings_percentage


# ── Insight Rules ─────────────────────────────────────────────
RULES = [
    {
        "category": "Food",
        "threshold": 40,
        "icon": "🍔",
        "message": "Your food spending is relatively high at {pct:.1f}% of total expenses. Consider meal prepping or reducing restaurant visits to save more.",
        "level": "warning",
    },
    {
        "category": "Shopping",
        "threshold": 30,
        "icon": "🛍️",
        "message": "Shopping expenses are at {pct:.1f}%, exceeding recommended limits. Try making a shopping list and sticking to it.",
        "level": "warning",
    },
    {
        "category": "Entertainment",
        "threshold": 25,
        "icon": "🎮",
        "message": "Entertainment spending is high at {pct:.1f}%. Look for free or low-cost activities to enjoy.",
        "level": "warning",
    },
    {
        "category": "Travel",
        "threshold": 30,
        "icon": "✈️",
        "message": "Travel expenses account for {pct:.1f}% of spending. Consider carpooling or using public transport.",
        "level": "info",
    },
    {
        "category": "Bills",
        "threshold": 40,
        "icon": "📄",
        "message": "Bills take up {pct:.1f}% of your expenses. Review subscriptions and negotiate rates where possible.",
        "level": "info",
    },
    {
        "category": "Health",
        "threshold": 5,
        "icon": "💊",
        "message": "Health spending is only {pct:.1f}%. It's great to be healthy — keep maintaining your wellness routine!",
        "level": "success",
        "below": True,
    },
]


def show_insights(user_id: int):
    """Render the Smart Insights page."""
    st.title("💡 Smart Spending Insights")
    st.markdown("---")

    current_month = get_current_month()
    total_income = get_total_income(user_id)
    total_expenses = get_total_expenses(user_id)
    cat_data = get_expenses_by_category(user_id, current_month)

    if not cat_data or total_expenses == 0:
        st.info("Not enough data to generate insights. Start adding expenses to get personalized recommendations! 📊")
        return

    savings = savings_percentage(total_income, total_expenses)

    # ── Overall Financial Health ──────────────────────────────
    st.subheader("🏥 Financial Health Score")

    if savings >= 30:
        health_color = "#10b981"
        health_label = "Excellent"
        health_icon = "🌟"
        health_msg = "Outstanding! You're saving more than 30% of your income. Keep it up!"
    elif savings >= 20:
        health_color = "#3b82f6"
        health_label = "Good"
        health_icon = "👍"
        health_msg = "Good job! You're saving a healthy portion of your income."
    elif savings >= 10:
        health_color = "#d97706"
        health_label = "Fair"
        health_icon = "⚠️"
        health_msg = "Your savings rate could be better. Try to cut back on non-essential spending."
    elif savings >= 0:
        health_color = "#ef4444"
        health_label = "Needs Improvement"
        health_icon = "🔴"
        health_msg = "Your savings are low. Review your expenses and identify areas to cut back."
    else:
        health_color = "#ef4444"
        health_label = "Critical"
        health_icon = "🚨"
        health_msg = "You're spending more than you earn! Immediate action needed to reduce expenses."

    st.markdown(
        f"""
        <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(59, 130, 246, 0.05));
                    border-radius: 16px; padding: 24px; border: 1px solid rgba(15, 23, 42, 0.08);
                    margin-bottom: 20px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                <span style="font-size:2rem;">{health_icon}</span>
                <div>
                    <span style="font-size:1.3rem; font-weight:700; color:{health_color};">{health_label}</span>
                    <span style="color:#64748b; margin-left:8px; font-weight: 500;">Savings Rate: {savings:.1f}%</span>
                </div>
            </div>
            <p style="margin:0; color:#334155; font-size:0.95rem; font-weight:500;">{health_msg}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("---")

    # ── Category-wise Insights ────────────────────────────────
    st.subheader("📋 Category Insights")

    cat_dict = {c["category"]: c["total"] for c in cat_data}
    insights_found = 0

    for rule in RULES:
        cat = rule["category"]
        if cat in cat_dict:
            pct = (cat_dict[cat] / total_expenses) * 100
            is_below = rule.get("below", False)

            if (is_below and pct < rule["threshold"]) or (not is_below and pct > rule["threshold"]):
                insights_found += 1
                msg = rule["message"].format(pct=pct)

                if rule["level"] == "warning":
                    st.warning(f"{rule['icon']} **{cat}** — {msg}")
                elif rule["level"] == "info":
                    st.info(f"{rule['icon']} **{cat}** — {msg}")
                elif rule["level"] == "success":
                    st.success(f"{rule['icon']} **{cat}** — {msg}")

    if insights_found == 0:
        st.success("✅ Your spending looks balanced across all categories. Great financial discipline!")

    st.markdown("---")

    # ── Spending Summary Cards ────────────────────────────────
    st.subheader("📊 Category Spending Summary")

    cols = st.columns(min(len(cat_data), 4))
    for idx, c in enumerate(sorted(cat_data, key=lambda x: x["total"], reverse=True)):
        col = cols[idx % len(cols)]
        pct = (c["total"] / total_expenses) * 100
        with col:
            st.markdown(
                f"""
                <div style="background: rgba(255,255,255,0.7); border-radius:12px; padding:16px;
                            border:1px solid rgba(15,23,42,0.06); text-align:center; margin-bottom:12px;
                            box-shadow: 0 4px 15px rgba(15,23,42,0.02);">
                    <div style="font-size:1.1rem; font-weight:600; color:#0f172a; margin-bottom:6px;">{c['category']}</div>
                    <div style="font-size:1.3rem; font-weight:700; color:#7c3aed; margin-bottom:4px;">{format_currency(c['total'])}</div>
                    <div style="font-size:0.85rem; color:#64748b; font-weight:500;">{pct:.1f}% of total</div>
                </div>
                """,
        unsafe_allow_html=True,
    )

    st.markdown("---")

    # ── Quick Tips ────────────────────────────────────────────
    st.subheader("💡 Quick Financial Tips")
    tips = [
        "🎯 **50/30/20 Rule**: Allocate 50% for needs, 30% for wants, and 20% for savings.",
        "📝 **Track Daily**: Log expenses daily so nothing slips through the cracks.",
        "🔄 **Review Monthly**: Check your spending patterns at the end of each month.",
        "🏦 **Emergency Fund**: Aim to save 3-6 months of expenses as an emergency fund.",
        "📉 **Cut Subscriptions**: Review recurring charges and cancel unused services.",
    ]
    for tip in tips:
        st.markdown(tip)
