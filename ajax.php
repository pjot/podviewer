<?php
/**
 * Ajax "controller"
 *
 * This is the only server side endpoint so far, it returns the podcast data as
 * a JSON object.
 */

// Autoloader is overkill now, but useful later
require_once 'classes/Autoload.php';

// Fetch the data...
$client = new TedClient;
$content = $client->getPodcast();

// ...and return it
echo json_encode($content);
