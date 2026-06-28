"""
Database module — SQLite connection, schema creation, and CRUD helpers.
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "tracker.db")


def get_connection():
    """Return a new SQLite connection with row_factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """Create all tables if they don't exist."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS income (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            source TEXT NOT NULL,
            amount REAL NOT NULL,
            date DATE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            date DATE NOT NULL,
            notes TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS budget (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            month TEXT NOT NULL,
            budget_amount REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(user_id, month)
        )
    """)

    conn.commit()
    conn.close()


# ── User helpers ──────────────────────────────────────────────

def create_user(username: str, email: str, hashed_password: str):
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password),
        )
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()


def get_user_by_username(username: str):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM users WHERE username = ?", (username,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


# ── Income helpers ────────────────────────────────────────────

def add_income(user_id: int, source: str, amount: float, date: str):
    conn = get_connection()
    conn.execute(
        "INSERT INTO income (user_id, source, amount, date) VALUES (?, ?, ?, ?)",
        (user_id, source, amount, date),
    )
    conn.commit()
    conn.close()


def get_incomes(user_id: int):
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM income WHERE user_id = ? ORDER BY date DESC", (user_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def update_income(income_id: int, source: str, amount: float, date: str):
    conn = get_connection()
    conn.execute(
        "UPDATE income SET source = ?, amount = ?, date = ? WHERE id = ?",
        (source, amount, date, income_id),
    )
    conn.commit()
    conn.close()


def delete_income(income_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM income WHERE id = ?", (income_id,))
    conn.commit()
    conn.close()


def get_total_income(user_id: int):
    conn = get_connection()
    row = conn.execute(
        "SELECT COALESCE(SUM(amount), 0) AS total FROM income WHERE user_id = ?",
        (user_id,),
    ).fetchone()
    conn.close()
    return row["total"]


def get_monthly_income(user_id: int, month: str):
    conn = get_connection()
    row = conn.execute(
        "SELECT COALESCE(SUM(amount), 0) AS total FROM income WHERE user_id = ? AND strftime('%Y-%m', date) = ?",
        (user_id, month),
    ).fetchone()
    conn.close()
    return row["total"]


# ── Expense helpers ───────────────────────────────────────────

def add_expense(user_id: int, title: str, category: str, amount: float, date: str, notes: str = ""):
    conn = get_connection()
    conn.execute(
        "INSERT INTO expenses (user_id, title, category, amount, date, notes) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, title, category, amount, date, notes),
    )
    conn.commit()
    conn.close()


def get_expenses(user_id: int):
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC", (user_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def update_expense(expense_id: int, title: str, category: str, amount: float, date: str, notes: str = ""):
    conn = get_connection()
    conn.execute(
        "UPDATE expenses SET title = ?, category = ?, amount = ?, date = ?, notes = ? WHERE id = ?",
        (title, category, amount, date, notes, expense_id),
    )
    conn.commit()
    conn.close()


def delete_expense(expense_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    conn.close()


def get_total_expenses(user_id: int):
    conn = get_connection()
    row = conn.execute(
        "SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = ?",
        (user_id,),
    ).fetchone()
    conn.close()
    return row["total"]


def get_monthly_expenses(user_id: int, month: str):
    conn = get_connection()
    row = conn.execute(
        "SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = ? AND strftime('%Y-%m', date) = ?",
        (user_id, month),
    ).fetchone()
    conn.close()
    return row["total"]


def get_expenses_by_category(user_id: int, month: str = None):
    conn = get_connection()
    if month:
        rows = conn.execute(
            "SELECT category, SUM(amount) AS total FROM expenses WHERE user_id = ? AND strftime('%Y-%m', date) = ? GROUP BY category",
            (user_id, month),
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT category, SUM(amount) AS total FROM expenses WHERE user_id = ? GROUP BY category",
            (user_id,),
        ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_monthly_expense_trend(user_id: int):
    conn = get_connection()
    rows = conn.execute(
        "SELECT strftime('%Y-%m', date) AS month, SUM(amount) AS total FROM expenses WHERE user_id = ? GROUP BY month ORDER BY month",
        (user_id,),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── Budget helpers ────────────────────────────────────────────

def set_budget(user_id: int, month: str, budget_amount: float):
    conn = get_connection()
    conn.execute(
        """INSERT INTO budget (user_id, month, budget_amount) VALUES (?, ?, ?)
           ON CONFLICT(user_id, month) DO UPDATE SET budget_amount = excluded.budget_amount""",
        (user_id, month, budget_amount),
    )
    conn.commit()
    conn.close()


def get_budget(user_id: int, month: str):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM budget WHERE user_id = ? AND month = ?", (user_id, month)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def get_recent_transactions(user_id: int, limit: int = 10):
    conn = get_connection()
    rows = conn.execute(
        """
        SELECT 'Income' AS type, source AS description, amount, date FROM income WHERE user_id = ?
        UNION ALL
        SELECT 'Expense' AS type, title AS description, amount, date FROM expenses WHERE user_id = ?
        ORDER BY date DESC LIMIT ?
        """,
        (user_id, user_id, limit),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
