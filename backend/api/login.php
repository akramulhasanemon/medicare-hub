<?php
// backend/api/login.php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents("php://input"), true);

$identifier = trim($input['identifier'] ?? $input['email'] ?? $input['patient_id'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($identifier) || empty($password)) {
    sendResponse('error', null, 'Patient ID / Email and password are required', 400);
}

// Find user by Patient ID or Email
$stmt = $db->prepare("
    SELECT id, patient_id, name, email, password, role, phone, blood_group 
    FROM users 
    WHERE email = :ident OR patient_id = :ident 
    LIMIT 1
");
$stmt->execute([':ident' => $identifier]);
$user = $stmt->fetch();

if (!$user) {
    sendResponse('error', null, 'Invalid Patient ID/Email or password', 401);
}

// Check password (supports password_verify or demo password fallback)
$passwordValid = password_verify($password, $user['password']) || ($password === 'password123') || ($password === 'admin123') || ($password === 'patient123');

if ($passwordValid) {
    unset($user['password']); // do not send password hash back
    sendResponse('success', [
        'user' => $user,
        'token' => base64_encode($user['id'] . ':' . time())
    ], 'Login successful');
} else {
    sendResponse('error', null, 'Invalid Patient ID/Email or password', 401);
}
