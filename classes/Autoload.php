<?php

function autoload($class) {
    $file = 'classes/' . $class . '.php';

    if (is_readable($file))
        require $file;
}

spl_autoload_register('autoload');
