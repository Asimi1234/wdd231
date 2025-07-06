document.addEventListener("DOMContentLoaded", () => {
  const courseList = document.getElementById("courseList");
  const creditTotal = document.getElementById("creditTotal");

  const courses = [
    {
      subject: 'CSE',
      number: 110,
      title: 'Introduction to Programming',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'This course will introduce students to programming...',
      technology: ['Python'],
      completed: true
    },
    {
      subject: 'WDD',
      number: 130,
      title: 'Web Fundamentals',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'This course introduces students to the World Wide Web...',
      technology: ['HTML', 'CSS'],
      completed: true
    },
    {
      subject: 'CSE',
      number: 111,
      title: 'Programming with Functions',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'CSE 111 students become more organized, efficient...',
      technology: ['Python'],
      completed: true
    },
    {
      subject: 'CSE',
      number: 210,
      title: 'Programming with Classes',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'This course will introduce the notion of classes and objects...',
      technology: ['C#'],
      completed: true
    },
    {
      subject: 'WDD',
      number: 131,
      title: 'Dynamic Web Fundamentals',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'This course builds on prior experience in Web Fundamentals...',
      technology: ['HTML', 'CSS', 'JavaScript'],
      completed: true
    },
    {
      subject: 'WDD',
      number: 231,
      title: 'Frontend Web Development I',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'This course builds on prior experience with Dynamic Web Fundamentals...',
      technology: ['HTML', 'CSS', 'JavaScript'],
      completed: false
    }
  ];

  const displayCourses = (filteredCourses) => {
    courseList.innerHTML = "";
    let totalCredits = 0;

    filteredCourses.forEach((course) => {
      const div = document.createElement("div");
      div.className = `course ${course.completed ? "completed" : "incomplete"}`;
      div.innerHTML = `
        <strong>${course.subject} ${course.number}</strong>: 
        ${course.title} (${course.credits} credits)
      `;
      courseList.appendChild(div);
      totalCredits += course.credits;
    });

    creditTotal.textContent = totalCredits;
  };

  document.querySelectorAll(".filters button").forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");
      if (filter === "all") {
        displayCourses(courses);
      } else {
        displayCourses(courses.filter(c => c.subject === filter));
      }
    });
  });

  // Initial load
  displayCourses(courses);
});
