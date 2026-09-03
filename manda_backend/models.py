from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    financial_profile = relationship("FinancialProfile", back_populates="user", uselist=False)
    goals = relationship("Goal", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    monthly_salary = Column(Float, nullable=False)
    salary_day = Column(Integer, nullable=False)
    fixed_charges = Column(Float, default=0)
    current_savings = Column(Float, default=0)

    user = relationship("User", back_populates="financial_profile")


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    saved_amount = Column(Float, default=0)
    target_date = Column(DateTime, nullable=True)
    status = Column(String, default="in_progress")
    category = Column(String, nullable=False, default="other")
    created_at = Column(DateTime, default=datetime.utcnow) # in_progress, achieved, abandoned

    user = relationship("User", back_populates="goals")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")
