
// In-memory database simulation
let students = [];
let currentStudentId = 1;

// Initialize with sample data
function initializeSampleData() {
    const sampleStudents = [
        {
            id: 1,
            studentId: 'STU001',
            firstName: 'Kwame',
            lastName: 'Asante',
            dateOfBirth: '2015-03-15',
            gender: 'Male',
            currentClass: 'Primary 3',
            parentName: 'John Asante',
            parentPhone: '0244123456',
            address: '123 Main St, Kumasi',
            termFees: 500.00,
            paidAmount: 300.00,
            dateAdded: new Date().toISOString()
        },
        {
            id: 2,
            studentId: 'STU002',
            firstName: 'Akosua',
            lastName: 'Owusu',
            dateOfBirth: '2014-07-20',
            gender: 'Female',
            currentClass: 'Primary 4',
            parentName: 'Mary Owusu',
            parentPhone: '0244987654',
            address: '456 Oak Ave, Kumasi',
            termFees: 500.00,
            paidAmount: 500.00,
            dateAdded: new Date().toISOString()
        },
        {
            id: 3,
            studentId: 'STU003',
            firstName: 'Yaw',
            lastName: 'Mensah',
            dateOfBirth: '2016-01-10',
            gender: 'Male',
            currentClass: 'Primary 2',
            parentName: 'Peter Mensah',
            parentPhone: '0244456789',
            address: '789 Pine Rd, Kumasi',
            termFees: 450.00,
            paidAmount: 150.00,
            dateAdded: new Date().toISOString()
        }
    ];
    
    students = sampleStudents;
    currentStudentId = 4;
    updateDashboard();
}

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to selected tab
    event.target.classList.add('active');
    
    // Load specific tab data
    switch(tabName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'owing-students':
            loadOwingStudents();
            break;
        case 'find-student':
            searchStudents();
            break;
    }
}

// Add student functionality
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const studentData = Object.fromEntries(formData);
    
    // Check if student ID already exists
    if (students.some(s => s.studentId === studentData.studentId)) {
        showAlert('Student ID already exists!', 'error');
        return;
    }
    
    // Add new student
    const newStudent = {
        id: currentStudentId++,
        ...studentData,
        termFees: parseFloat(studentData.termFees),
        paidAmount: parseFloat(studentData.paidAmount || 0),
        dateAdded: new Date().toISOString()
    };
    
    students.push(newStudent);
    showAlert('Student added successfully!', 'success');
    e.target.reset();
    updateDashboard();
});

// Search students functionality
function searchStudents() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
    const searchClass = document.getElementById('searchClass').value;
    
    let filteredStudents = students;
    
    if (searchTerm) {
        filteredStudents = filteredStudents.filter(student => 
            student.firstName.toLowerCase().includes(searchTerm) ||
            student.lastName.toLowerCase().includes(searchTerm) ||
            student.studentId.toLowerCase().includes(searchTerm)
        );
    }
    
    if (searchClass) {
        filteredStudents = filteredStudents.filter(student => 
            student.currentClass === searchClass
        );
    }
    
    displayStudentTable(filteredStudents, 'searchResults');
}

// Display student table
function displayStudentTable(studentList, containerId) {
    const container = document.getElementById(containerId);
    
    if (studentList.length === 0) {
        container.innerHTML = '<div class="no-data">No students found.</div>';
        return;
    }
    
    let tableHTML = `
        <table class="student-table">
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Gender</th>
                    <th>Parent/Guardian</th>
                    <th>Phone</th>
                    <th>Fee Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    studentList.forEach(student => {
        const balance = student.termFees - student.paidAmount;
        const statusClass = balance > 0 ? 'status-owing' : 'status-paid';
        const statusText = balance > 0 ? `Owes ₵${balance.toFixed(2)}` : 'Paid';
        
        tableHTML += `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.currentClass}</td>
                <td>${student.gender}</td>
                <td>${student.parentName}</td>
                <td>${student.parentPhone}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

