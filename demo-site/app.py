from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

DATA_FILE = 'data.json'

def read_data():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Регистрация
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    users = read_data()['users']
    if any(u['login'] == data['login'] for u in users):
        return jsonify({"error": "Логин уже занят"}), 400
    if any(u['email'] == data['email'] for u in users):
        return jsonify({"error": "Email уже занят"}), 400

    new_user = {
        "id": len(users) + 1,
        "login": data['login'],
        "password": data['password'],
        "email": data['email'],
        "role": data['role']
    }
    users.append(new_user)
    write_data({"users": users, "courses": read_data()['courses'], "progress": read_data()['progress']})
    return jsonify(new_user), 201

# Вход
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    users = read_data()['users']
    user = next((u for u in users if u['login'] == data['login'] and u['password'] == data['password']), None)
    if not user:
        return jsonify({"error": "Неверный логин или пароль"}), 401
    return jsonify(user), 200

# Получение курсов
@app.route('/courses', methods=['GET'])
def get_courses():
    data = read_data()
    return jsonify(data['courses']), 200

# Запись на курс
@app.route('/enroll', methods=['POST'])
def enroll():
    data = request.json
    user_courses = read_data()['progress']
    if any(c['user_id'] == data['user_id'] and c['course_id'] == data['course_id'] for c in user_courses):
        return jsonify({"error": "Вы уже записаны на этот курс"}), 400

    new_progress = {
        "user_id": data['user_id'],
        "course_id": data['course_id'],
        "title": data['title'],
        "progress": 0,
        "lessons": []
    }
    user_courses.append(new_progress)
    write_data({"users": read_data()['users'], "courses": read_data()['courses'], "progress": user_courses})
    return jsonify(new_progress), 201

# Получение прогресса
@app.route('/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    data = read_data()
    progress = [p for p in data['progress'] if p['user_id'] == user_id]
    return jsonify(progress), 200

# Добавление курса
@app.route('/courses', methods=['POST'])
def add_course():
    course_data = request.json
    data = read_data()
    course_id = max([c['id'] for c in data['courses']], default=0) + 1
    end_date = datetime.now() + timedelta(days=int(course_data['duration'].split()[0]) * 30)

    new_course = {
        "id": course_id,
        "title": course_data['title'],
        "desc": course_data['desc'],
        "duration": course_data['duration'],
        "price": course_data['price'],
        "teacher": course_data['teacher'],
        "end_date": end_date.strftime('%Y-%m-%d'),
        "lessons": []
    }

    data['courses'].append(new_course)
    write_data(data)
    return jsonify(new_course), 201

# Поиск учеников
@app.route('/students', methods=['GET'])
def search_students():
    query = request.args.get('q', '')
    users = read_data()['users']
    students = [u for u in users if u['role'] == 'student' and (query.lower() in u['login'].lower() or query.lower() in u['email'].lower())]
    return jsonify(students), 200

# Получение прогресса ученика
@app.route('/student/progress', methods=['GET'])
def get_student_progress():
    student_id = int(request.args.get('student_id'))
    data = read_data()
    progress = [p for p in data['progress'] if p['user_id'] == student_id]
    return jsonify(progress), 200

# Удаление аккаунта
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    data = read_data()
    data['users'] = [u for u in data['users'] if u['id'] != user_id]
    data['progress'] = [p for p in data['progress'] if p['user_id'] != user_id]
    write_data(data)
    return jsonify({"success": True}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)


