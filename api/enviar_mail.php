<?php
// ================================================
// /var/www/html/api/enviar_mail.php — v1.5.3 (Universal)
// ================================================

define('BASE_PATH', dirname(__DIR__, 2));
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$config = require BASE_PATH . '/private/config.php';
header('Access-Control-Allow-Origin: ' . $config['security']['allowed_origin']);

$datos = json_decode(file_get_contents('php://input'), true);
if (!$datos) { exit(json_encode(['ok' => false])); }

// Honeypot
if (!isset($datos[$config['security']['honeypot_field']]) || $datos[$config['security']['honeypot_field']] !== '') {
    exit(json_encode(['ok' => false]));
}

$destinatario = filter_var($datos['destinatario'] ?? '', FILTER_VALIDATE_EMAIL);
if (!$destinatario) { exit(json_encode(['ok' => false])); }

function limpiar($v, $m = 100) { return substr(strip_tags($v ?? ''), 0, $m); }

$lugar    = limpiar($datos['lugar']    ?? 'Sin especificar');
$fecha    = limpiar($datos['fecha']    ?? '', 50);
$hora     = limpiar($datos['hora']     ?? '', 50);
$operador = limpiar($datos['operador'] ?? '', 100);

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

    // --- LÓGICA UNIVERSAL ---
    if (!empty($datos['asunto']) && !empty($datos['cuerpo'])) {
        $mail->Subject = $datos['asunto'];
        $mail->Body    = $datos['cuerpo'];
    } else {
        // Fallback: Iluminación
        $emedio      = limpiar($datos['emedio']      ?? '', 50);
        $minimo      = limpiar($datos['minimo']      ?? '', 50);
        $ilumGeneral = limpiar($datos['ilumGeneral'] ?? '', 200);
        $uniformidad = limpiar($datos['uniformidad'] ?? '', 200);
        $requerido   = limpiar($datos['requerido']   ?? '', 50);

        $mail->Subject = "Medición de Iluminación — $lugar";
        $mail->Body = "RESULTADO MEDICION DE ILUMINACIÓN\n================================\n\n" .
                      "Fecha: $fecha   Hora: $hora\nLugar: $lugar\nOperador: $operador\n\n" .
                      "Nivel requerido: $requerido lux\nEmedio: $emedio lux\nEminimo: $minimo lux\n\n" .
                      "Iluminacion general: $ilumGeneral\nUniformidad: $uniformidad\n\n" .
                      "---\nEnviado desde VISP Herramientas — higseg.ar";
    }

    $mail->isHTML(false);

    // ADJUNTO DOCX
    if (!empty($datos['docx'])) {
        $nombreDoc = !empty($datos['nombreDocx']) ? $datos['nombreDocx'] : "Informe_$lugar.docx";
        $mail->addStringAttachment(
            base64_decode($datos['docx']),
            $nombreDoc,
            'base64',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
    }

    // FOTOS (Opcionales)
    if (!empty($datos['fotoCroquis'])) {
        $mail->addStringAttachment(base64_decode($datos['fotoCroquis']), 'foto_croquis.jpg', 'base64', 'image/jpeg');
    }
    if (!empty($datos['fotoLocal'])) {
        $mail->addStringAttachment(base64_decode($datos['fotoLocal']), 'foto_lugar.jpg', 'base64', 'image/jpeg');
    }

    $mail->send();
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    echo json_encode(['ok' => false, 'error' => $mail->ErrorInfo]);
}