// Load students for promotion
function loadStudentsForPromotion() {
    const fromClass = document.getElementById('promoteFromClass').value;
    
    if (!fromClass) {
        showAlert('Please select a class to promote from.', 'error');
        return;
    }
    
    const studentsToPromote = students.filter(student => student.currentClass === fromClass);
    
    if (studentsToPromote.length === 0) {
        document.getElementById('promotionStudents').innerHTML = '<div class="no-data">No students found in this class.</div>';
        return;
    }
    
    let promotionHTML = `
        <div style="margin-bottom: 20px;">
            <button class="btn btn-primary" onclick="promoteSelectedStudents()">Promote Selected Students</button>
        </div>
        <table class="student-table">
            <thead>
                <tr>
                    <th><input type="checkbox" id="selectAll" onchange="selectAllStudents()"></th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Current Class</th>
                    <th>Fee Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    studentsToPromote.forEach(student => {
        const balance = student.termFees - student.paidAmount;
        const statusClass = balance > 0 ? 'status-owing' : 'status-paid';
        const statusText = balance > 0 ? `Owes ₵${balance.toFixed(2)}` : 'Paid';
        
        promotionHTML += `
            <tr>
                <td><input type="checkbox" class="student-checkbox" value="${student.id}"></td>
                <td>${student.studentId}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.currentClass}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });
    
    promotionHTML += '</tbody></table>';
    document.getElementById('promotionStudents').innerHTML = promotionHTML;
}

// Select all students for promotion
function selectAllStudents() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.student-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

// Promote selected students
function promoteSelectedStudents() {
    const toClass = document.getElementById('promoteToClass').value;
    const selectedStudents = Array.from(document.querySelectorAll('.student-checkbox:checked'))
        .map(checkbox => parseInt(checkbox.value));
    
    if (!toClass) {
        showAlert('Please select a class to promote to.', 'error');
        return;
    }
    
    if (selectedStudents.length === 0) {
        showAlert('Please select at least one student to promote.', 'error');
        return;
    }
    
    selectedStudents.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (student) {
            student.currentClass = toClass;
        }
    });
    
    showAlert(`Successfully promoted ${selectedStudents.length} students to ${toClass}!`, 'success');
    loadStudentsForPromotion();
    updateDashboard();
}

// Load owing students
function loadOwingStudents() {
    const owingStudents = students.filter(student => {
        const balance = student.termFees - student.paidAmount;
        return balance > 0;
    });
    
    if (owingStudents.length === 0) {
        document.getElementById('owingStudentsList').innerHTML = '<div class="no-data">No students are currently owing fees.</div>';
        return;
    }
    
    let owingHTML = `
        <table class="student-table">
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Term Fees</th>
                    <th>Paid Amount</th>
                    <th>Balance</th>
                    <th>Parent/Guardian</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    owingStudents.forEach(student => {
        const balance = student.termFees - student.paidAmount;
        
        owingHTML += `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.currentClass}</td>
                <td>₵${student.termFees.toFixed(2)}</td>
                <td>₵${student.paidAmount.toFixed(2)}</td>
                <td><strong>₵${balance.toFixed(2)}</strong></td>
                <td>${student.parentName}</td>
                <td>${student.parentPhone}</td>
                <td>
                    <button class="btn btn-success" onclick="recordPayment(${student.id})">Record Payment</button>
                </td>
            </tr>
        `;
    });
    
    owingHTML += '</tbody></table>';
    document.getElementById('owingStudentsList').innerHTML = owingHTML;
}

// Record payment for a student
function recordPayment(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const balance = student.termFees - student.paidAmount;
    const amount = prompt(`Student: ${student.firstName} ${student.lastName}
    Current Balance: ₵${balance.toFixed(2)}
    Enter payment amount:`);
    
    if (amount && !isNaN(amount)) {
        const paymentAmount = parseFloat(amount);
        if (paymentAmount > 0 && paymentAmount <= balance) {
            student.paidAmount += paymentAmount;
            showAlert(`Payment of ₵${paymentAmount.toFixed(2)} recorded for ${student.firstName} ${student.lastName}`, 'success');
            loadOwingStudents();
            updateDashboard();
        } else {
            showAlert('Invalid payment amount!', 'error');
        }
    }
}

// Search student for fee management
function searchStudentForFees() {
    const searchTerm = document.getElementById('feeSearchTerm').value.toLowerCase();
    
    if (!searchTerm) {
        showAlert('Please enter a search term.', 'error');
        return;
    }
    
    const foundStudents = students.filter(student => 
        student.firstName.toLowerCase().includes(searchTerm) ||
        student.lastName.toLowerCase().includes(searchTerm) ||
        student.studentId.toLowerCase().includes(searchTerm)
    );
    
    if (foundStudents.length === 0) {
        document.getElementById('feeManagementResults').innerHTML = '<div class="no-data">No students found.</div>';
        return;
    }
    
    let feeHTML = `
        <table class="student-table">
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Term Fees</th>
                    <th>Paid Amount</th>
                    <th>Balance</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    foundStudents.forEach(student => {
        const balance = student.termFees - student.paidAmount;
        
        feeHTML += `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.currentClass}</td>
                <td>₵${student.termFees.toFixed(2)}</td>
                <td>₵${student.paidAmount.toFixed(2)}</td>
                <td><strong>₵${balance.toFixed(2)}</strong></td>
                <td>
                    <button class="btn btn-success" onclick="recordPayment(${student.id})">Record Payment</button>
                    <button class="btn btn-warning" onclick="updateFees(${student.id})">Update Fees</button>
                </td>
            </tr>
        `;
    });
    
    feeHTML += '</tbody></table>';
    document.getElementById('feeManagementResults').innerHTML = feeHTML;
}

