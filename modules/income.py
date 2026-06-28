"""
Income Management module — Add, Edit, Delete, View income records.
"""

import streamlit as st
import pandas as pd
from datetime import datetime, date
from database.db import add_income, get_incomes, update_income, delete_income
from utils.helpers import INCOME_SOURCES, SOURCE_ICONS, format_currency


def show_income(user_id: int):
    """Render the Income management page."""
    st.title("💰 Income Management")
    st.markdown("---")

    tab_add, tab_view = st.tabs(["➕ Add Income", "📋 View & Manage"])

    # ── Add Income Tab ────────────────────────────────────────
    with tab_add:
        with st.form("add_income_form", clear_on_submit=True):
            st.subheader("Add New Income")

            col1, col2 = st.columns(2)
            with col1:
                source = st.selectbox("Source", INCOME_SOURCES)
                income_date = st.date_input("Date", value=date.today())
            with col2:
                amount = st.number_input("Amount (₹)", min_value=0.0, step=100.0, format="%.2f")

            submitted = st.form_submit_button("💾 Add Income", use_container_width=True)
            if submitted:
                if amount <= 0:
                    st.error("Amount must be greater than zero.")
                else:
                    add_income(user_id, source, amount, income_date.strftime("%Y-%m-%d"))
                    st.success(f"Income from '{source}' added successfully! ✅")
                    st.rerun()

    # ── View & Manage Tab ─────────────────────────────────────
    with tab_view:
        incomes = get_incomes(user_id)

        if not incomes:
            st.info("No income recorded yet. Add your first income above!")
            return

        df = pd.DataFrame(incomes)
        df["date"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d")

        # ── Filters ───────────────────────────────────────────
        st.subheader("🔍 Filter Income")
        fc1, fc2 = st.columns(2)
        with fc1:
            filter_src = st.multiselect("Filter by Source", INCOME_SOURCES, default=INCOME_SOURCES)
        with fc2:
            date_range = st.date_input("Date Range", value=[], key="income_date_range")

        filtered = df[df["source"].isin(filter_src)]
        if len(date_range) == 2:
            start, end = date_range
            filtered = filtered[
                (filtered["date"] >= start.strftime("%Y-%m-%d"))
                & (filtered["date"] <= end.strftime("%Y-%m-%d"))
            ]

        # ── Summary ───────────────────────────────────────────
        total = filtered["amount"].sum()
        st.markdown(f"**Showing {len(filtered)} record(s) — Total: {format_currency(total)}**")

        # ── Data table ────────────────────────────────────────
        display_df = filtered[["id", "source", "amount", "date"]].copy()
        display_df.columns = ["ID", "Source", "Amount (₹)", "Date"]
        st.dataframe(display_df, use_container_width=True, hide_index=True)

        st.markdown("---")

        # ── Edit / Delete ─────────────────────────────────────
        col_edit, col_delete = st.columns(2)

        with col_edit:
            st.subheader("✏️ Edit Income")
            income_ids = filtered["id"].tolist()
            if income_ids:
                edit_id = st.selectbox("Select Income ID to Edit", income_ids, key="edit_inc_id")
                row = filtered[filtered["id"] == edit_id].iloc[0]

                with st.form("edit_income_form"):
                    new_source = st.selectbox(
                        "Source",
                        INCOME_SOURCES,
                        index=INCOME_SOURCES.index(row["source"]),
                    )
                    new_amount = st.number_input("Amount (₹)", value=float(row["amount"]), min_value=0.0, step=100.0)
                    new_date = st.date_input("Date", value=datetime.strptime(row["date"], "%Y-%m-%d").date())
                    update_btn = st.form_submit_button("💾 Update Income", use_container_width=True)

                    if update_btn:
                        update_income(edit_id, new_source, new_amount, new_date.strftime("%Y-%m-%d"))
                        st.success("Income updated! ✅")
                        st.rerun()

        with col_delete:
            st.subheader("🗑️ Delete Income")
            if income_ids:
                del_id = st.selectbox("Select Income ID to Delete", income_ids, key="del_inc_id")
                del_row = filtered[filtered["id"] == del_id].iloc[0]
                st.warning(
                    f"**{del_row['source']}** — {format_currency(del_row['amount'])} on {del_row['date']}"
                )
                if st.button("🗑️ Confirm Delete", key="del_inc_btn", use_container_width=True):
                    delete_income(del_id)
                    st.success("Income deleted! ✅")
                    st.rerun()
