
---

# JobBoard Project

## Overview

**JobBoard** is a modern job board platform designed to streamline the recruitment process for employers and job seekers. The platform features a recruiter-specific admin panel, a sleek design, and essential functionalities to manage job offers, employee details, and applicant profiles. The application supports CRUD operations, auto-apply functionality, and has a customized interface for recruiters.

## Features

- **Admin Panel for Recruiters:** A dedicated interface for recruiters to manage their job offers, employees, and profiles.
- **No User Login:** Open access for recruiters without a traditional login method.
- **Sign-up and Profile Management:** Recruiters can sign up and manage their profiles, keeping their information up-to-date.
- **CRUD Functionality:** Full Create, Read, Update, and Delete operations for job offers, allowing recruiters to modify job listings with ease.
- **Auto-Apply to Job Offers:** Automatically applies to job offers for registered users when they meet the criteria.
- **Special Recruiter Page:** A personalized page for recruiters displaying all their employees and job offers.
- **Custom Job Offers:** Recruiters can create special job offers with unique requirements.
- **Sleek and Modern Design:** A clean, user-friendly interface to ensure a smooth experience for both recruiters and job seekers.
- **Responsive Layout:** The platform is designed to be accessible on various devices, ensuring usability on desktops, tablets, and smartphones.

## Getting Started

To set up and run the JobBoard project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd jobboard
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Database Setup:**
   - Run the necessary database migrations.
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Run the Backend Server:**
   ```bash
   python manage.py runserver
   ```

5. **Access the API platform:**
   - Open your web browser and go to `http://localhost:8000/`.
  
6. **Run the Frontend Server:**
   ```bash
   python -m http.server 3000
   ```

7. **Access the platform:**
   - Open your web browser and go to `http://localhost:3000/`.

## Functionality Details

- **Admin Panel Features:**
  - List, create, update, and delete job advertisements.
  - Special job offer creation for unique job requirements.
  - Profile management functionality for recruiters.

- **Job Offers:**
  - The ability for recruiters to post and manage job listings.
  - Job seekers can view and auto-apply to offers if they are logged in.

- **Recruiter Dashboard:**
  - Displays all employees linked to the recruiter.
  - Shows all job offers created by the recruiter.
  - Options to create new job offers and manage existing ones.

## Future Enhancements

- **User Login & Authentication:** Implement a secure login system for both recruiters and job seekers.
- **Advanced Search Filters:** Allow job seekers to filter job offers by location, salary, and other criteria.
- **Email Notifications:** Notify recruiters and job seekers of new job applications or job matches.
- **Analytics Dashboard:** Provide recruiters with insights into job offer performance and applicant engagement.

## Technologies Used

- **Backend:** Django and Django Rest Framework (API)
- **Frontend:** HTML, CSS, JavaScript
- **Database:** SQLite
- **API Integration:** RESTful API for handling job applications and database management

## Contributions

Feel free to submit pull requests to improve the platform. We welcome contributions from the community!

## License

This project is licensed under the MIT License.

## Contact

For any questions or issues, please reach out to Arthur Bartczak at [arthur.bartczak@epitech.eu] or  Arthur Bartczak at [leo.guerizec@epitech.eu].

---