// Update student fees
function updateFees(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const newFees = prompt(`Student: ${student.firstName} ${student.lastName}
    Current Term Fees: ₵${student.termFees.toFixed(2)}
    Enter new term fees:`);
    
    if (newFees && !isNaN(newFees)) {
        const feeAmount = parseFloat(newFees);
        if (feeAmount > 0) {
            student.termFees = feeAmount;
            showAlert(`Term fees updated to ₵${feeAmount.toFixed(2)} for ${student.firstName} ${student.lastName}`, 'success');
            searchStudentForFees();
            updateDashboard();
        } else {
            showAlert('Invalid fee amount!', 'error');
        }
    }
}

// Edit student
function editStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Fill the form with student data
    document.getElementById('firstName').value = student.firstName;
    document.getElementById('lastName').value = student.lastName;
    document.getElementById('studentId').value = student.studentId;
    document.getElementById('dateOfBirth').value = student.dateOfBirth;
    document.getElementById('gender').value = student.gender;
    document.getElementById('currentClass').value = student.currentClass;
    document.getElementById('parentName').value = student.parentName;
    document.getElementById('parentPhone').value = student.parentPhone;
    document.getElementById('address').value = student.address;
    document.getElementById('termFees').value = student.termFees;
    document.getElementById('paidAmount').value = student.paidAmount;
    
    // Change form to edit mode
    const form = document.getElementById('studentForm');
    form.setAttribute('data-editing', studentId);
    
    // Change button text
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Update Student';
    submitButton.classList.remove('btn-primary');
    submitButton.classList.add('btn-warning');
    
    // Switch to add student tab
    switchTab('add-student');
    document.querySelector('.nav-tab[onclick="switchTab(\'add-student\')"]').click();
}

// Delete student
function deleteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    if (confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
        students = students.filter(s => s.id !== studentId);
        showAlert('Student deleted successfully!', 'success');
        searchStudents();
        updateDashboard();
    }
}

// Update dashboard statistics
function updateDashboard() {
    const totalStudents = students.length;
    const studentsOwing = students.filter(s => (s.termFees - s.paidAmount) > 0).length;
    const totalOwedAmount = students.reduce((sum, s) => {
        const balance = s.termFees - s.paidAmount;
        return sum + (balance > 0 ? balance : 0);
    }, 0);
    const classes = [...new Set(students.map(s => s.currentClass))];
    
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('studentsOwing').textContent = studentsOwing;
    document.getElementById('totalOwedAmount').textContent = `₵${totalOwedAmount.toFixed(2)}`;
    document.getElementById('classesCount').textContent = classes.length;
}

