"""
Reports module — CSV & PDF export.
"""

import streamlit as st
import pandas as pd
import io
from datetime import datetime
from database.db import get_incomes, get_expenses, get_total_income, get_total_expenses, get_expenses_by_category
from utils.helpers import format_currency, get_current_month, savings_percentage


def _generate_pdf(user_id: int, username: str, month: str) -> bytes:
    """Generate a PDF monthly financial summary using ReportLab."""
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    from reportlab.lib.units import inch

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    elements = []

    # ── Custom Styles ─────────────────────────────────────────
    title_style = ParagraphStyle(
        "CustomTitle", parent=styles["Title"], fontSize=22, textColor=colors.HexColor("#4a4a8a"), spaceAfter=6
    )
    heading_style = ParagraphStyle(
        "CustomHeading", parent=styles["Heading2"], fontSize=14, textColor=colors.HexColor("#667eea"), spaceAfter=10
    )
    normal_style = styles["Normal"]

    # ── Title ─────────────────────────────────────────────────
    elements.append(Paragraph("💰 Expense Tracker — Monthly Report", title_style))
    elements.append(Paragraph(f"User: {username} | Month: {month}", normal_style))
    elements.append(Spacer(1, 12))
    elements.append(HRFlowable(width="100%", color=colors.HexColor("#667eea"), thickness=2))
    elements.append(Spacer(1, 16))

    # ── Summary ───────────────────────────────────────────────
    total_income = get_total_income(user_id)
    total_expenses = get_total_expenses(user_id)
    balance = total_income - total_expenses
    savings = savings_percentage(total_income, total_expenses)

    elements.append(Paragraph("Financial Summary", heading_style))

    summary_data = [
        ["Total Income", format_currency(total_income)],
        ["Total Expenses", format_currency(total_expenses)],
        ["Balance", format_currency(balance)],
        ["Savings Rate", f"{savings}%"],
    ]
    summary_table = Table(summary_data, colWidths=[3 * inch, 2 * inch])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0f0ff")),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#333333")),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 11),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#f8f8ff")]),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 20))

    # ── Category Breakdown ────────────────────────────────────
    cat_data = get_expenses_by_category(user_id, month)
    if cat_data:
        elements.append(Paragraph("Expense Breakdown by Category", heading_style))
        cat_rows = [["Category", "Amount"]]
        for c in cat_data:
            cat_rows.append([c["category"], format_currency(c["total"])])

        cat_table = Table(cat_rows, colWidths=[3 * inch, 2 * inch])
        cat_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8f8ff")]),
        ]))
        elements.append(cat_table)
        elements.append(Spacer(1, 20))

    # ── Recent Expenses ───────────────────────────────────────
    expenses = get_expenses(user_id)
    if expenses:
        elements.append(Paragraph("Recent Expenses", heading_style))
        exp_rows = [["Title", "Category", "Amount", "Date"]]
        for e in expenses[:15]:
            exp_rows.append([e["title"], e["category"], format_currency(e["amount"]), e["date"]])

        exp_table = Table(exp_rows, colWidths=[2 * inch, 1.2 * inch, 1.3 * inch, 1 * inch])
        exp_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#764ba2")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#faf8ff")]),
        ]))
        elements.append(exp_table)

    # ── Footer ────────────────────────────────────────────────
    elements.append(Spacer(1, 30))
    elements.append(HRFlowable(width="100%", color=colors.HexColor("#667eea"), thickness=1))
    elements.append(Spacer(1, 8))
    elements.append(Paragraph(
        f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M')} | Expense Tracker App",
        ParagraphStyle("Footer", parent=normal_style, fontSize=8, textColor=colors.gray),
    ))

    doc.build(elements)
    buffer.seek(0)
    return buffer.read()


def show_reports(user_id: int, username: str):
    """Render the Reports page with CSV and PDF downloads."""
    st.title("📑 Reports")
    st.markdown("---")

    current_month = get_current_month()

    # ── CSV Reports ───────────────────────────────────────────
    st.subheader("📄 CSV Reports")
    csv_col1, csv_col2 = st.columns(2)

    with csv_col1:
        st.markdown("**Income Report**")
        incomes = get_incomes(user_id)
        if incomes:
            df_inc = pd.DataFrame(incomes)
            df_inc = df_inc[["id", "source", "amount", "date"]]
            csv_inc = df_inc.to_csv(index=False)
            st.download_button(
                "⬇️ Download Income CSV",
                data=csv_inc,
                file_name=f"income_report_{current_month}.csv",
                mime="text/csv",
                use_container_width=True,
            )
        else:
            st.info("No income data to export.")

    with csv_col2:
        st.markdown("**Expense Report**")
        expenses = get_expenses(user_id)
        if expenses:
            df_exp = pd.DataFrame(expenses)
            df_exp = df_exp[["id", "title", "category", "amount", "date", "notes"]]
            csv_exp = df_exp.to_csv(index=False)
            st.download_button(
                "⬇️ Download Expense CSV",
                data=csv_exp,
                file_name=f"expense_report_{current_month}.csv",
                mime="text/csv",
                use_container_width=True,
            )
        else:
            st.info("No expense data to export.")

    st.markdown("---")

    # ── PDF Report ────────────────────────────────────────────
    st.subheader("📕 PDF Report")
    st.markdown("Generate a comprehensive monthly financial summary as a PDF document.")

    if st.button("📄 Generate PDF Report", use_container_width=True):
        with st.spinner("Generating PDF..."):
            try:
                pdf_bytes = _generate_pdf(user_id, username, current_month)
                st.download_button(
                    "⬇️ Download PDF Report",
                    data=pdf_bytes,
                    file_name=f"financial_report_{current_month}.pdf",
                    mime="application/pdf",
                    use_container_width=True,
                    key="pdf_download",
                )
                st.success("PDF generated successfully! Click above to download. ✅")
            except Exception as e:
                st.error(f"Error generating PDF: {e}")
