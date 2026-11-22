<?php
// backend/api/update_appointment.php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['id']) || empty($input['status'])) {
    sendResponse('error', null, 'Appointment ID and status are required', 400);
}

$id = $input['id'];
$status = $input['status']; // 'confirmed', 'completed', 'cancelled'
$notes = $input['admin_notes'] ?? null;

$stmt = $db->prepare("
    UPDATE appointments 
    SET status = :status, admin_notes = COALESCE(:notes, admin_notes)
    WHERE id = :id
");

$success = $stmt->execute([
    ':status' => $status,
    ':notes' => $notes,
    ':id' => $id
]);

if ($success) {
    sendResponse('success', ['id' => $id, 'status' => $status], 'Appointment updated successfully');
} else {
    sendResponse('error', null, 'Failed to update appointment', 500);
}