// Show alert messages
function showAlert(message, type) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    const alertHTML = `<div class="alert ${alertClass}">${message}</div>`;
    
    // Show alert at the top of the current tab
    const activeTab = document.querySelector('.tab-content.active');
    const existingAlert = activeTab.querySelector('.alert');
    
    if (existingAlert) {
        existingAlert.remove();
    }
    
    activeTab.insertAdjacentHTML('afterbegin', alertHTML);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        const alert = activeTab.querySelector('.alert');
        if (alert) alert.remove();
    }, 5000);
}

// Handle form submission for both add and edit
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const studentData = Object.fromEntries(formData);
    const editingId = e.target.getAttribute('data-editing');
    
    if (editingId) {
        // Edit existing student
        const student = students.find(s => s.id === parseInt(editingId));
        if (student) {
            // Check if student ID is being changed to an existing one
            if (studentData.studentId !== student.studentId && 
                students.some(s => s.studentId === studentData.studentId)) {
                showAlert('Student ID already exists!', 'error');
                return;
            }
            
            // Update student data
            Object.assign(student, {
                ...studentData,
                termFees: parseFloat(studentData.termFees),
                paidAmount: parseFloat(studentData.paidAmount || 0)
            });
            
            showAlert('Student updated successfully!', 'success');
            
            // Reset form to add mode
            e.target.removeAttribute('data-editing');
            const submitButton = e.target.querySelector('button[type="submit"]');
            submitButton.textContent = 'Add Student';
            submitButton.classList.remove('btn-warning');
            submitButton.classList.add('btn-primary');
            
            e.target.reset();
            updateDashboard();
        }
    } else {
        // Add new student
        if (students.some(s => s.studentId === studentData.studentId)) {
            showAlert('Student ID already exists!', 'error');
            return;
        }
        
        const newStudent = {
            id: currentStudentId++,
            ...studentData,
            termFees: parseFloat(studentData.termFees),
            paidAmount: parseFloat(studentData.paidAmount || 0),
            dateAdded: new Date().toISOString()
        };
        
        students.push(newStudent);
        showAlert('Student added successfully!', 'success');
        e.target.reset();
        updateDashboard();
    }
});

// Initialize the system
initializeSampleData();

// Auto-search on input change
document.getElementById('searchTerm').addEventListener('input', function() {
    if (this.value.length >= 2 || this.value.length === 0) {
        searchStudents();
    }
});

document.getElementById('searchClass').addEventListener('change', searchStudents);

document.getElementById('feeSearchTerm').addEventListener('input', function() {
    if (this.value.length >= 2) {
        searchStudentForFees();
    }
});

// --- PROMOTE STUDENTS FEATURE ---
const classOrder = [
    'Nursery 1', 'Nursery 2', 'KG 1', 'KG 2',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JHS 1', 'JHS 2', 'JHS 3'
];

function getNextClass(currentClass) {
    const idx = classOrder.indexOf(currentClass);
    if (idx !== -1 && idx < classOrder.length - 1) {
        return classOrder[idx + 1];
    }
    return null; // No next class
}

function isPassing(grade) {
    return Number(grade) >= 50;
}

// Populate 'to' class dropdown based on 'from' class
const promoteFromClass = document.getElementById('promoteFromClass');
const promoteToClass = document.getElementById('promoteToClass');
promoteFromClass.addEventListener('change', function() {
    const fromClass = promoteFromClass.value;
    promoteToClass.innerHTML = '<option value="">-- Select Next Class --</option>';
    const next = getNextClass(fromClass);
    if (next) {
        const opt = document.createElement('option');
        opt.value = next;
        opt.textContent = next;
        promoteToClass.appendChild(opt);
    }
});

