<?php
// backend/api/update_profile.php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents("php://input"), true);

$patient_id = trim($input['patient_id'] ?? '');

if (empty($patient_id)) {
    sendResponse('error', null, 'Patient/Staff ID is required to identify account', 400);
}

// Find existing user by permanent ID
$checkStmt = $db->prepare("SELECT id, patient_id, name, email, role, phone, address, blood_group FROM users WHERE patient_id = :pid LIMIT 1");
$checkStmt->execute([':pid' => $patient_id]);
$user = $checkStmt->fetch();

if (!$user) {
    sendResponse('error', null, 'User not found with ID ' . $patient_id, 404);
}

// Build update fields - NOTICE: patient_id is NEVER updated!
$updateFields = [];
$params = [':pid' => $patient_id];

if (isset($input['name']) && !empty(trim($input['name']))) {
    $updateFields[] = "name = :name";
    $params[':name'] = trim($input['name']);
}

if (isset($input['phone'])) {
    $updateFields[] = "phone = :phone";
    $params[':phone'] = trim($input['phone']);
}

if (isset($input['address'])) {
    $updateFields[] = "address = :address";
    $params[':address'] = trim($input['address']);
}

if (isset($input['password']) && !empty(trim($input['password']))) {
    $updateFields[] = "password = :password";
    $params[':password'] = password_hash(trim($input['password']), PASSWORD_DEFAULT);
}

if (empty($updateFields)) {
    sendResponse('error', null, 'No profile fields provided to update', 400);
}

$sql = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE patient_id = :pid";
$stmt = $db->prepare($sql);
$success = $stmt->execute($params);

if ($success) {
    // Re-fetch updated user
    $refetch = $db->prepare("SELECT id, patient_id, name, email, role, phone, address, blood_group FROM users WHERE patient_id = :pid LIMIT 1");
    $refetch->execute([':pid' => $patient_id]);
    $updatedUser = $refetch->fetch();

    sendResponse('success', [
        'user' => $updatedUser
    ], 'Profile updated successfully. Permanent ID ' . $patient_id . ' remains locked.');
} else {
    sendResponse('error', null, 'Failed to update profile', 500);
}
