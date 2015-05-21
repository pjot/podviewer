<?php

require_once 'classes/Autoload.php';

$cnn_client = new CNNClient('http://rss.cnn.com/services/podcasting/fareedzakaria_audio/rss');
$content = $cnn_client->getPodcast();
$json = json_encode($content);

?><!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="static/bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <title>Podviewer</title>
    </head>
    <body>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <h4>You are browsing <?php echo $content->title; ?></h4>
                    <h4><small><?php echo $content->description ?></small></h4>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 episodes">
                    <div class="list-group" style="overflow: scroll; height: 500px;">
                        <?php foreach ($content->items as $item): ?>
                        <a href="#" class="list-group-item" rel="<?php echo $item->id; ?>">
                            <div class="row">
                                <div class="col-md-10">
                                    <h4 class="list-group-item-heading"><?php echo $item->title; ?></h4>
                                    <p class="list-group-item-text">Published <?php echo $item->date; ?></p>
                                </div>
                                <div class="col-md-2">
                                    <span style="display: none;" class="glyphicon glyphicon-volume-up btn-lg playing" aria-hidden="true"></span>
                                </div>
                            </div>
                        </a>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="col-md-8 movie">
                    <div class="panel panel-default player" style="display: none;">
                        <div class="panel-heading">
                            <h3 class="panel-title" id="current_title"></h3>
                        </div>
                        <div class="panel-body" style="padding: 0;">
                            <div class="embed-responsive embed-responsive-16by9">
                                <iframe id="current_movie" class="embed-responsive-item" src="" allowfullscreen=""></iframe>
                            </div>
                        </div>
                        <div class="panel-footer" id="current_description"></div>
                    </div>
                </div>
            </div>
        </div>
        <script src="static/js/jquery.min.js"></script>
        <script src="static/bootstrap/js/bootstrap.min.js"></script>
        <script src="static/js/podviewer.js"></script>
        <script>
            Podviewer.podcast = <?php echo $json; ?>;
        </script>
    </body>
</html>
