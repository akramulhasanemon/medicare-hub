<?php
// backend/api/doctors.php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $dept = $_GET['department_id'] ?? null;
    $search = $_GET['search'] ?? null;

    $query = "
        SELECT d.*, dept.name AS department_name
        FROM doctors d
        LEFT JOIN departments dept ON d.department_id = dept.id
        WHERE d.is_active = 1
    ";

    $params = [];
    if ($dept) {
        $query .= " AND d.department_id = :dept";
        $params[':dept'] = $dept;
    }
    if ($search) {
        $query .= " AND (d.name LIKE :search OR d.specialty LIKE :search OR dept.name LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }

    $query .= " ORDER BY d.id ASC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $doctors = $stmt->fetchAll();

    sendResponse('success', $doctors, 'Doctors retrieved successfully');
} 
else if ($method === 'POST') {
    // Add Doctor (Admin only)
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (empty($input['name']) || empty($input['specialty'])) {
        sendResponse('error', null, 'Doctor name and specialty are required', 400);
    }

    $stmt = $db->prepare("
        INSERT INTO doctors (name, specialty, department_id, qualification, experience_years, consultation_fee, available_days, available_time, bio, image_url)
        VALUES (:name, :specialty, :department_id, :qualification, :experience_years, :consultation_fee, :available_days, :available_time, :bio, :image_url)
    ");

    $success = $stmt->execute([
        ':name' => $input['name'],
        ':specialty' => $input['specialty'],
        ':department_id' => $input['department_id'] ?? 1,
        ':qualification' => $input['qualification'] ?? 'MBBS',
        ':experience_years' => $input['experience_years'] ?? 5,
        ':consultation_fee' => $input['consultation_fee'] ?? 500.00,
        ':available_days' => $input['available_days'] ?? 'Sat, Sun, Tue, Thu',
        ':available_time' => $input['available_time'] ?? '05:00 PM - 09:00 PM',
        ':bio' => $input['bio'] ?? '',
        ':image_url' => $input['image_url'] ?? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
    ]);

    if ($success) {
        sendResponse('success', ['id' => $db->lastInsertId()], 'Doctor added successfully', 201);
    } else {
        sendResponse('error', null, 'Failed to add doctor', 500);
    }
}
