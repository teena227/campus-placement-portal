# 🎓 Campus Placement Portal

A full-stack web application built for college placement cells to manage job postings, student applications, ATS-based resume matching, and recruiter access — all in one platform.

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](screenshots/landing.png)

### 🔐 Auth Pages
![Login Page](screenshots/login.png)
![Register Page](screenshots/register.png)

### 👨‍🎓 Student Pages
![Student Dashboard](screenshots/student-dashboard.png)
![Browse Jobs](screenshots/student-jobs.png)
![Job Detail & ATS Score](screenshots/job-detail-ats.png)
![My Applications](screenshots/student-applications.png)
![Profile & Resume Upload](screenshots/student-profile.png)

### 🏫 Admin Pages
![Admin Dashboard](screenshots/admin-dashboard.png)
![Manage Jobs](screenshots/admin-jobs.png)


### 🏢 Recruiter Pages
![Recruiter Dashboard](screenshots/recruiter-dashboard.png)


---

## ✨ Features

### 👨‍🎓 Student
- Register & Login with JWT Authentication
- Browse available job listings with search & filter
- Upload PDF resume (stored on Cloudinary)
- ATS Score checker — see how well resume matches job description
- Apply to jobs (deadline-aware)
- Track application status in real-time (Applied → Shortlisted → Interview → Offered)

### 🏫 TPC Admin
- Post, manage & delete job listings
- View all applicants with filters (branch, CGPA, status)
- Update application status (Shortlist, Reject, Interview, Offer)
- Analytics dashboard with charts (bar & pie)
- Export filtered applicants as CSV

### 🏢 Recruiter
- Register with company name
- View only their company's jobs & applicants
- See shortlisted candidates
- Export company-specific CSV

### 🌙 Additional
- Dark mode support
- ATS matching using TF-IDF cosine similarity + keyword analysis
- Deadline-based job application blocking
- Role-based access control
- Responsive UI

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 (App Router) | React framework with file-based routing |
| Tailwind CSS v4 | Utility-first styling |
| next-themes | Dark mode support |
| Axios | API calls |
| Recharts | Analytics charts |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication & authorization |
| bcryptjs | Password hashing |
| Multer | PDF file upload handling |
| pdf-parse | Extract text from PDF resumes |
| Cloudinary | Cloud storage for student PDF resumes |

### DevOps & Tools
| Tool | Purpose |
|------|---------|
| MongoDB Atlas | Cloud database |
| Git & GitHub | Version control |
| Postman / Thunder Client | API testing |

---

## 📁 Project Structure

```
Campus-Placement-Portal/
├── frontend/                    # Next.js App
│   ├── app/
│   │   ├── page.js             # Landing page
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── student/
│   │   │   ├── dashboard/      # Student dashboard
│   │   │   ├── jobs/           # Browse jobs
│   │   │   │   └── [id]/       # Job detail + Apply
│   │   │   ├── applications/   # My applications
│   │   │   └── profile/        # Resume upload
│   │   ├── admin/
│   │   │   ├── dashboard/      # Analytics dashboard
│   │   │   ├── jobs/           # Manage jobs
│   │   │   │   └── create/     # Create new job
│   │   │   └── applicants/     # View all applicants
│   │   └── recruiter/
│   │       ├── dashboard/      # Recruiter dashboard
│   │       └── shortlisted/    # Shortlisted candidates
│   ├── components/
│   │   └── Navbar.jsx
│   ├── context/
│   │   ├── AuthContext.jsx     # Global auth state
│   │   └── ThemeContext.jsx    # Dark mode state
│   └── utils/
│       └── api.js              # Axios instance
│
└── backend/                    # Node.js + Express API
    ├── controllers/
    │   ├── authController.js
    │   ├── jobController.js
    │   ├── applicationController.js
    │   ├── resumeController.js
    │   └── adminController.js
    ├── routes/
    │   ├── auth.js
    │   ├── jobs.js
    │   ├── applications.js
    │   ├── resume.js
    │   └── admin.js
    ├── models/
    │   ├── User.js
    │   ├── Job.js
    │   ├── Application.js
    │   └── Resume.js
    ├── middleware/
    │   └── auth.js
    ├── config/
    │   └── db.js
    └── server.js
```

---




## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/teena227/placement-portal.git
cd placement-portal
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/` folder:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/placement-portal
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` file in `frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Jobs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/jobs` | Get all jobs | All roles |
| GET | `/api/jobs/:id` | Get single job | All roles |
| POST | `/api/jobs` | Create new job | Admin |
| DELETE | `/api/jobs/:id` | Delete job | Admin |

### Applications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/applications/apply` | Apply to job | Student |
| GET | `/api/applications/my` | My applications | Student |
| GET | `/api/applications/all` | All applications | Admin/Recruiter |
| PATCH | `/api/applications/:id/status` | Update status | Admin/Recruiter |
| GET | `/api/applications/ats-check/:jobId` | Check ATS score | Student |

### Resume
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/resume/upload` | Upload PDF resume | Student |
| GET | `/api/resume/my` | Get my resume | Student |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/analytics` | Dashboard stats | Admin/Recruiter |
| GET | `/api/admin/export-csv` | Export CSV | Admin/Recruiter |

---

## 🧠 ATS Score Algorithm

The ATS (Applicant Tracking System) score is calculated using a multi-factor algorithm:

| Factor | Weight | Method |
|--------|--------|--------|
| TF-IDF Cosine Similarity | 40% | Vectorizes resume & JD, measures semantic similarity |
| Skills Match | 30% | Exact + partial keyword matching against required skills |
| Experience Keywords | 15% | Checks for action verbs like "built", "developed", "deployed" |
| Education Keywords | 10% | Checks for "B.Tech", "CGPA", "university" etc. |
| Action Words | 5% | Checks for achievement words like "optimized", "launched" |

**Score Interpretation:**
- 🟢 80%+ — Excellent match, highly recommended to apply
- 🟡 60-79% — Good match, consider improving resume
- 🔴 Below 60% — Low match, update resume with relevant skills

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Student** | Browse jobs, upload resume, check ATS score, apply, track status |
| **TPC Admin** | Post jobs, manage applicants, update status, analytics, CSV export |
| **Recruiter** | View company-specific jobs & candidates, export CSV |

---









