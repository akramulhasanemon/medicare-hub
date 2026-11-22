<?php
// backend/api/appointments.php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $patient_id = $_GET['patient_id'] ?? null;
    $status = $_GET['status'] ?? null;

    $query = "
        SELECT a.*, d.name AS doctor_name, d.specialty AS doctor_specialty, d.consultation_fee, d.image_url AS doctor_image
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        WHERE 1=1
    ";

    $params = [];
    if ($patient_id) {
        $query .= " AND a.patient_id = :patient_id";
        $params[':patient_id'] = $patient_id;
    }
    if ($status) {
        $query .= " AND a.status = :status";
        $params[':status'] = $status;
    }

    $query .= " ORDER BY a.appointment_date DESC, a.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $appointments = $stmt->fetchAll();

    sendResponse('success', $appointments, 'Appointments fetched successfully');
}
else if ($method === 'POST') {
    // Book an appointment
    $input = json_decode(file_get_contents("php://input"), true);

    if (empty($input['doctor_id']) || empty($input['patient_name']) || empty($input['patient_phone']) || empty($input['appointment_date'])) {
        sendResponse('error', null, 'Doctor, patient name, phone, and date are required', 400);
    }

    $stmt = $db->prepare("
        INSERT INTO appointments (patient_id, doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, symptoms, status)
        VALUES (:patient_id, :doctor_id, :patient_name, :patient_email, :patient_phone, :appointment_date, :appointment_time, :symptoms, 'pending')
    ");

    $success = $stmt->execute([
        ':patient_id' => $input['patient_id'] ?? null,
        ':doctor_id' => $input['doctor_id'],
        ':patient_name' => $input['patient_name'],
        ':patient_email' => $input['patient_email'] ?? '',
        ':patient_phone' => $input['patient_phone'],
        ':appointment_date' => $input['appointment_date'],
        ':appointment_time' => $input['appointment_time'] ?? '06:00 PM',
        ':symptoms' => $input['symptoms'] ?? 'Regular consultation'
    ]);

    if ($success) {
        $appointmentId = $db->lastInsertId();
        sendResponse('success', ['id' => $appointmentId], 'Appointment booked successfully. Waiting for admin confirmation.', 201);
    } else {
        sendResponse('error', null, 'Failed to book appointment', 500);
    }
}
