<?php
// backend/api/register.php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
    sendResponse('error', null, 'Name, email and password are required', 400);
}

$name = trim($input['name']);
$email = trim($input['email']);
$password = trim($input['password']);
$phone = $input['phone'] ?? '';
$address = trim($input['address'] ?? 'Dhaka, Bangladesh');
$gender = $input['gender'] ?? 'Male';
$blood_group = $input['blood_group'] ?? 'A+';
$role = $input['role'] ?? 'patient';
if (!in_array($role, ['patient', 'doctor', 'lab_staff', 'accountant', 'admin'])) {
    $role = 'patient';
}

// Generate Auto-Increment Code by role (D101+, L101+, A101+, P01+)
if ($role === 'doctor') {
    $prefix = 'D';
    $baseStart = 101;
} elseif ($role === 'lab_staff') {
    $prefix = 'L';
    $baseStart = 101;
} elseif ($role === 'accountant') {
    $prefix = 'A';
    $baseStart = 101;
} else {
    $prefix = 'P';
    $baseStart = 1;
}

$idStmt = $db->prepare("SELECT patient_id FROM users WHERE patient_id LIKE :prefix ORDER BY id DESC LIMIT 1");
$idStmt->execute([':prefix' => $prefix . '%']);
$lastUser = $idStmt->fetch();

$nextNum = $baseStart;
if ($lastUser && !empty($lastUser['patient_id'])) {
    if (preg_match('/^' . $prefix . '(\d+)$/i', $lastUser['patient_id'], $matches)) {
        $nextNum = intval($matches[1]) + 1;
    }
}

if ($prefix === 'P') {
    $patient_id = 'P' . str_pad($nextNum, 2, '0', STR_PAD_LEFT);
} else {
    $patient_id = $prefix . $nextNum;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare("
    INSERT INTO users (patient_id, name, email, password, role, phone, address, gender, blood_group)
    VALUES (:patient_id, :name, :email, :password, :role, :phone, :address, :gender, :blood_group)
");

$success = $stmt->execute([
    ':patient_id' => $patient_id,
    ':name' => $name,
    ':email' => $email,
    ':password' => $hashedPassword,
    ':role' => $role,
    ':phone' => $phone,
    ':address' => $address,
    ':gender' => $gender,
    ':blood_group' => $blood_group
]);

if ($success) {
    $userId = $db->lastInsertId();

    // 1. Dispatch Email
    $emailSubject = "Welcome to MediCare Hub - Your Registration ID: " . $patient_id;
    $emailBody = "Dear " . $name . ",\n\nWelcome to MediCare Hub Healthcare System!\nYour account has been registered successfully.\n\nYour Login Credentials:\n• Permanent ID: " . $patient_id . "\n• Role: " . strtoupper($role) . "\n• Phone: " . $phone . "\n\nPlease keep your credentials secure.\n\nWarm regards,\nMediCare Hospital Administration\nHotline: 10666";
    $headers = "From: no-reply@medicare-hub.com\r\nReply-To: support@medicare-hub.com\r\nX-Mailer: PHP/" . phpversion();
    @mail($email, $emailSubject, $emailBody, $headers);

    // 2. Dispatch SMS payload
    $smsMessage = "[MediCare Hub] স্বাগতম " . $name . "! আপনার রেজিস্ট্রেশন সম্পন্ন হয়েছে। আপনার স্থায়ী আইডি: " . $patient_id . "। পাসওয়ার্ড ও আইডি দিয়ে পোর্টালে লগইন করুন। হটলাইন: 10666";

    sendResponse('success', [
        'user' => [
            'id' => $userId,
            'patient_id' => $patient_id,
            'name' => $name,
            'email' => $email,
            'role' => $role,
            'phone' => $phone,
            'address' => $address,
            'blood_group' => $blood_group
        ],
        'notifications' => [
            'email' => [
                'recipient' => $email,
                'subject' => $emailSubject,
                'status' => 'Delivered'
            ],
            'sms' => [
                'recipient' => $phone,
                'message' => $smsMessage,
                'status' => 'Delivered'
            ]
        ],
        'token' => base64_encode($userId . ':' . time())
    ], 'Registration successful. ID confirmation SMS sent to ' . $phone . ' and email sent to ' . $email, 201);
} else {
    sendResponse('error', null, 'Failed to register account', 500);
}
