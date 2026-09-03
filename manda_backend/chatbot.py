import os
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai
from sqlalchemy.orm import Session
from models import User, Transaction, Goal, FinancialProfile
from financial_engine import get_financial_summary

load_dotenv()
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

MODEL_NAME = "gemini-3.6-flash"

TRANSACTION_CATEGORIES = ["food", "transport", "housing", "leisure", "shopping", "health", "other"]
GOAL_CATEGORIES = ["home", "business", "emergency_fund", "trip", "education", "car", "other"]

log_transaction_tool = genai.protos.FunctionDeclaration(
    name="log_transaction",
    description="Enregistrer une dépense que l'utilisateur vient de mentionner avoir faite.",
    parameters=genai.protos.Schema(
        type=genai.protos.Type.OBJECT,
        properties={
            "amount": genai.protos.Schema(type=genai.protos.Type.NUMBER),
            "category": genai.protos.Schema(type=genai.protos.Type.STRING, enum=TRANSACTION_CATEGORIES),
            "description": genai.protos.Schema(type=genai.protos.Type.STRING),
        },
        required=["amount", "category"],
    ),
)

create_goal_tool = genai.protos.FunctionDeclaration(
    name="create_goal",
    description="Créer un nouvel objectif financier mentionné par l'utilisateur.",
    parameters=genai.protos.Schema(
        type=genai.protos.Type.OBJECT,
        properties={
            "name": genai.protos.Schema(type=genai.protos.Type.STRING),
            "category": genai.protos.Schema(type=genai.protos.Type.STRING, enum=GOAL_CATEGORIES),
            "target_amount": genai.protos.Schema(type=genai.protos.Type.NUMBER),
            "target_date": genai.protos.Schema(type=genai.protos.Type.STRING, description="Format YYYY-MM-DD, optionnel"),
        },
        required=["name", "category", "target_amount"],
    ),
)

TOOLS = genai.protos.Tool(function_declarations=[log_transaction_tool, create_goal_tool])


def build_system_prompt(summary: dict, user_name: str) -> str:
    import json
    return f"""Tu es Manda, coach financier IA pour les Marocains.

LANGUE (règle stricte) :
- Si l'utilisateur écrit en français → réponds en français.
- Si l'utilisateur écrit en darija marocaine, même en lettres latines (ex: "3andi", "bghit", "chhal") → réponds en darija marocaine, mais TOUJOURS écrite en alphabet ARABE, jamais en lettres latines.
- Si l'utilisateur écrit en arabe classique/fus'ha → réponds en arabe classique.
- Ne mélange jamais les alphabets dans une même réponse.

TON :
- Motivant, chaleureux, mais toujours poli.
- Réponses COURTES : 2 à 4 phrases maximum, sauf si on te demande explicitement plus de détails.
- Comprends bien la question avant de répondre, ne pars jamais hors sujet.

CHIFFRES :
- N'invente JAMAIS un chiffre. Utilise uniquement les données ci-dessous.
- Si une info manque, dis-le simplement et propose à l'utilisateur de la renseigner.

ACTIONS (règle stricte) :
- Si l'utilisateur mentionne une dépense qu'il vient de faire, avec un montant et une catégorie clairs, utilise IMMÉDIATEMENT l'outil log_transaction — ne te contente jamais d'en parler sans l'enregistrer.
- Si l'utilisateur veut créer un objectif ET a donné le nom + le montant cible, utilise IMMÉDIATEMENT l'outil create_goal.
- Si des informations obligatoires manquent pour un outil (ex: montant cible non précisé), NE PAS appeler l'outil : demande d'abord l'information manquante, de façon brève.
- Une fois une action effectuée avec succès, confirme-le clairement à l'utilisateur ("C'est noté, ton objectif est créé").

Situation financière actuelle de {user_name} (calculée, fiable) :
{json.dumps(summary, ensure_ascii=False, indent=2)}
"""


def execute_tool(db: Session, user: User, tool_name: str, tool_input: dict) -> dict:
    if tool_name == "log_transaction":
        transaction = Transaction(
            user_id=user.id,
            amount=tool_input["amount"],
            category=tool_input["category"],
            description=tool_input.get("description"),
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        return {"success": True, "transaction_id": transaction.id}

    if tool_name == "create_goal":
        target_date = None
        if tool_input.get("target_date"):
            target_date = datetime.fromisoformat(tool_input["target_date"])

        goal = Goal(
            user_id=user.id,
            name=tool_input["name"],
            category=tool_input["category"],
            target_amount=tool_input["target_amount"],
            target_date=target_date,
        )
        db.add(goal)
        db.commit()
        db.refresh(goal)
        return {"success": True, "goal_id": goal.id}

    return {"success": False, "error": "Outil inconnu"}


def run_chat(db: Session, user: User, messages: list[dict]) -> str:
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()

    summary = (
        get_financial_summary(db, user.id, profile, goals)
        if profile
        else {"note": "Aucun profil financier renseigné pour l'instant."}
    )

    system_prompt = build_system_prompt(summary, user.name)

    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        tools=[TOOLS],
        system_instruction=system_prompt,
    )

    # Historique = tous les messages sauf le dernier (envoyé séparément)
    history = [
        {"role": "user" if m["role"] == "user" else "model", "parts": [m["content"]]}
        for m in messages[:-1]
    ]

    chat = model.start_chat(history=history)
    response = chat.send_message(messages[-1]["content"])

    for _ in range(3):  # limite anti-boucle infinie
        print("DEBUG - parts:", response.candidates[0].content.parts)  # ligne temporaire de debug

        function_calls = [
            part.function_call
            for part in response.candidates[0].content.parts
            if part.function_call
        ]

        if not function_calls:
            return response.text

        function_responses = []
        for fc in function_calls:
            result = execute_tool(db, user, fc.name, dict(fc.args))
            function_responses.append(
                genai.protos.Part(
                    function_response=genai.protos.FunctionResponse(
                        name=fc.name,
                        response={"result": result},
                    )
                )
            )

        response = chat.send_message(function_responses)

    return "Désolé, je n'ai pas pu traiter ta demande."