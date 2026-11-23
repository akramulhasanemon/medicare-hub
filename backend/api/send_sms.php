<?php
// backend/api/send_sms.php
// Real Cellular SMS Gateway Dispatcher for Bangladesh Telecom Operators

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$phone = trim($input['phone'] ?? '');
$message = trim($input['message'] ?? '');
$provider = strtolower(trim($input['provider'] ?? 'bulksmsbd'));
$apiKey = trim($input['api_key'] ?? '');
$senderId = trim($input['sender_id'] ?? '');

if (empty($phone) || empty($message)) {
    echo json_encode(['status' => 'error', 'message' => 'Phone number and message are required']);
    exit;
}

// Clean phone number (e.g. 01568812468 -> 8801568812468 or 01568812468 depending on gateway)
$cleanPhone = preg_replace('/[^0-9]/', '', $phone);
if (strlen($cleanPhone) === 11 && strpos($cleanPhone, '01') === 0) {
    $fullBdNumber = '88' . $cleanPhone;
} elseif (strlen($cleanPhone) === 13 && strpos($cleanPhone, '8801') === 0) {
    $fullBdNumber = $cleanPhone;
    $cleanPhone = substr($cleanPhone, 2);
} else {
    $fullBdNumber = '88' . $cleanPhone;
}

// Check if config exists on disk if apiKey is empty
$configFile = __DIR__ . '/../config/sms_config.json';
if (empty($apiKey) && file_exists($configFile)) {
    $savedConfig = json_decode(file_get_contents($configFile), true);
    if (!empty($savedConfig['api_key'])) {
        $apiKey = $savedConfig['api_key'];
        $provider = $savedConfig['provider'] ?? $provider;
        $senderId = $savedConfig['sender_id'] ?? $senderId;
    }
}

if (!empty($apiKey)) {
    $responseOutput = null;
    $url = '';

    if ($provider === 'greenweb') {
        // Greenweb SMS API
        $url = 'https://api.greenweb.com.bd/api.php';
        $postData = [
            'token' => $apiKey,
            'to' => $fullBdNumber,
            'message' => $message
        ];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $responseOutput = curl_exec($ch);
        curl_close($ch);
    } else {
        // Default: BulkSMSBD API
        $url = 'http://bulksmsbd.net/api/smsapi';
        $postData = [
            'api_key' => $apiKey,
            'type' => 'text',
            'number' => $fullBdNumber,
            'senderid' => !empty($senderId) ? $senderId : '8809612443880',
            'message' => $message
        ];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url . '?' . http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $responseOutput = curl_exec($ch);
        curl_close($ch);
    }

    echo json_encode([
        'status' => 'success',
        'gateway_dispatched' => true,
        'provider' => $provider,
        'recipient' => $fullBdNumber,
        'gateway_response' => $responseOutput
    ]);
    exit;
}

// If no gateway key is configured yet
echo json_encode([
    'status' => 'queued',
    'gateway_dispatched' => false,
    'message' => 'No telecom API Key configured. Please add BulkSMSBD or Greenweb API Key to send cellular SMS to ' . $phone,
    'recipient' => $phone
]);
