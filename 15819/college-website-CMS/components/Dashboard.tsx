// dashboard.ts (short version)
'use client'
interface Student {
    id: string; name: string; email: string; profilePic: string;
  }
  interface Assignment {
    id: string; title: string; dueDate: Date; courseId: string; completed: boolean;
  }
  interface Course {
    id: string; title: string; instructor: string; progress: number;
    nextAssignment: Assignment | null; grade: string | null;
  }
  interface Announcement {
    id: string; title: string; content: string; date: Date; courseId: string;
  }
  
  const student: Student = {
    id: "s1001", name: "Alex Johnson", email: "alex.johnson@university.edu",
    profilePic: "https://via.placeholder.com/150"
  };
  
  const courses: Course[] = [ /* same as original data */ ];
  const assignments: Assignment[] = courses
    .filter(c => c.nextAssignment)
    .map(c => c.nextAssignment as Assignment)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  const announcements: Announcement[] = [ /* same as original data */ ];
  
  class Dashboard {
    constructor(
      private student: Student,
      private courses: Course[],
      private assignments: Assignment[],
      private announcements: Announcement[],
      private containerId: string
    ) {
      const container = document.getElementById(containerId)!;
      container.innerHTML = '';
      container.appendChild(this.render());
    }
  
    private render(): HTMLElement {
      const wrap = this.create('div', 'student-dashboard');
      wrap.append(
        this.renderHeader(),
        this.section('Welcome', `Today is ${new Date().toDateString()}. You have ${this.assignments.length} assignments.`),
        this.section('Courses', this.courses.map(c => `${c.title} (${c.progress}%) - Grade: ${c.grade ?? "N/A"}`).join('<br>')),
        this.section('Assignments', this.assignments.map(a => {
          const days = Math.ceil((a.dueDate.getTime() - Date.now()) / 86400000);
          return `<strong>${a.title}</strong> (${a.completed ? '✓' : '✗'}) - Due in ${days} day(s)`;
        }).join('<br>')),
        this.section('Announcements', this.announcements.map(a => `<strong>${a.title}</strong>: ${a.content}`).join('<br>'))
      );
      return wrap;
    }
  
    private renderHeader(): HTMLElement {
      const header = this.create('header', 'dashboard-header');
      header.innerHTML = `
        <div class="dashboard-logo">UniDash</div>
        <div class="profile-section">
          <img src="${this.student.profilePic}" class="profile-pic"/>
          <div><h3>${this.student.name}</h3><p>${this.student.email}</p></div>
        </div>
      `;
      return header;
    }
  
    private section(title: string, content: string): HTMLElement {
      const sec = this.create('section', 'dashboard-card');
      sec.innerHTML = `<h2>${title}</h2><div>${content}</div>`;
      return sec;
    }
  
    private create(tag: string, cls?: string): HTMLElement {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      return el;
    }
  }
  
  // Init
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.id = 'dashboard';
    document.body.appendChild(container);
    new Dashboard(student, courses, assignments, announcements, 'dashboard');
  });
  