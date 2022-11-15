<?php

// Токен
const TOKEN = '5702574506:AAEGBtGJKKtOS7MQE_gwgi5RVZSx6Dv5LQU';

  // ID чата
const CHATID = '-1001673732896';

  // Массив допустимых значений типа файла.
$types = array('image/gif', 'image/png', 'image/jpeg', 'application/pdf');

  // Максимальный размер файла в килобайтах
  // 1048576; // 1 МБ
 $size = 1073741824; // 1 ГБ
$name = $_POST['user_name'];
$tel = $_POST['user_tel'];

$pruduct = $_POST['pruduct'];
$dateStart = $_POST['date_start'];
$dateEnd = $_POST['date_end'];

$totalWeight = $_POST['total_weight'];
$totalVolume  = $_POST['total_volume'];

$messenger  = $_POST['user_messenger'];
$query  = $_POST['user_query'];
$review  = $_POST['user_review'];
$isReviewPublish  = $_POST['is_review_publish'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $fileSendStatus = '';
    $textSendStatus = '';
    $msgs = [];

    // Проверяем не пусты ли поля с именем и телефоном
    if (!empty($name) && !empty($name)) {

    $txt = "";
    $txt .= "<b>Новая заявка с сайта!</b> %0A";
    $txt .= "%0A";

    if (isset($name) && !empty($name)) {
        $txt .= "<b>Имя:</b> " . $name . "%0A";
    }
    if (isset($tel) && !empty($tel)) {
        $txt .= "<b>Телефон или e-mail:</b> " . $tel . "%0A";
    }
    if (isset($messenger) && !empty($messenger)) {
        $txt .= "<b>Мессенджер:</b> " . $messenger . "%0A";
    }
    if (isset($pruduct) && !empty($pruduct)) {
        $txt .= "%0A";
        $txt .= "=========";
        $txt .= "%0A";
        $txt .= "<b>Расчет стоимости:</b> %0A";
        $txt .= "| <b>Характер груза</b>: " . $pruduct . "%0A";
        if (isset($dateEnd) && !empty($dateEnd)) {
            $txt .= "<b>Cрок доставки:</b> от: " . $dateStart . ". До: " . $dateEnd . "%0A";
        }
        if (isset($totalWeight) && !empty($totalWeight)) {
            $txt .= "<b>Вес:</b> " . $totalWeight . "%0A";
        }
        if (isset($totalVolume) && !empty($totalVolume)) {
            $txt .= "<b>Объем:</b>" . $totalVolume . "%0A";
        }
    }
    if (isset($query ) && !empty($query )) {
        $txt .= "<b>Вопрос:</b> " . $query . "%0A";
    }
    if (isset($review) && !empty($review)) {
        $txt .= "<b>Отзыв:</b> " . $review . "%0A";
    }
    if (isset($isReviewPublish) && !empty($isReviewPublish)) {
        $txt .= "<b>Разрешения на публикацию отзвы:</b> " . $isReviewPublish . "%0A";
    }

    $textSendStatus = @file_get_contents('https://api.telegram.org/bot'. TOKEN .'/sendMessage?chat_id=' . CHATID . '&parse_mode=html&text=' . $txt);

    if( isset(json_decode($textSendStatus)->{'ok'}) && json_decode($textSendStatus)->{'ok'} ) {
        if (!empty($_FILES['files']['tmp_name'])) {

            $urlFile =  "https://api.telegram.org/bot" . TOKEN . "/sendMediaGroup";

            // Путь загрузки файлов
            $path = $_SERVER['DOCUMENT_ROOT'] . '/php/telegram/tmp/';

            // Загрузка файла и вывод сообщения
            $mediaData = [];
            $postContent = [
                'chat_id' => CHATID,
            ];

            for ($ct = 0; $ct < count($_FILES['files']['tmp_name']); $ct++) {
                if ($_FILES['files']['name'][$ct] && @copy($_FILES['files']['tmp_name'][$ct], $path . $_FILES['files']['name'][$ct])) {
                if ($_FILES['files']['size'][$ct] < $size && in_array($_FILES['files']['type'][$ct], $types)) {
                    $filePath = $path . $_FILES['files']['name'][$ct];
                    $postContent[$_FILES['files']['name'][$ct]] = new CURLFile(realpath($filePath));
                    $mediaData[] = ['type' => 'document', 'media' => 'attach://'. $_FILES['files']['name'][$ct]];
                }
                }
            }

            $postContent['media'] = json_encode($mediaData);

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_HTTPHEADER, ["Content-Type:multipart/form-data"]);
            curl_setopt($curl, CURLOPT_URL, $urlFile);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $postContent);
            $fileSendStatus = curl_exec($curl);
            curl_close($curl);
            $files = glob($path.'*');
            foreach($files as $file){
                if(is_file($file))
                unlink($file);
            }
        }
        echo json_encode('SUCCESS');
        } else {
        echo json_encode('ERROR');
        //
        // echo json_decode($textSendStatus);
        }
    } else {
    echo json_encode('NOTVALID');
    }
}
