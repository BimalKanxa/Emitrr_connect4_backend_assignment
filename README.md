# 🎮 Connect 4 – Multiplayer Game (Emitrr Internship Assignment)

A real-time, backend-driven implementation of the classic **Connect 4** game — built using Node.js, WebSockets, PostgreSQL, and Kafka for game analytics.

> 🔧 Developed as part of the Full Stack (Backend Heavy) Internship assignment for **Emitrr**.

---

## 🚀 Live Demo

- **Backend API**: [https://emitrr-connect4-backend-assignment.onrender.com](https://emitrr-connect4-backend-assignment.onrender.com)
- **Frontend**: _[https://emitrr-connect4-backend-assignment.vercel.app/]_

---

## 📌 Features

### ✅ Real-Time Multiplayer Gameplay
- Play Connect 4 with another user or against a bot (auto-match if no player joins in 10 sec).
- Built using **Socket.IO** for real-time communication.

### 🤖 Smart Bot Fallback
- Competitive bot joins the game if a second player doesn't join within 10 seconds.
- Bot uses basic strategy: tries to win and blocks player's winning moves.

### 🔄 Reconnect Logic
- Player can rejoin the game within 30 seconds of disconnection using the same username.
- If not, the opponent is declared winner by forfeit.

### 🧠 Game Analytics via Kafka
- Kafka producer sends analytics events on:
  - Game start and end
  - Game result
  - Player moves
- Kafka consumer stores events in PostgreSQL for analysis.

### 🏆 Leaderboard
- Displays top 10 players based on number of wins.
- Accessible via API and frontend.

---

## 🧪 Tech Stack

| Layer         | Technology         |
|---------------|--------------------|
| Backend       | Node.js, Express   |
| Real-time     | Socket.IO          |
| Database      | PostgreSQL (via Sequelize) |
| Message Queue | Apache Kafka (via KafkaJS) |
| Frontend      | HTML, JS |
| Deployment    | Render (Backend + DB)      |

---


---

## 🧰 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/BimalKanxa/Emitrr_connect4_backend_assignment.git
cd connect4-backend-assignment

npm install


Setup .env File

PORT=
DATABASE_URL=
DB_NAME=connect4-db
DB_USER=connect4_db_user
DB_PASSWORD=
DB_PORT=5432

If using Docker locally:

    run docker-compose up -d

Start Backend Server
    node server.js

Run Kafka Analytics Consumer
    node sockets/analytics/analyticsService.js

🎯 API Endpoints
Method	Route	Description
GET	/api/leaderboard	Returns top 10 players
GET	/	Health check


✅ Deployment
Backend: Render.com
PostgreSQL: Render Postgres
Kafka: Local (via Docker) — or can be moved to Confluent/Redpanda

Frontend: host on Vercel or Netlify

🙋‍♂️ Author
Bimal Sharma
Email: sharmabimal2003@gmail.com