// Handle class selection and loading students
const promoteForm = document.getElementById('promoteClassForm');
promoteForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fromClass = promoteFromClass.value;
    const toClass = promoteToClass.value;
    renderPromoteStudentsTable(fromClass, toClass);
});

function renderPromoteStudentsTable(fromClass, toClass) {
    const section = document.getElementById('promoteStudentsSection');
    document.getElementById('failedStudentsSection').innerHTML = '';
    if (!fromClass || !toClass) {
        section.innerHTML = '';
        return;
    }
    const classStudents = students.filter(s => s.currentClass === fromClass);
    if (classStudents.length === 0) {
        section.innerHTML = '<div class="no-data">No students found in this class.</div>';
        return;
    }
    let table = `<table class="student-table"><thead><tr><th>Student ID</th><th>Name</th><th>Grade (%)</th><th>Status</th></tr></thead><tbody>`;
    classStudents.forEach(s => {
        const pass = isPassing(s.currentGrade);
        table += `<tr><td>${s.studentId}</td><td>${s.firstName} ${s.lastName}</td><td>${s.currentGrade ?? ''}</td><td><span class="status-badge" style="background:${pass ? '#C8E6C9' : '#FFCDD2'};color:${pass ? '#388e3c' : '#d32f2f'}">${pass ? 'Pass' : 'Repeat'}</span></td></tr>`;
    });
    table += '</tbody></table>';
    section.innerHTML = table + `<button class="btn" style="margin-top:14px;" onclick="promoteClassAction('${fromClass}','${toClass}')">Promote</button><div id="promoteSummary" style="margin-top:12px;"></div>`;
}

window.promoteClassAction = function(fromClass, toClass) {
    const classStudents = students.filter(s => s.currentClass === fromClass);
    let promoted = [], repeated = [];
    classStudents.forEach(s => {
        if (isPassing(s.currentGrade)) {
            s.currentClass = toClass;
            promoted.push(`${s.firstName} ${s.lastName}`);
        } else {
            repeated.push(s);
        }
    });
    renderPromoteStudentsTable(fromClass, toClass); // Refresh table
    let summary = '';
    if (promoted.length > 0) {
        summary += `<div class="alert alert-success">Promoted: ${promoted.join(', ')}</div>`;
    }
    document.getElementById('promoteSummary').innerHTML = summary;
    // Show failed students section
    if (repeated.length > 0) {
        let failedHTML = `<div class="alert alert-error">The following students failed and will repeat <b>${fromClass}</b>:</div>`;
        failedHTML += `<ul style="margin: 8px 0 0 18px;">`;
        repeated.forEach(s => {
            failedHTML += `<li>${s.firstName} ${s.lastName} (Grade: ${s.currentGrade ?? ''})</li>`;
        });
        failedHTML += '</ul>';
        document.getElementById('failedStudentsSection').innerHTML = failedHTML;
    } else {
        document.getElementById('failedStudentsSection').innerHTML = '';
    }
    updateDashboard();
};

// ... existing code ...
// --- BEST STUDENTS LOGIC ---
const departmentMap = {
    'preschool': ['Nursery 1', 'Nursery 2', 'KG 1', 'KG 2'],
    'lower-primary': ['Primary 1', 'Primary 2', 'Primary 3'],
    'upper-primary': ['Primary 4', 'Primary 5', 'Primary 6'],
    'jhs': ['JHS 1', 'JHS 2', 'JHS 3']
};
const departmentNames = {
    'preschool': 'Pre-School',
    'lower-primary': 'Lower Primary',
    'upper-primary': 'Upper Primary',
    'jhs': 'Junior High School'
};

function getBestStudents(studentList, count = 1) {
    // Only consider students with a valid grade
    const filtered = studentList.filter(s => s.currentGrade !== undefined && s.currentGrade !== null && s.currentGrade !== '');
    if (filtered.length === 0) return [];
    const sorted = filtered.sort((a, b) => Number(b.currentGrade) - Number(a.currentGrade));
    const topGrade = Number(sorted[0].currentGrade);
    // Return all students with the top grade (handle ties)
    return sorted.filter(s => Number(s.currentGrade) === topGrade);
}

