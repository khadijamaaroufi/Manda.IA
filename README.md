# 💰 manda.IA

### Your salary. Your goals. Your plan.

> **manda.IA** is an intelligent personal finance assistant designed to help users
> manage their salary, control their expenses, and achieve their financial goals
> through AI-powered conversations and personalized financial planning.

<p align="center">
  <img src="assets/home.jpeg" width="850">
</p>

---

## 🧠 About the Project

**manda.IA** is an AI-powered personal finance assistant designed to make
financial management simpler, more intuitive, and more personalized.

The name **"Manda"** comes from Moroccan Darija and refers to **salary**,
reflecting the project's focus on everyday personal financial management.

Instead of forcing users to work with complex financial tools, manda.IA
allows them to simply **talk about their money, their needs, and their goals**.

The assistant can help users understand their financial situation, manage
their expenses, define objectives, build saving plans, and track their progress.

### The idea

```text
Talk about your finances
          ↓
Understand your situation
          ↓
Analyze your financial data
          ↓
Build a personalized plan
          ↓
Track your progress
```

---

# 🎯 The Problem

Managing a salary is not only about recording expenses.

People often ask themselves:

* 💸 Where does my money go?
* 💰 How much can I save every month?
* 🎯 Can I afford my next goal?
* 📅 How long will it take to reach it?
* 📊 Am I actually making progress?
* 🧮 How should I distribute my salary?

Traditional financial applications often focus on displaying numbers,
but they do not necessarily help users **understand what they should do next**.

---

# 💡 The Solution

**manda.IA puts an intelligent assistant at the center of personal finance.**

The user can communicate naturally with Manda and describe their situation
or financial objectives.

For example:

> **"I earn 8,000 MAD per month and I want to buy a car for 120,000 MAD."**

Manda can understand the request, identify the financial objective,
analyze the available information, perform the necessary calculations,
and help the user build a realistic saving strategy.

The system combines:

```text
🤖 AI Conversation
        +
💰 Financial Reasoning
        +
🎯 Goal Planning
        +
📊 Progress Tracking
```

---

# ✨ Key Features

## 🤖 AI Financial Assistant

Interact naturally with Manda to:

* Ask financial questions
* Describe your financial situation
* Get personalized recommendations
* Receive saving strategies
* Understand financial decisions
* Build financial plans

---

## 🎯 Financial Goal Management

Users can create and track different financial objectives, such as:

* 🚗 Buying a car
* 🏠 Buying a house
* ✈️ Planning a trip
* 🎓 Education
* 🛟 Emergency fund
* 💰 Personal savings

Each objective can be monitored through its progress and financial
planning information.

---

## 💸 Expense Management

Users can record and manage their expenses in order to better understand
where their salary is going.

The goal is not only to track expenses, but also to use this information
to support better financial decisions.

---

## 📊 Financial Dashboard

The dashboard provides a centralized view of the user's financial activity.

It can include:

* 💵 Income
* 💸 Expenses
* 💰 Savings
* 🎯 Financial goals
* 📈 Goal progression
* 🕒 Recent activity
* 📊 Financial analysis

---

# 🖥️ User Interface

## 🏠 Welcome Page

<p align="center">
  <img src="assets/home.jpeg" width="850">
</p>

The welcome page introduces the manda.IA experience and its main purpose:
helping users transform their salary into a clear financial plan.

---

## 🔐 Authentication

<p align="center">
  <img src="assets/login.jpeg" width="700">
</p>

Users can securely access their personal financial space through the
authentication interface.

---

## 📊 Dashboard

<p align="center">
  <img src="assets/dashboard.jpeg" width="850">
</p>

The dashboard provides a visual overview of the user's financial situation,
objectives, and recent activity.

---

## 💬 Chat with Manda

<p align="center">
  <img src="assets/chatbot.jpeg" width="850">
</p>

The conversational interface is at the heart of manda.IA.

Users can communicate with the assistant using natural language rather than
manually navigating through complex financial tools.

---

# 🏗️ System Architecture

<p align="center">
  <img src="assets/architecture.png" width="950">
</p>

manda.IA follows a modular architecture separating the conversational
AI layer from the financial business logic and data persistence layer.

