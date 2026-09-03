from datetime import datetime
from sqlalchemy.orm import Session
from models import FinancialProfile, Goal, Transaction


def get_current_month_expenses(db: Session, user_id: int) -> float:
    """Somme des transactions du mois en cours."""
    now = datetime.utcnow()
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == user_id,
            Transaction.date >= datetime(now.year, now.month, 1),
        )
        .all()
    )
    return sum(t.amount for t in transactions)


def get_available_budget(profile: FinancialProfile, monthly_expenses: float) -> float:
    """Ce qu'il reste après charges fixes + dépenses du mois."""
    return profile.monthly_salary - profile.fixed_charges - monthly_expenses


def get_months_remaining(target_date: datetime | None) -> float | None:
    """Nombre de mois restants avant la date cible (None si pas de date)."""
    if not target_date:
        return None
    now = datetime.utcnow()
    delta_days = (target_date - now).days
    if delta_days <= 0:
        return 0
    return delta_days / 30.44  # moyenne de jours par mois


def get_required_monthly_saving(goal: Goal) -> float | None:
    """Combien épargner par mois pour atteindre l'objectif à temps."""
    remaining_amount = goal.target_amount - goal.saved_amount
    if remaining_amount <= 0:
        return 0

    months_left = get_months_remaining(goal.target_date)
    if months_left is None or months_left <= 0:
        return None  # pas de date cible = impossible à calculer précisément

    return round(remaining_amount / months_left, 2)


def get_goal_progress_percent(goal: Goal) -> float:
    if goal.target_amount <= 0:
        return 0
    return round(min(goal.saved_amount / goal.target_amount, 1) * 100, 1)


def get_goal_status(goal: Goal) -> str:
    """
    Compare l'épargne réelle au rythme théorique attendu depuis la création
    de l'objectif jusqu'à aujourd'hui.
    """
    if goal.saved_amount >= goal.target_amount:
        return "achieved"

    if not goal.target_date:
        return "no_deadline"

    total_days = (goal.target_date - goal.created_at).days
    elapsed_days = (datetime.utcnow() - goal.created_at).days

    if total_days <= 0:
        return "no_deadline"

    time_progress = min(elapsed_days / total_days, 1)
    expected_amount = goal.target_amount * time_progress

    if goal.saved_amount >= expected_amount * 0.9:  # tolérance de 10%
        return "on_track"
    return "needs_attention"


def get_financial_summary(db: Session, user_id: int, profile: FinancialProfile, goals: list[Goal]) -> dict:
    monthly_expenses = get_current_month_expenses(db, user_id)
    available_budget = get_available_budget(profile, monthly_expenses)

    goals_summary = []
    total_required_monthly = 0

    for goal in goals:
        required = get_required_monthly_saving(goal)
        if required:
            total_required_monthly += required

        goals_summary.append({
            "id": goal.id,
            "name": goal.name,
            "category": goal.category,
            "target_amount": goal.target_amount,
            "saved_amount": goal.saved_amount,
            "progress_percent": get_goal_progress_percent(goal),
            "required_monthly_saving": required,
            "status": get_goal_status(goal),
        })

    return {
        "monthly_salary": profile.monthly_salary,
        "fixed_charges": profile.fixed_charges,
        "monthly_expenses": monthly_expenses,
        "available_budget": available_budget,
        "total_required_monthly": round(total_required_monthly, 2),
        "is_feasible": available_budget >= total_required_monthly,
        "goals": goals_summary,
    }