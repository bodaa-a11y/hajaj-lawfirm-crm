<?php
require_once __DIR__ . '/config.php';

try {
    $db = getDatabase();
    initDatabase($db);
    $conn = $db['connection'];
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Handle incoming JSON payload
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    
    // ----------------------------------------------------
    // 1. GET ALL APPLICATIONS
    // ----------------------------------------------------
    case 'get_applications':
        $stmt = $conn->query("SELECT * FROM applications ORDER BY createdAt DESC");
        $rows = $stmt->fetchAll();
        
        $apps = array_map(function($row) {
            $row['attachments'] = json_decode($row['attachments'] ?? '[]', true);
            $row['timeline'] = json_decode($row['timeline'] ?? '[]', true);
            $row['notes'] = json_decode($row['notes'] ?? '[]', true);
            $row['appointment'] = json_decode($row['appointment'] ?? 'null', true);
            return $row;
        }, $rows);

        echo json_encode(['success' => true, 'data' => $apps]);
        break;

    // ----------------------------------------------------
    // 2. CREATE INTAKE APPLICATION (FORM SUBMIT)
    // ----------------------------------------------------
    case 'create_application':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
            exit;
        }

        $id = !empty($input['id']) ? $input['id'] : ('app-' . round(microtime(true) * 1000));
        $orderNumber = !empty($input['orderNumber']) ? $input['orderNumber'] : ('HJ-' . rand(10000, 99999));
        $now = !empty($input['createdAt']) ? $input['createdAt'] : date('c');

        $timeline = !empty($input['timeline']) ? (is_array($input['timeline']) ? $input['timeline'] : json_decode($input['timeline'], true)) : [
            [
                'id' => 'tl-' . round(microtime(true) * 1000),
                'status' => 'new',
                'title' => 'تم استلام الطلب الجديد',
                'description' => 'تم تقديم الطلب بنجاح عبر استمارة الموقع',
                'performedBy' => 'النظام الآلي',
                'timestamp' => $now
            ]
        ];

        $attachments = !empty($input['attachments']) ? (is_array($input['attachments']) ? $input['attachments'] : json_decode($input['attachments'], true)) : [];
        $notes = !empty($input['notes']) ? (is_array($input['notes']) ? $input['notes'] : json_decode($input['notes'], true)) : [];
        $appointment = !empty($input['appointment']) ? (is_array($input['appointment']) ? json_encode($input['appointment']) : $input['appointment']) : null;

        $app = [
            'id' => $id,
            'orderNumber' => $orderNumber,
            'fullName' => $input['fullName'] ?? '',
            'phone' => $input['phone'] ?? '',
            'email' => $input['email'] ?? '',
            'idNumber' => $input['idNumber'] ?? '',
            'serviceType' => $input['serviceType'] ?? 'استشارات قانونية وشرعية',
            'details' => $input['details'] ?? '',
            'priority' => $input['priority'] ?? 'normal',
            'preferredContactMethod' => $input['preferredContactMethod'] ?? 'whatsapp',
            'preferredContactTime' => $input['preferredContactTime'] ?? 'morning',
            'source' => $input['source'] ?? 'website',
            'status' => $input['status'] ?? 'new',
            'assignedLawyerId' => $input['assignedLawyerId'] ?? null,
            'attachments' => json_encode($attachments),
            'timeline' => json_encode($timeline),
            'notes' => json_encode($notes),
            'appointment' => $appointment,
            'createdAt' => $now,
            'updatedAt' => $now
        ];

        $stmt = $conn->prepare("
            INSERT OR REPLACE INTO applications (
                id, orderNumber, fullName, phone, email, idNumber, serviceType, details,
                priority, preferredContactMethod, preferredContactTime, source, status,
                assignedLawyerId, attachments, timeline, notes, appointment, createdAt, updatedAt
            ) VALUES (
                :id, :orderNumber, :fullName, :phone, :email, :idNumber, :serviceType, :details,
                :priority, :preferredContactMethod, :preferredContactTime, :source, :status,
                :assignedLawyerId, :attachments, :timeline, :notes, :appointment, :createdAt, :updatedAt
            )
        ");

        $stmt->execute($app);

        $app['attachments'] = $attachments;
        $app['timeline'] = $timeline;
        $app['notes'] = $notes;
        $app['appointment'] = $appointment ? json_decode($appointment, true) : null;

        echo json_encode(['success' => true, 'data' => $app]);
        break;

    // ----------------------------------------------------
    // 3. UPDATE APPLICATION (STATUS, ASSIGNMENT, NOTES)
    // ----------------------------------------------------
    case 'update_application':
        $appId = $input['id'] ?? '';
        if (!$appId) {
            echo json_encode(['success' => false, 'error' => 'Application ID required']);
            exit;
        }

        $stmt = $conn->prepare("SELECT * FROM applications WHERE id = :pid1 OR orderNumber = :pid2");
        $stmt->execute(['pid1' => $appId, 'pid2' => $appId]);
        $existing = $stmt->fetch();

        if (!$existing) {
            echo json_encode(['success' => false, 'error' => 'Application not found']);
            exit;
        }

        $now = date('c');
        $timeline = json_decode($existing['timeline'] ?? '[]', true);

        if (isset($input['status']) && $input['status'] !== $existing['status']) {
            $statusLabels = [
                'new' => 'جديد',
                'under_review' => 'قيد الدراسة',
                'contacted' => 'تم التواصل',
                'appointment_set' => 'موعد محدد',
                'assigned' => 'مسند لمحامي',
                'completed' => 'مكتملة',
                'rejected' => 'ملغية'
            ];

            $timeline[] = [
                'id' => 'tl-' . round(microtime(true) * 1000),
                'status' => $input['status'],
                'title' => 'تحديث الحالة إلى: ' . ($statusLabels[$input['status']] ?? $input['status']),
                'description' => 'تم تغيير الحالة بواسطة ' . ($input['performedBy'] ?? 'المستشار'),
                'performedBy' => $input['performedBy'] ?? 'المستشار',
                'timestamp' => $now
            ];
        }

        $notes = json_decode($existing['notes'] ?? '[]', true);
        if (isset($input['newNote'])) {
            $notes[] = [
                'id' => 'nt-' . round(microtime(true) * 1000),
                'authorId' => $input['newNote']['authorId'] ?? '',
                'authorName' => $input['newNote']['authorName'] ?? '',
                'authorRole' => $input['newNote']['authorRole'] ?? '',
                'content' => $input['newNote']['content'] ?? '',
                'isPrivate' => $input['newNote']['isPrivate'] ?? false,
                'createdAt' => $now
            ];
        }

        $appointment = $existing['appointment'];
        if (isset($input['appointment'])) {
            $appointment = is_array($input['appointment']) ? json_encode($input['appointment']) : $input['appointment'];
        }

        $updateStmt = $conn->prepare("
            UPDATE applications SET
                status = :status,
                assignedLawyerId = :assignedLawyerId,
                timeline = :timeline,
                notes = :notes,
                appointment = :appointment,
                updatedAt = :updatedAt
            WHERE id = :targetId
        ");

        $updateStmt->execute([
            'targetId' => $existing['id'],
            'status' => $input['status'] ?? $existing['status'],
            'assignedLawyerId' => $input['assignedLawyerId'] ?? $existing['assignedLawyerId'],
            'timeline' => json_encode($timeline),
            'notes' => json_encode($notes),
            'appointment' => $appointment,
            'updatedAt' => $now
        ]);

        echo json_encode(['success' => true]);
        break;

    // ----------------------------------------------------
    // 4. DELETE APPLICATION
    // ----------------------------------------------------
    case 'delete_application':
        $appId = $input['id'] ?? ($_GET['id'] ?? '');
        $stmt = $conn->prepare("DELETE FROM applications WHERE id = :did1 OR orderNumber = :did2");
        $stmt->execute(['did1' => $appId, 'did2' => $appId]);
        echo json_encode(['success' => true]);
        break;

    // ----------------------------------------------------
    // 5. GET SINGLE APPLICATION (FOR TRACKING)
    // ----------------------------------------------------
    case 'get_application':
        $query = strtoupper(trim($_GET['order'] ?? ''));
        $stmt = $conn->prepare("SELECT * FROM applications WHERE orderNumber = :qord1 OR id = :qord2");
        $stmt->execute(['qord1' => $query, 'qord2' => $query]);
        $row = $stmt->fetch();

        if ($row) {
            $row['attachments'] = json_decode($row['attachments'] ?? '[]', true);
            $row['timeline'] = json_decode($row['timeline'] ?? '[]', true);
            $row['notes'] = json_decode($row['notes'] ?? '[]', true);
            $row['appointment'] = json_decode($row['appointment'] ?? 'null', true);
            echo json_encode(['success' => true, 'data' => $row]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Not found']);
        }
        break;

    // ----------------------------------------------------
    // 5b. HEALTH CHECK
    // ----------------------------------------------------
    case 'health':
        echo json_encode([
            'success' => true,
            'status' => 'healthy',
            'timestamp' => date('c'),
            'db' => $db['type'],
            'uploadsWritable' => is_writable($UPLOADS_DIR)
        ]);
        break;

    // ----------------------------------------------------
    // 6. APPOINTMENTS API
    // ----------------------------------------------------
    case 'get_appointments':
        $stmt = $conn->query("SELECT * FROM appointments ORDER BY date ASC, time ASC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'create_appointment':
        $newApt = [
            'id' => 'apt-' . round(microtime(true) * 1000),
            'applicationId' => $input['applicationId'] ?? '',
            'clientName' => $input['clientName'] ?? '',
            'clientPhone' => $input['clientPhone'] ?? '',
            'lawyerId' => $input['lawyerId'] ?? '',
            'lawyerName' => $input['lawyerName'] ?? '',
            'serviceType' => $input['serviceType'] ?? '',
            'date' => $input['date'] ?? '',
            'time' => $input['time'] ?? '',
            'durationMinutes' => $input['durationMinutes'] ?? 45,
            'meetingType' => $input['meetingType'] ?? 'in_person',
            'location' => $input['location'] ?? '',
            'meetingLink' => $input['meetingLink'] ?? '',
            'notes' => $input['notes'] ?? '',
            'status' => 'scheduled',
            'createdAt' => date('c')
        ];

        $stmt = $conn->prepare("
            INSERT INTO appointments (
                id, applicationId, clientName, clientPhone, lawyerId, lawyerName,
                serviceType, date, time, durationMinutes, meetingType, location,
                meetingLink, notes, status, createdAt
            ) VALUES (
                :id, :applicationId, :clientName, :clientPhone, :lawyerId, :lawyerName,
                :serviceType, :date, :time, :durationMinutes, :meetingType, :location,
                :meetingLink, :notes, :status, :createdAt
            )
        ");
        $stmt->execute($newApt);

        // Also update application status
        if (!empty($newApt['applicationId'])) {
            $conn->prepare("UPDATE applications SET status = 'appointment_set', appointment = :apt WHERE id = :id")
                 ->execute(['id' => $newApt['applicationId'], 'apt' => json_encode($newApt)]);
        }

        echo json_encode(['success' => true, 'data' => $newApt]);
        break;

    // ----------------------------------------------------
    // 7. FILE UPLOAD (FOR PDFS, WORD, IMAGES)
    // ----------------------------------------------------
    case 'upload_file':
        global $UPLOADS_DIR;
        if (!isset($_FILES['file'])) {
            echo json_encode(['success' => false, 'error' => 'لم يتم إرسال أي ملف']);
            exit;
        }

        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['success' => false, 'error' => 'خطأ في استقبال الملف: ' . $file['error']]);
            exit;
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'];

        if (!in_array($ext, $allowed)) {
            echo json_encode(['success' => false, 'error' => 'نوع الملف غير مدعوم. المسموح: PDF, Word, والصور']);
            exit;
        }

        if ($file['size'] > 25 * 1024 * 1024) {
            echo json_encode(['success' => false, 'error' => 'حجم الملف يتجاوز 25 ميجابايت']);
            exit;
        }

        $filename = 'doc_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
        $targetPath = $UPLOADS_DIR . '/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $fileUrl = '/uploads/' . $filename;
            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => 'att-' . time() . '-' . rand(100, 999),
                    'name' => $file['name'],
                    'size' => $file['size'],
                    'type' => $file['type'],
                    'url' => $fileUrl,
                    'uploadedAt' => date('c')
                ]
            ]);
        } else {
            logApiError('Upload move failed', ['target' => $targetPath, 'error' => error_get_last()]);
            echo json_encode(['success' => false, 'error' => 'فشل حفظ الملف على السيرفر، يرجى التحقق من أذونات مجلد uploads']);
        }
        break;

    // ----------------------------------------------------
    // 8. SUBSCRIBE DEVICE FOR PUSH NOTIFICATIONS
    // ----------------------------------------------------
    case 'subscribe_device':
        if ($method !== 'POST') {
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
            exit;
        }

        $orderNumber = trim($input['orderNumber'] ?? '');
        $deviceToken = trim($input['deviceToken'] ?? '');
        $subscriptionData = json_encode($input['subscription'] ?? []);
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $now = date('c');

        if (empty($orderNumber)) {
            echo json_encode(['success' => false, 'error' => 'Order number is required']);
            exit;
        }

        $subId = 'dev-' . round(microtime(true) * 1000);

        $stmt = $conn->prepare("
            INSERT INTO device_subscriptions (id, orderNumber, deviceToken, subscriptionData, userAgent, createdAt, updatedAt)
            VALUES (:id, :orderNumber, :deviceToken, :subscriptionData, :userAgent, :createdAt, :updatedAt)
        ");
        $stmt->execute([
            'id' => $subId,
            'orderNumber' => $orderNumber,
            'deviceToken' => $deviceToken,
            'subscriptionData' => $subscriptionData,
            'userAgent' => $userAgent,
            'createdAt' => $now,
            'updatedAt' => $now
        ]);

        echo json_encode(['success' => true, 'message' => 'Device subscribed successfully', 'id' => $subId]);
        break;

    // ----------------------------------------------------
    // 9. SEND PUSH NOTIFICATION TO CLIENT DEVICE
    // ----------------------------------------------------
    case 'send_notification':
        if ($method !== 'POST') {
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
            exit;
        }

        $orderNumber = trim($input['orderNumber'] ?? '');
        $title = trim($input['title'] ?? 'شركة حجاج عبدالرحمن الضويحي للمحاماة');
        $body = trim($input['body'] ?? 'لديك إشعار جديد بخصوص طلبك');
        $type = trim($input['type'] ?? 'status_update');
        $url = trim($input['url'] ?? ('/track?order=' . $orderNumber));
        $now = date('c');

        if (empty($orderNumber)) {
            echo json_encode(['success' => false, 'error' => 'Order number is required']);
            exit;
        }

        $notifId = 'notif-' . round(microtime(true) * 1000);

        $stmt = $conn->prepare("
            INSERT INTO notifications (id, orderNumber, title, body, type, url, isRead, createdAt)
            VALUES (:id, :orderNumber, :title, :body, :type, :url, 0, :createdAt)
        ");
        $stmt->execute([
            'id' => $notifId,
            'orderNumber' => $orderNumber,
            'title' => $title,
            'body' => $body,
            'type' => $type,
            'url' => $url,
            'createdAt' => $now
        ]);

        echo json_encode(['success' => true, 'message' => 'Notification dispatched', 'id' => $notifId]);
        break;

    // ----------------------------------------------------
    // 10. GET NOTIFICATIONS FOR A CLIENT ORDER / DEVICE
    // ----------------------------------------------------
    case 'get_notifications':
        $orderNumber = trim($_GET['orderNumber'] ?? '');
        if (empty($orderNumber)) {
            echo json_encode(['success' => false, 'error' => 'Order number is required']);
            exit;
        }

        $stmt = $conn->prepare("SELECT * FROM notifications WHERE orderNumber = :orderNumber ORDER BY createdAt DESC LIMIT 20");
        $stmt->execute(['orderNumber' => $orderNumber]);
        $notifs = $stmt->fetchAll();

        echo json_encode(['success' => true, 'data' => $notifs]);
        break;

    // ----------------------------------------------------
    // 11. MARK NOTIFICATIONS AS READ
    // ----------------------------------------------------
    case 'mark_notifications_read':
        $orderNumber = trim($input['orderNumber'] ?? '');
        if (!empty($orderNumber)) {
            $stmt = $conn->prepare("UPDATE notifications SET isRead = 1 WHERE orderNumber = :orderNumber");
            $stmt->execute(['orderNumber' => $orderNumber]);
        }
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['status' => 'online', 'firm' => 'Hajaj Aldhuwayhi Law Firm CRM API', 'version' => '2.0']);
        break;
}
