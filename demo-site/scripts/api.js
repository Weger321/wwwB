const API_URL = 'http://localhost:3000';

// Регистрация
async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка регистрации');
  }
  return response.json();
}

// Вход
async function loginUser(login, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка входа');
  }
  return response.json();
}

// Получение курсов
async function getCourses() {
  const response = await fetch(`${API_URL}/courses`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки курсов');
  }
  return response.json();
}

// Запись на курс
async function enrollCourse(userId, courseId, title) {
  const response = await fetch(`${API_URL}/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, course_id: courseId, title })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка записи на курс');
  }
  return response.json();
}

// Получение прогресса
async function getStudentProgress(userId) {
  const response = await fetch(`${API_URL}/progress/${userId}`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки прогресса');
  }
  return response.json();
}

// Добавление курса
async function addCourse(courseData) {
  const response = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка добавления курса');
  }
  return response.json();
}

// Поиск учеников
async function searchStudents(query) {
  const response = await fetch(`${API_URL}/students?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Ошибка поиска учеников');
  }
  return response.json();
}

// Получение прогресса ученика
async function getStudentProgressById(studentId) {
  const response = await fetch(`${API_URL}/student/progress?student_id=${studentId}`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки прогресса');
  }
  return response.json();
}

// Удаление аккаунта
async function deleteUser(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка удаления аккаунта');
  }
}


