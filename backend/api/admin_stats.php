<?php
// backend/api/admin_stats.php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $totalPatients = $db->query("SELECT COUNT(*) FROM users WHERE role = 'patient'")->fetchColumn();
    $totalDoctors = $db->query("SELECT COUNT(*) FROM doctors WHERE is_active = 1")->fetchColumn();
    $totalAppointments = $db->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
    $pendingAppointments = $db->query("SELECT COUNT(*) FROM appointments WHERE status = 'pending'")->fetchColumn();
    $confirmedAppointments = $db->query("SELECT COUNT(*) FROM appointments WHERE status = 'confirmed'")->fetchColumn();
    $todayAppointments = $db->query("SELECT COUNT(*) FROM appointments WHERE appointment_date = CURDATE()")->fetchColumn();

    $recentAppointments = $db->query("
        SELECT a.*, d.name AS doctor_name, d.specialty
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        ORDER BY a.created_at DESC
        LIMIT 5
    ")->fetchAll();

    sendResponse('success', [
        'stats' => [
            'total_patients' => (int)$totalPatients,
            'total_doctors' => (int)$totalDoctors,
            'total_appointments' => (int)$totalAppointments,
            'pending_appointments' => (int)$pendingAppointments,
            'confirmed_appointments' => (int)$confirmedAppointments,
            'today_appointments' => (int)$todayAppointments
        ],
        'recent_appointments' => $recentAppointments
    ], 'Admin statistics loaded');
} catch (Exception $e) {
    sendResponse('error', null, $e->getMessage(), 500);
}
