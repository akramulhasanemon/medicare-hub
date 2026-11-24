<?php
// backend/config/database.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database {
    private $host = "localhost";
    private $db_name = "medicare_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => true
                ]
            );
        } catch(PDOException $exception) {
            // Return JSON error if connection fails
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Database connection error: " . $exception->getMessage()
            ]);
            exit();
        }
        return $this->conn;
    }
}

function sendResponse($status, $data = [], $message = "", $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode([
        "status" => $status,
        "message" => $message,
        "data" => $data
    ]);
    exit();
}
