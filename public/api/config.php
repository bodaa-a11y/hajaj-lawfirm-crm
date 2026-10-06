<?php
// Prevent direct unauthorized execution
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ----------------------------------------------------
// HOSTINGER DATABASE CONFIGURATION
// ----------------------------------------------------
// If you create a MySQL database in Hostinger hPanel, fill in below:
define('DB_HOST', 'localhost');
define('DB_NAME', ''); // e.g. u123456789_hajaj_crm
define('DB_USER', ''); // e.g. u123456789_hajaj_user
define('DB_PASS', ''); // e.g. YourStrongPasswordHere

// Storage directory for data and uploaded files
$DATA_DIR = __DIR__ . '/data';
$UPLOADS_DIR = dirname(__DIR__) . '/uploads';

if (!file_exists($DATA_DIR)) {
    @mkdir($DATA_DIR, 0777, true);
}
if (!file_exists($UPLOADS_DIR)) {
    @mkdir($UPLOADS_DIR, 0777, true);
}

// Global API error logger
function logApiError($message, $context = []) {
    global $DATA_DIR;
    $logFile = $DATA_DIR . '/error.log';
    $time = date('Y-m-d H:i:s');
    $ctxStr = !empty($context) ? ' | Context: ' . json_encode($context, JSON_UNESCAPED_UNICODE) : '';
    @file_put_contents($logFile, "[$time] $message$ctxStr\n", FILE_APPEND);
}

// Check database connection mode
function getDatabase() {
    global $DATA_DIR;

    if (defined('DB_NAME') && DB_NAME !== '') {
        try {
            $pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            return ['type' => 'mysql', 'connection' => $pdo];
        } catch (PDOException $e) {
            // Fallback to SQLite/JSON if MySQL fails
        }
    }

    // Default: Fast, secure SQLite storage on Hostinger
    $sqliteFile = $DATA_DIR . '/hajaj_crm.sqlite';
    $pdo = new PDO("sqlite:" . $sqliteFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    return ['type' => 'sqlite', 'connection' => $pdo];
}

// Initialize tables automatically
function initDatabase($db) {
    $conn = $db['connection'];

    // Applications table
    $conn->exec("
        CREATE TABLE IF NOT EXISTS applications (
            id VARCHAR(64) PRIMARY KEY,
            orderNumber VARCHAR(32) UNIQUE,
            fullName VARCHAR(255) NOT NULL,
            phone VARCHAR(64) NOT NULL,
            email VARCHAR(255),
            idNumber VARCHAR(64),
            serviceType VARCHAR(255) NOT NULL,
            details TEXT NOT NULL,
            priority VARCHAR(32) DEFAULT 'normal',
            preferredContactMethod VARCHAR(32) DEFAULT 'whatsapp',
            preferredContactTime VARCHAR(32) DEFAULT 'morning',
            source VARCHAR(64) DEFAULT 'website',
            status VARCHAR(32) DEFAULT 'new',
            assignedLawyerId VARCHAR(64),
            attachments TEXT,
            timeline TEXT,
            notes TEXT,
            appointment TEXT,
            createdAt VARCHAR(64),
            updatedAt VARCHAR(64)
        )
    ");

    // Appointments table
    $conn->exec("
        CREATE TABLE IF NOT EXISTS appointments (
            id VARCHAR(64) PRIMARY KEY,
            applicationId VARCHAR(64),
            clientName VARCHAR(255),
            clientPhone VARCHAR(64),
            lawyerId VARCHAR(64),
            lawyerName VARCHAR(255),
            serviceType VARCHAR(255),
            date VARCHAR(32),
            time VARCHAR(32),
            durationMinutes INT DEFAULT 45,
            meetingType VARCHAR(32) DEFAULT 'in_person',
            location TEXT,
            meetingLink TEXT,
            notes TEXT,
            status VARCHAR(32) DEFAULT 'scheduled',
            createdAt VARCHAR(64)
        )
    ");

    // Settings table
    $conn->exec("
        CREATE TABLE IF NOT EXISTS settings (
            keyName VARCHAR(64) PRIMARY KEY,
            keyValue TEXT
        )
    ");

    // Device Subscriptions table (for pushing alerts to client devices)
    $conn->exec("
        CREATE TABLE IF NOT EXISTS device_subscriptions (
            id VARCHAR(64) PRIMARY KEY,
            orderNumber VARCHAR(32) NOT NULL,
            deviceToken TEXT,
            subscriptionData TEXT,
            userAgent TEXT,
            createdAt VARCHAR(64),
            updatedAt VARCHAR(64)
        )
    ");

    // Notifications table
    $conn->exec("
        CREATE TABLE IF NOT EXISTS notifications (
            id VARCHAR(64) PRIMARY KEY,
            orderNumber VARCHAR(32) NOT NULL,
            title VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            type VARCHAR(64) DEFAULT 'status_update',
            url VARCHAR(255),
            isRead INT DEFAULT 0,
            createdAt VARCHAR(64)
        )
    ");
}
