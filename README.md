# EduConnect: Peer-to-Peer Skill Sharing Platform

[cite_start]**EduConnect** is an interactive, gamified learning ecosystem designed specifically for IT students at **Sabaragamuwa University of Sri Lanka**[cite: 6, 73]. [cite_start]The platform bridges the gap between theoretical classroom knowledge and practical application by matching student learners with verified student mentors[cite: 73, 86].

---

## 🚀 Key Features

* [cite_start]**Semantic Mentor Discovery**: Uses **Google Gemini API** and **Pinecone vector embeddings** to match students based on contextual skill relevance rather than just keywords[cite: 88, 177].
* [cite_start]**Algorithmic Leveling**: An automated rule-based system that ranks mentors into **Bronze, Silver, and Gold** tiers based on session counts and learner feedback[cite: 81, 178].
* [cite_start]**Skill Coin Economy**: A non-monetary internal points system used to book sessions and reward mentors for their contributions[cite: 194, 309, 313].
* [cite_start]**Gamified Progression**: Students earn badges and climb leaderboards as they share knowledge and grow their professional reputation[cite: 76, 90].
* [cite_start]**Integrated Communication**: Facilitates learning through secure external meeting links (**Zoom/Google Meet**) and real-time notifications[cite: 107, 189, 329].

---

## 🛠️ Tech Stack

* [cite_start]**Frontend**: React.js [cite: 99, 140]
* [cite_start]**Backend**: Node.js & Express.js [cite: 99, 141, 370]
* [cite_start]**Primary Database**: MySQL [cite: 100, 143]
* [cite_start]**AI/Vector Database**: Pinecone [cite: 100, 144]
* [cite_start]**AI Engine**: Google Gemini API [cite: 104, 147]
* [cite_start]**Real-time Services**: Socket.IO [cite: 106, 142]

---

## 📂 Project Structure



```plaintext
EduConnect/
[cite_start]├── client/          # React.js Frontend (UI/UX) [cite: 99]
[cite_start]├── server/          # Node.js Backend (APIs & AI Logic) [cite: 141]
[cite_start]├── docs/            # ER Diagrams, Use Cases, and SQL Schemas [cite: 392, 394]
[cite_start]└── .env             # API Keys and Environment Variables [cite: 100]
```



##⚙️ Installation & Setup 
1. Clone the Repo ```bash git clone [https://github.com/your-username/EduConnect.git](https://github.com/savinduakash/EduConnect.git)```
2. Server SetupBashcd server
```bash
npm install 
npm start```

3. Client SetupBashcd client
npm install
npm start
📅 TimelineThis project is developed over a 15-week timeline using Agile Methodology.
---

**Would you like me to generate the `docs/schema.sql` file content next so your team can set up the MySQL tables?**
