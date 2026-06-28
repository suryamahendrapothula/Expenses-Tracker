"""
Shared constants and helper functions.
"""

from datetime import datetime

# ── Expense Categories ───────────────────────────────────────
EXPENSE_CATEGORIES = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Others",
]

# ── Income Sources ───────────────────────────────────────────
INCOME_SOURCES = [
    "Salary",
    "Freelancing",
    "Business",
    "Investments",
    "Pocket Money",
]

# ── Category Emoji Map ───────────────────────────────────────
CATEGORY_ICONS = {
    "Food": "🍔",
    "Travel": "✈️",
    "Shopping": "🛍️",
    "Bills": "📄",
    "Entertainment": "🎮",
    "Health": "💊",
    "Others": "📦",
}

SOURCE_ICONS = {
    "Salary": "💼",
    "Freelancing": "💻",
    "Business": "🏢",
    "Investments": "📈",
    "Pocket Money": "💵",
}


def format_currency(amount: float) -> str:
    """Format a number as Indian Rupee currency string."""
    return f"₹{amount:,.2f}"


def get_current_month() -> str:
    """Return the current month as YYYY-MM."""
    return datetime.now().strftime("%Y-%m")


def get_current_date() -> str:
    """Return the current date as YYYY-MM-DD."""
    return datetime.now().strftime("%Y-%m-%d")


def savings_percentage(income: float, expenses: float) -> float:
    """Calculate savings percentage."""
    if income == 0:
        return 0.0
    return round(((income - expenses) / income) * 100, 1)
