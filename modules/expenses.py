"""
Expense Management module — Add, Edit, Delete, View expenses.
"""

# pyrefly: ignore [missing-import]
import streamlit as st
import pandas as pd
from datetime import datetime, date
from database.db import add_expense, get_expenses, update_expense, delete_expense
from utils.helpers import EXPENSE_CATEGORIES, CATEGORY_ICONS, format_currency


def show_expenses(user_id: int):
    """Render the Expenses management page."""
    st.title("💸 Expense Management")
    st.markdown("---")

    tab_add, tab_view = st.tabs(["➕ Add Expense", "📋 View & Manage"])

    # ── Add Expense Tab ───────────────────────────────────────
    with tab_add:
        with st.form("add_expense_form", clear_on_submit=True):
            st.subheader("Add New Expense")

            col1, col2 = st.columns(2)
            with col1:
                title = st.text_input("Title", placeholder="e.g. Grocery shopping")
                category = st.selectbox("Category", EXPENSE_CATEGORIES)
                expense_date = st.date_input("Date", value=date.today())
            with col2:
                amount = st.number_input("Amount (₹)", min_value=0.0, step=10.0, format="%.2f")
                notes = st.text_area("Notes (optional)", placeholder="Any additional details...", height=120)

            submitted = st.form_submit_button("💾 Add Expense", use_container_width=True)
            if submitted:
                if not title:
                    st.error("Please enter a title.")
                elif amount <= 0:
                    st.error("Amount must be greater than zero.")
                else:
                    add_expense(user_id, title, category, amount, expense_date.strftime("%Y-%m-%d"), notes)
                    st.success(f"Expense '{title}' added successfully! ✅")
                    st.rerun()

    # ── View & Manage Tab ─────────────────────────────────────
    with tab_view:
        expenses = get_expenses(user_id)

        if not expenses:
            st.info("No expenses recorded yet. Add your first expense above!")
            return

        df = pd.DataFrame(expenses)
        df["date"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d")

        # ── Filters ───────────────────────────────────────────
        st.subheader("🔍 Filter Expenses")
        fc1, fc2 = st.columns(2)
        with fc1:
            filter_cat = st.multiselect("Filter by Category", EXPENSE_CATEGORIES, default=EXPENSE_CATEGORIES)
        with fc2:
            date_range = st.date_input("Date Range", value=[], key="expense_date_range")

        filtered = df[df["category"].isin(filter_cat)]
        if len(date_range) == 2:
            start, end = date_range
            filtered = filtered[
                (filtered["date"] >= start.strftime("%Y-%m-%d"))
                & (filtered["date"] <= end.strftime("%Y-%m-%d"))
            ]

        # ── Summary row ──────────────────────────────────────
        total = filtered["amount"].sum()
        st.markdown(
            f"**Showing {len(filtered)} expense(s) — Total: {format_currency(total)}**"
        )

        # ── Data table ────────────────────────────────────────
        display_df = filtered[["id", "title", "category", "amount", "date", "notes"]].copy()
        display_df.columns = ["ID", "Title", "Category", "Amount (₹)", "Date", "Notes"]
        st.dataframe(display_df, use_container_width=True, hide_index=True)

        st.markdown("---")

        # ── Edit / Delete ────────────────────────────────────
        col_edit, col_delete = st.columns(2)

        with col_edit:
            st.subheader("✏️ Edit Expense")
            expense_ids = filtered["id"].tolist()
            if expense_ids:
                edit_id = st.selectbox("Select Expense ID to Edit", expense_ids, key="edit_exp_id")
                row = filtered[filtered["id"] == edit_id].iloc[0]

                with st.form("edit_expense_form"):
                    new_title = st.text_input("Title", value=row["title"])
                    new_category = st.selectbox(
                        "Category",
                        EXPENSE_CATEGORIES,
                        index=EXPENSE_CATEGORIES.index(row["category"]),
                    )
                    new_amount = st.number_input("Amount (₹)", value=float(row["amount"]), min_value=0.0, step=10.0)
                    new_date = st.date_input("Date", value=datetime.strptime(row["date"], "%Y-%m-%d").date())
                    new_notes = st.text_input("Notes", value=row["notes"] if row["notes"] else "")
                    update_btn = st.form_submit_button("💾 Update Expense", use_container_width=True)

                    if update_btn:
                        update_expense(edit_id, new_title, new_category, new_amount, new_date.strftime("%Y-%m-%d"), new_notes)
                        st.success("Expense updated! ✅")
                        st.rerun()

        with col_delete:
            st.subheader("🗑️ Delete Expense")
            if expense_ids:
                del_id = st.selectbox("Select Expense ID to Delete", expense_ids, key="del_exp_id")
                del_row = filtered[filtered["id"] == del_id].iloc[0]
                st.warning(
                    f"**{del_row['title']}** — {format_currency(del_row['amount'])} on {del_row['date']}"
                )
                if st.button("🗑️ Confirm Delete", key="del_exp_btn", use_container_width=True):
                    delete_expense(del_id)
                    st.success("Expense deleted! ✅")
                    st.rerun()