```text
                         ┌──────────────────┐
                         │      USER        │
                         │   Web / Mobile   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Next.js / React │
                         │     FRONTEND     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     FastAPI      │
                         │      API         │
                         └───────┬──────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
          ┌──────────┐    ┌──────────────┐   ┌──────────┐
          │   LLM    │    │  Financial   │   │ Database │
          │          │    │    Engine    │   │          │
          └────┬─────┘    └──────┬───────┘   └────┬─────┘
               │                 │                │
               │                 │                │
               └─────────────────┼────────────────┘
                                 │
                                 ▼
                         Personalized
                            Response
```

---

# 🧠 LLM + Financial Engine

One of the main architectural principles of manda.IA is the separation
between **natural language processing** and **financial calculations**.

The LLM is responsible for:

* Understanding natural language
* Identifying user intent
* Extracting relevant information
* Generating natural responses

The **Financial Engine** is responsible for:

* Financial calculations
* Budget analysis
* Saving simulations
* Goal planning
* Financial projections

This separation avoids relying on the LLM alone for numerical financial
calculations.

### Example flow

```text
User
 │
 │ "I earn 8,000 MAD and want to save 30,000 MAD."
 ▼
LLM
 │
 │ Intent + financial information
 ▼
Financial Engine
 │
 │ Calculations / simulations
 ▼
Financial Results
 │
 ▼
LLM
 │
 │ Natural language generation
 ▼
Personalized Recommendation
```

This architecture combines the flexibility of an LLM with the reliability
of deterministic financial calculations.

---

# 🛠️ Technology Stack

| Technology              | Role                                          |
| ------------------------ | --------------------------------------------- |
| 🐍 **Python**           | Backend and business logic                    |
| ⚡ **FastAPI**           | REST API                                      |
| ⚛️ **React**            | User interface                                |
| ▲ **Next.js**           | Frontend framework                            |
| 🧠 **LLM**              | Natural language understanding and generation |
| 🔌 **OpenAI API**       | AI capabilities                               |
| 🗄️ **Database**        | User and financial data                       |
| 💰 **Financial Engine** | Financial calculations and simulations        |

---

# 📂 Project Structure

```text
manda.IA/
│
├── manda_backend/
│   ├── chatbot.py
│   ├── database.py
│   ├── financial_engine.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── security.py
│   └── requirements.txt
│
├── manda-frontend/
│   ├── app/
│   │   ├── budget/
│   │   ├── chat/
│   │   ├── dashboard/
│   │   ├── goals/
│   │   ├── login/
│   │   ├── signup/
│   │   └── transactions/
│   │
│   ├── components/
│   │   ├── ActionSheet.tsx
│   │   ├── BottomNav.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskList.tsx
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── assets/
│   ├── home.jpeg
│   ├── login.jpeg
│   ├── dashboard.jpeg
│   ├── chatbot.jpeg
│   └── architecture.png
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/khadijamaaroufi/Manda.IA.git
cd Manda.IA
```

---

# ⚙️ Backend Setup

Navigate to the backend:

```bash
cd manda_backend
```

Create a virtual environment:

```bash
python -m venv venv
```

### Windows

Activate the environment:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and add the required environment variables.

Example:

```env
OPENAI_API_KEY=your_api_key
```

Run the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will be available locally at:

```text
http://127.0.0.1:8000
```

---

# 🎨 Frontend Setup

Open another terminal and navigate to:

```bash
cd manda-frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available locally at:

```text
http://localhost:3000
```

---

# 🔐 Environment Variables

For security reasons, API keys and sensitive credentials are **not included**
in this repository.

Create your own `.env` file locally.

Example:

```env
OPENAI_API_KEY=your_api_key
```

> Never commit your `.env` file or expose your API keys publicly.

---

# 🔮 Roadmap

The project can be extended with several features:

* [ ] Advanced financial reports
* [ ] More personalized saving strategies
* [ ] Smart financial notifications
* [ ] Advanced financial analytics
* [ ] Monthly financial summaries
* [ ] Voice interaction
* [ ] Mobile application
* [ ] Open Banking integration
* [ ] External financial services
* [ ] Production deployment

---

# 🎯 Vision

The vision behind **manda.IA** is to make personal financial management
more accessible, intelligent, and intuitive.

Instead of giving users another complex financial dashboard,
**manda.IA puts the conversation at the center of the experience.**

The objective is simple:

```text
Understand your money.
        ↓
Plan your goals.
        ↓
Make better decisions.
        ↓
Track your progress.
```

---

# 👩‍💻 Author

**Khadija Maaroufi**

AI Engineering Project — 2026

---

<p align="center">

### 💰 Your salary. Your goals. Your plan.

**Powered by AI.**

</p>
