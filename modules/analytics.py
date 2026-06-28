"""
Analytics module — Pie, Bar, and Line charts using Plotly.
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from database.db import get_expenses, get_expenses_by_category, get_monthly_expense_trend
from utils.helpers import EXPENSE_CATEGORIES, format_currency


def show_analytics(user_id: int):
    """Render the Analytics page with interactive charts."""
    st.title("📊 Analytics")
    st.markdown("---")

    expenses = get_expenses(user_id)

    if not expenses:
        st.info("No expense data available yet. Start adding expenses to see analytics! 📈")
        return

    df = pd.DataFrame(expenses)
    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.strftime("%Y-%m")

    # ── Date Range Filter ─────────────────────────────────────
    st.subheader("🔍 Filter Period")
    available_months = sorted(df["month"].unique(), reverse=True)

    col1, col2 = st.columns(2)
    with col1:
        selected_months = st.multiselect(
            "Select Months",
            available_months,
            default=available_months[:3] if len(available_months) >= 3 else available_months,
        )
    with col2:
        st.markdown("")  # spacer

    if selected_months:
        filtered = df[df["month"].isin(selected_months)]
    else:
        filtered = df

    if filtered.empty:
        st.warning("No data for the selected period.")
        return

    total_filtered = filtered["amount"].sum()
    st.markdown(f"**Total Expenses in selected period: {format_currency(total_filtered)}**")
    st.markdown("---")

    # ── Charts Layout ─────────────────────────────────────────
    chart1, chart2 = st.columns(2)

    # ── Pie Chart — Category-wise breakdown ───────────────────
    with chart1:
        st.subheader("🍩 Category Breakdown")
        cat_group = filtered.groupby("category")["amount"].sum().reset_index()
        cat_group.columns = ["Category", "Amount"]

        fig_pie = px.pie(
            cat_group,
            values="Amount",
            names="Category",
            hole=0.5,
            color_discrete_sequence=["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#06b6d4"],
        )
        fig_pie.update_traces(
            textposition="inside",
            textinfo="percent+label",
            marker=dict(line=dict(color="#ffffff", width=2))
        )
        fig_pie.update_layout(
            showlegend=True,
            legend=dict(orientation="h", yanchor="bottom", y=-0.2, font=dict(color="#334155")),
            margin=dict(t=20, b=20, l=20, r=20),
            height=400,
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            font=dict(color="#334155", family="Plus Jakarta Sans, sans-serif"),
        )
        st.plotly_chart(fig_pie, use_container_width=True)

    # ── Bar Chart — Category comparison ───────────────────────
    with chart2:
        st.subheader("📊 Category Comparison")
        fig_bar = px.bar(
            cat_group.sort_values("Amount", ascending=True),
            x="Amount",
            y="Category",
            orientation="h",
            color="Amount",
            color_continuous_scale=["#3b82f6", "#7c3aed", "#a855f7"],
        )
        fig_bar.update_layout(
            showlegend=False,
            coloraxis_showscale=False,
            margin=dict(t=20, b=20, l=20, r=20),
            height=400,
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            xaxis=dict(
                showgrid=True,
                gridcolor="rgba(15,23,42,0.08)",
                title_font=dict(color="#334155"),
                tickfont=dict(color="#475569")
            ),
            yaxis=dict(
                showgrid=False,
                tickfont=dict(color="#475569")
            ),
            font=dict(color="#334155", family="Plus Jakarta Sans, sans-serif"),
        )
        st.plotly_chart(fig_bar, use_container_width=True)

    st.markdown("---")

    # ── Line Chart — Monthly Spending Trend ───────────────────
    st.subheader("📈 Monthly Spending Trend")
    trend_data = get_monthly_expense_trend(user_id)

    if trend_data:
        df_trend = pd.DataFrame(trend_data)
        fig_line = go.Figure()
        fig_line.add_trace(
            go.Scatter(
                x=df_trend["month"],
                y=df_trend["total"],
                mode="lines+markers",
                line_shape="spline",
                name="Expenses",
                line=dict(color="#a855f7", width=4),
                marker=dict(
                    size=8,
                    color="#7c3aed",
                    line=dict(color="#ffffff", width=1.5)
                ),
                fill="tozeroy",
                fillcolor="rgba(168, 85, 247, 0.08)",
            )
        )
        fig_line.update_layout(
            margin=dict(t=20, b=20, l=20, r=20),
            height=350,
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            xaxis=dict(
                title="Month",
                showgrid=True,
                gridcolor="rgba(15,23,42,0.08)",
                title_font=dict(color="#334155"),
                tickfont=dict(color="#475569")
            ),
            yaxis=dict(
                title="Amount (₹)",
                showgrid=True,
                gridcolor="rgba(15,23,42,0.08)",
                title_font=dict(color="#334155"),
                tickfont=dict(color="#475569")
            ),
            font=dict(color="#334155", family="Plus Jakarta Sans, sans-serif"),
            hovermode="x unified",
        )
        st.plotly_chart(fig_line, use_container_width=True)
    else:
        st.info("Not enough data to show trends yet.")

    st.markdown("---")

    # ── Top Expenses Table ────────────────────────────────────
    st.subheader("🏆 Top 5 Expenses")
    top5 = filtered.nlargest(5, "amount")[["title", "category", "amount", "date"]].copy()
    top5["date"] = top5["date"].dt.strftime("%Y-%m-%d")
    top5.columns = ["Title", "Category", "Amount (₹)", "Date"]
    st.dataframe(top5, use_container_width=True, hide_index=True)
