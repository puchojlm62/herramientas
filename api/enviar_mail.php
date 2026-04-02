<?php
// ================================================
// /var/www/html/api/enviar_mail.php
// ================================================

define('BASE_PATH', dirname(__DIR__, 2));

// ── HEADERS ──────────────────────────────────────
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

// ── CARGA CONFIG ─────────────────────────────────
$config_path = BASE_PATH . '/private/config.php';

if (!file_exists($config_path)) {
    error_log('config.php no encontrado en: ' . $config_path);
    http_response_code(500);
    echo json_encode(['ok' => false]);
    exit;
}

$config = require $config_path;

// Validación mínima del config
if (
    empty($config['smtp']['host'])     ||
    empty($config['smtp']['usuario'])  ||
    empty($config['smtp']['password']) ||
    empty($config['mail']['from'])
) {
    error_log('config.php incompleto');
    http_response_code(500);
    echo json_encode(['ok' => false]);
    exit;
}

// CORS — usar origen del config
header('Access-Control-Allow-Origin: ' . $config['security']['allowed_origin']);
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// ── INPUT ────────────────────────────────────────
$datos = json_decode(file_get_contents('php://input'), true);

if (!$datos) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

// ── HONEYPOT ─────────────────────────────────────
$honeypot = $config['security']['honeypot_field'];
if (!isset($datos[$honeypot]) || $datos[$honeypot] !== '') {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

// ── VALIDAR DESTINATARIO ─────────────────────────
$destinatario = filter_var($datos['destinatario'] ?? '', FILTER_VALIDATE_EMAIL);
if (!$destinatario) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

// ── SANITIZACIÓN ─────────────────────────────────
function limpiar($valor, $max = 100) {
    return substr(strip_tags($valor ?? ''), 0, $max);
}

$lugar       = limpiar($datos['lugar']       ?? 'Sin especificar');
$fecha       = limpiar($datos['fecha']       ?? '', 50);
$hora        = limpiar($datos['hora']        ?? '', 50);
$operador    = limpiar($datos['operador']    ?? '', 100);
$emedio      = limpiar($datos['emedio']      ?? '', 50);
$minimo      = limpiar($datos['minimo']      ?? '', 50);
$ilumGeneral = limpiar($datos['ilumGeneral'] ?? '', 200);
$uniformidad = limpiar($datos['uniformidad'] ?? '', 200);
$requerido   = limpiar($datos['requerido']   ?? '', 50);

// ── LÍMITES DESDE CONFIG ──────────────────────────
$max_docx = $config['security']['max_docx_size'] ?? 2000000;
$max_foto = $config['security']['max_foto_size']  ?? 3000000;

// ── PHPMailer ─────────────────────────────────────
require BASE_PATH . '/html/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host       = $config['smtp']['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp']['usuario'];
    $mail->Password   = $config['smtp']['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $config['smtp']['port'];
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($config['mail']['from'], $config['mail']['nombre']);
    $mail->addAddress($destinatario);

    $mail->Subject = "Medición de Iluminación — $lugar";
    $mail->isHTML(false);
    $mail->Body =
        "RESULTADO MEDICION DE ILUMINACIÓN\n" .
        "================================\n\n" .
        "Fecha: $fecha   Hora: $hora\n" .
        "Lugar: $lugar\n" .
        "Operador: $operador\n\n" .
        "Nivel requerido: $requerido lux\n" .
        "Emedio: $emedio lux\n" .
        "Eminimo: $minimo lux\n\n" .
        "Iluminacion general: $ilumGeneral\n" .
        "Uniformidad: $uniformidad\n\n" .
        "---\n" .
        "Enviado desde VISP Herramientas — higseg.ar";

    // ── ADJUNTOS ──────────────────────────────────

    // DOCX
    if (!empty($datos['docx']) && strlen($datos['docx']) < $max_docx) {
        $mail->addStringAttachment(
            base64_decode($datos['docx']),
            "Informe_Iluminacion_$lugar.docx",
            'base64',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
    }

    // Foto croquis
    if (!empty($datos['fotoCroquis']) && strlen($datos['fotoCroquis']) < $max_foto) {
        $mail->addStringAttachment(
            base64_decode($datos['fotoCroquis']),
            'foto_croquis.jpg',
            'base64',
            'image/jpeg'
        );
    }

    // Foto local
    if (!empty($datos['fotoLocal']) && strlen($datos['fotoLocal']) < $max_foto) {
        $mail->addStringAttachment(
            base64_decode($datos['fotoLocal']),
            'foto_lugar.jpg',
            'base64',
            'image/jpeg'
        );
    }

    // ── ENVÍO ─────────────────────────────────────
    $mail->send();
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    if (!empty($config['security']['log_enabled'])) {
        error_log('Error PHPMailer: ' . $mail->ErrorInfo);
    }
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
