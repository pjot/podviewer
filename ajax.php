<?php

require_once 'classes/Autoload.php';

$podcast = $_GET['podcast'];
$cnn_client = new CNNClient($podcast);
$content = $cnn_client->getPodcast();
echo json_encode($content);
