# 🎓 EduConnect (Peer-to-peer Skill Sharing Platform) 
An interactive, gamified peer-to-peer learning system that enables undergraduates to share their knowledge, get noticed, and grow together. The system enables users to switch roles between learner and mentor, participate in sessions, earn rewards, and improve skills in an interactive environment.

### Go to <a href="https://www.figma.com/design/1RZyuBikwKaGniFk8my3ru/EduConnecct?node-id=0-1&t=y3A7Ip1yWfJoIonj-1"> Figma Design </a>

## Objectives
- A secure peer learning platform for students to connect and share knowledge.
- A collaborative environment where users can both learn and teach.
- AI-powered semantic search to match learners with the most relevant mentors.
- Gamification by skill coins, badges, and leaderboards to encourage engagement.
- Ensure trust, quality, and system control via verification and admin monitoring.

## System Modules
### 1. User Module

- User registration and authentication
- Profile creation and management
- Role switching (Learner ↔ Mentor)
- Secure login with academic email validation

### 2. Learner Module

- Search and discover mentors
- Book and manage mentoring sessions
- View session history
- Rate mentors after sessions

### 3. Mentor Module

- Conduct mentoring sessions
- Manage mentor profile and skills
- Accept or reject session requests
- View performance statistics
- Upload certificates for skill verification

### 4. Semantic Discovery & AI Module

- AI-based mentor matching using embeddings
- Integration with Google Gemini API
- Vector storage using Pinecone
- Rule-based mentor levelling system

### 5. Gamification & Reward Module

- Skill Coins system
- Badge allocation
- Leaderboard management
- Weekly challenges

### 6. Communication Module

- Integration with external meeting platforms (Zoom / Google Meet)
- Secure meeting link sharing
- Notifications and reminders for sessions

### 7. Payment & Wallet Module

- Manages internal points system (Skill Coins)
- Automatic updates after sessions
- Points stored within user profiles

### 8. Admin Module

- User authentication and management
- Session tracking and monitoring
- Handling disputes and reports
- Performance reporting
- Managing skill database and reward rules

## System Architecture

The system follows a modular architecture with separation of concerns:
* **Frontend**: Handles user interface and user experience
* **Backend**: Manages APIs, business logic, and database operations
* **Cloud/DevOps**: Handles deployment, environment configuration, and monitoring

## Team Members & Contributions

| Member ID | Responsibilities                                                                            |
| --------- | ------------------------------------------------------------------------------------------- |
| 22FIS0527 | Login, Registration, Dashboard UI, Profile Management, Authentication API, Deployment Setup |
| 22FIS0548 | Session Scheduling UI, Admin Dashboard, Session API, Notifications, Meeting Links           |
| 22FIS0550 | Gamification UI, Skill Coins System, Badges, Leaderboard, Points Transactions               |
| 22FIS0551 | Mentor Profile UI, Semantic Search, AI Integration (Gemini + Pinecone), Feedback System     |

## Software Requirements
### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL 

### AI & Search
- Google Gemini API
- Pinecone Vector Database

### DevOps / Deployment
- Railway / Cloud Services
- Environment Variables Configuration

## Setup Instructions

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/educonnect.git
   cd educonnect
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Configure environment variables

   * Create a `.env` file
   * Add required API keys and database credentials

4. Run the project

   ```bash
   npm start
   ```

---

## Project Management

This project follows an **Agile methodology using a Kanban approach**.

* Tasks are managed using Trello
* Work is organised into weekly sprints
* Task flow:

```
Backlog → To Do → In Progress → Review → Done
```

* Regular team check-ins ensure progress and collaboration

## Future Improvements
- Mobile application support
- Advanced AI-based recommendations
- Real-time chat system
- External payment gateway integration
- Enhanced analytics dashboard

---

## 📄 License

This project is developed for academic purposes as part of a capstone project.
