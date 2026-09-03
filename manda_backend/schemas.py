from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# ---------- User ----------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str  # mot de passe en clair, reçu du client, jamais stocké tel quel

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- FinancialProfile ----------
class FinancialProfileCreate(BaseModel):
    monthly_salary: float
    salary_day: int
    fixed_charges: float = 0
    current_savings: float = 0

class FinancialProfileOut(BaseModel):
    id: int
    user_id: int
    monthly_salary: float
    salary_day: int
    fixed_charges: float
    current_savings: float

    class Config:
        from_attributes = True


# ---------- Goal ----------
class GoalCreate(BaseModel):
    name: str
    category: str
    target_amount: float
    saved_amount: float = 0
    target_date: Optional[datetime] = None

class GoalOut(BaseModel):
    id: int
    user_id: int
    name: str
    category: str
    target_amount: float
    saved_amount: float
    target_date: Optional[datetime]
    status: str

    class Config:
        from_attributes = True


# ---------- Transaction ----------
class TransactionCreate(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None

class TransactionOut(BaseModel):
    id: int
    user_id: int
    amount: float
    category: str
    description: Optional[str]
    date: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class GoalSummary(BaseModel):
    id: int
    name: str
    category: str
    target_amount: float
    saved_amount: float
    progress_percent: float
    required_monthly_saving: Optional[float]
    status: str

class FinancialSummaryOut(BaseModel):
    monthly_salary: float
    fixed_charges: float
    monthly_expenses: float
    available_budget: float
    total_required_monthly: float
    is_feasible: bool
    goals: list[GoalSummary]
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

class ChatResponse(BaseModel):
    reply: str