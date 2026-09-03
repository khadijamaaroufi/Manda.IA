from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import User, FinancialProfile, Goal, Transaction
from security import hash_password, verify_password, create_access_token, get_current_user_id
from schemas import (
    UserCreate, UserOut,
    FinancialProfileCreate, FinancialProfileOut,
    GoalCreate, GoalOut,
    TransactionCreate, TransactionOut,
    LoginRequest, TokenResponse,
)
from financial_engine import get_financial_summary
from schemas import FinancialSummaryOut
from chatbot import run_chat
from schemas import ChatRequest, ChatResponse

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# AUTH

@app.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    token = create_access_token({"user_id": user.id})
    return {"access_token": token, "user": user}


#  USER 

# CREATE
@app.post("/users", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
@app.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()
@app.get("/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# UPDATE
@app.put("/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    updated: UserCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.name = updated.name
    user.email = updated.email
    user.hashed_password = hash_password(updated.password)
    db.commit()
    db.refresh(user)
    return user

# DELETE
@app.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


#  FINANCIAL PROFILE 

@app.post("/users/{user_id}/financial-profile", response_model=FinancialProfileOut)
def create_financial_profile(
    user_id: int,
    profile: FinancialProfileCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Financial profile already exists for this user")

    new_profile = FinancialProfile(user_id=user_id, **profile.model_dump())
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile


@app.get("/users/{user_id}/financial-profile", response_model=FinancialProfileOut)
def get_financial_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Financial profile not found")
    return profile


@app.put("/users/{user_id}/financial-profile", response_model=FinancialProfileOut)
def update_financial_profile(
    user_id: int,
    updated: FinancialProfileCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Financial profile not found")
    for key, value in updated.model_dump().items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile


# GOAL 

@app.post("/users/{user_id}/goals", response_model=GoalOut)
def create_goal(
    user_id: int,
    goal: GoalCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_goal = Goal(user_id=user_id, **goal.model_dump())
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal


@app.get("/users/{user_id}/goals", response_model=list[GoalOut])
def list_goals(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    return db.query(Goal).filter(Goal.user_id == user_id).all()


@app.get("/goals/{goal_id}", response_model=GoalOut)
def get_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if goal.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    return goal


@app.put("/goals/{goal_id}", response_model=GoalOut)
def update_goal(
    goal_id: int,
    updated: GoalCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if goal.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    for key, value in updated.model_dump().items():
        setattr(goal, key, value)
    db.commit()
    db.refresh(goal)
    return goal


@app.delete("/goals/{goal_id}")
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if goal.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted"}


#  TRANSACTION 

@app.post("/users/{user_id}/transactions", response_model=TransactionOut)
def create_transaction(
    user_id: int,
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_transaction = Transaction(user_id=user_id, **transaction.model_dump())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


@app.get("/users/{user_id}/transactions", response_model=list[TransactionOut])
def list_transactions(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    return db.query(Transaction).filter(Transaction.user_id == user_id).all()


@app.get("/transactions/{transaction_id}", response_model=TransactionOut)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if transaction.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    return transaction


@app.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if transaction.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted"}



@app.get("/users/{user_id}/financial-summary", response_model=FinancialSummaryOut)
def financial_summary(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")

    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profil financier introuvable")

    goals = db.query(Goal).filter(Goal.user_id == user_id).all()

    return get_financial_summary(db, user_id, profile, goals)


@app.post("/users/{user_id}/chat", response_model=ChatResponse)
def chat(
    user_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit à ces données")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    reply = run_chat(db, user, messages)

    return {"reply": reply}