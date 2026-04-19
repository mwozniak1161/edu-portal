-- Educational ERP Database Schema

-- Users table (Students, Teachers, Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    class_id INTEGER REFERENCES classes(id),  -- NEW: Student's current class
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teacher-Class-Subject junction table (TeacherClass from plan)
CREATE TABLE teacher_classes (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE(teacher_id, subject_id, class_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grades table
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    value DECIMAL(3,2) NOT NULL CHECK (value >= 1.0 AND value <= 6.0),
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    teacher_class_id INTEGER REFERENCES teacher_classes(id) ON DELETE CASCADE,
    weight INTEGER DEFAULT 1 CHECK (weight > 0),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    correction_for_id INTEGER REFERENCES grades(id) ON DELETE SET NULL,
    is_excluded BOOLEAN DEFAULT FALSE,
    UNIQUE(correction_for_id)
);

-- Attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    teacher_class_id INTEGER REFERENCES teacher_classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timeslot table
CREATE TABLE timeslots (
    id SERIAL PRIMARY KEY,
    starting_hour TIME NOT NULL,
    weekday INTEGER NOT NULL CHECK (weekday BETWEEN 1 AND 7),
    length INTEGER DEFAULT 45 CHECK (length > 0),
    teacher_class_id INTEGER REFERENCES teacher_classes(id) ON DELETE CASCADE,
    UNIQUE(teacher_class_id, starting_hour, weekday),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lesson Instances table
CREATE TABLE lesson_instances (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    topic VARCHAR(255),
    comment TEXT,
    teacher_class_id INTEGER REFERENCES teacher_classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);