function renderBestStudentsSection(containerId, students, contextLabel = '') {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!students || students.length === 0) {
        container.innerHTML = '<div class="no-data">No data available.</div>';
        return;
    }
    let html = '';
    students.forEach((s, idx) => {
        html += `<div class="best-student-card">
            <div class="student-rank">${idx + 1}</div>
            <div class="student-info">
                <div class="student-name">${s.firstName} ${s.lastName}</div>
                <div class="student-details">${contextLabel ? contextLabel + ' | ' : ''}${s.currentClass} | Grade: <b>${s.currentGrade}</b></div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function updateAllBestStudents() {
    // Whole school
    renderBestStudentsSection('schoolBestStudents', getBestStudents(students), 'Whole School');
    // By department
    let deptHtml = '';
    Object.keys(departmentMap).forEach(deptKey => {
        const deptStudents = students.filter(s => departmentMap[deptKey].includes(s.currentClass));
        const best = getBestStudents(deptStudents);
        if (best.length > 0) {
            deptHtml += `<div style="margin-bottom:10px;"><b>${departmentNames[deptKey]}</b>`;
            best.forEach((s, idx) => {
                deptHtml += `<div class="best-student-card">
                    <div class="student-rank">${idx + 1}</div>
                    <div class="student-info">
                        <div class="student-name">${s.firstName} ${s.lastName}</div>
                        <div class="student-details">${s.currentClass} | Grade: <b>${s.currentGrade}</b></div>
                    </div>
                </div>`;
            });
            deptHtml += `</div>`;
        }
    });
    document.getElementById('departmentBestStudents').innerHTML = deptHtml || '<div class="no-data">No data available.</div>';
    // By class
    let classHtml = '';
    classOrder.forEach(cls => {
        const classStudents = students.filter(s => s.currentClass === cls);
        const best = getBestStudents(classStudents);
        if (best.length > 0) {
            classHtml += `<div style="margin-bottom:10px;"><b>${cls}</b>`;
            best.forEach((s, idx) => {
                classHtml += `<div class="best-student-card">
                    <div class="student-rank">${idx + 1}</div>
                    <div class="student-info">
                        <div class="student-name">${s.firstName} ${s.lastName}</div>
                        <div class="student-details">Grade: <b>${s.currentGrade}</b></div>
                    </div>
                </div>`;
            });
            classHtml += `</div>`;
        }
    });
    document.getElementById('classBestStudents').innerHTML = classHtml || '<div class="no-data">No data available.</div>';
    // Department tab (optional: show all departments)
    let deptTabHtml = '';
    Object.keys(departmentMap).forEach(deptKey => {
        const deptStudents = students.filter(s => departmentMap[deptKey].includes(s.currentClass));
        const best = getBestStudents(deptStudents);
        if (best.length > 0) {
            deptTabHtml += `<div style="margin-bottom:10px;"><b>${departmentNames[deptKey]}</b>`;
            best.forEach((s, idx) => {
                deptTabHtml += `<div class="best-student-card">
                    <div class="student-rank">${idx + 1}</div>
                    <div class="student-info">
                        <div class="student-name">${s.firstName} ${s.lastName}</div>
                        <div class="student-details">${s.currentClass} | Grade: <b>${s.currentGrade}</b></div>
                    </div>
                </div>`;
            });
            deptTabHtml += `</div>`;
        }
    });
    document.getElementById('departmentTabBestStudents').innerHTML = deptTabHtml || '<div class="no-data">No data available.</div>';
}

// Call updateAllBestStudents after any student data change
// Add to updateDashboard and after promotions, edits, etc.
const _origUpdateDashboard = updateDashboard;
updateDashboard = function() {
    _origUpdateDashboard();
    updateAllBestStudents();
};
// Initial call
updateAllBestStudents();
// ... existing code ...
