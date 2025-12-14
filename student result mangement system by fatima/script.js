let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;
let searchInput; // Declare searchInput globally

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById("submitBtn");
  searchInput = document.getElementById("search"); // Assign value

  if (submitBtn) {
    submitBtn.addEventListener("click", addStudent);
  }

  if (searchInput) {
    searchInput.addEventListener("input", searchStudent); // Changed to "input" for better responsiveness
  }

  // Initial display
  displayStudents();
});

function calculateGrade(percentage) {
  if (percentage >= 80) return "A";
  if (percentage >= 60) return "B";
  if (percentage >= 40) return "C";
  return "Fail";
}

function addStudent() {
  const name = document.getElementById("name").value.trim();
  const math = document.getElementById("marks1").value;
  const physics = document.getElementById("marks2").value;
  const cs = document.getElementById("marks3").value;

  if (!name) {
    alert("Please enter student name");
    return;
  }

  // Convert to numbers and validate
  const mathNum = Number(math);
  const physicsNum = Number(physics);
  const csNum = Number(cs);

  if ([mathNum, physicsNum, csNum].some((m) => m < 0 || m > 100 || isNaN(m))) {
    alert("Marks must be between 0 and 100");
    return;
  }

  const total = mathNum + physicsNum + csNum;
  const percentage = (total / 300) * 100;
  const grade = calculateGrade(percentage);

  const student = {
    name,
    math: mathNum,
    physics: physicsNum,
    cs: csNum,
    total,
    percentage: percentage.toFixed(2),
    grade,
  };

  if (editIndex === null) {
    students.push(student);
  } else {
    students[editIndex] = student;
    editIndex = null;
    submitBtn.textContent = "Add Student";
  }

  localStorage.setItem("students", JSON.stringify(students));
  clearInputs();
  displayStudents();
}

function displayStudents() {
  const tbody = document.getElementById("tableBody");
  if (!tbody) {
    console.error("Table body not found!");
    return;
  }

  tbody.innerHTML = "";

  students.forEach((s, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${s.name}</td>
            <td>${s.math}</td>
            <td>${s.physics}</td>
            <td>${s.cs}</td>
            <td>${s.total}</td>
            <td>${s.percentage}%</td>
            <td>${s.grade}</td>
            <td>
                <button class="edit" onclick="editStudent(${index})">Edit</button>
                <button class="delete" onclick="deleteStudent(${index})">Delete</button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function editStudent(index) {
  const s = students[index];
  document.getElementById("name").value = s.name;
  document.getElementById("marks1").value = s.math;
  document.getElementById("marks2").value = s.physics;
  document.getElementById("marks3").value = s.cs;

  editIndex = index;
  document.getElementById("submitBtn").textContent = "Update Student";
}

function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
  }
}

function searchStudent() {
  // Check if searchInput is defined
  if (!searchInput) {
    searchInput = document.getElementById("search");
  }

  const value = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll("#tableBody tr");

  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(value) ? "" : "none";
  });
}

function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("marks1").value = "";
  document.getElementById("marks2").value = "";
  document.getElementById("marks3").value = "";

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.textContent = "Add Student";
  }
}

// Make functions globally accessible for onclick attributes
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.searchStudent = searchStudent; // Added this line
window.addStudent = addStudent;
window.clearInputs = clearInputs;
