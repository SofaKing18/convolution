<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $path = 'images/';
    if (!@copy($_FILES['photo']['tmp_name'], $path . $_FILES['photo']['name']))
        echo 'Upload error';
    else {
        $size = getimagesize($path . $_FILES['photo']['name']);
    }
}
?>
<!doctype html> 
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="cache-control" content="max-age=0" />
        <meta http-equiv="cache-control" content="no-cache" />
        <meta http-equiv="expires" content="0" />
        <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
        <meta http-equiv="pragma" content="no-cache" />
        <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js"
            integrity="sha256-/SIrNqv8h6QGKDuNoLGA4iret+kyesCkHGzVUUV0shc="
            crossorigin="anonymous"></script>
        <link href="stylesheet.css" rel="stylesheet" media="all">
        <title>Convolution</title>
    </head>
    <body>
        <header class='header'><a href="/index.php">Convolution</a></header>
        <hr>
        <?if ($_SERVER['REQUEST_METHOD'] == 'POST'):?>
            <canvas width="<?= $size[0] ?>" height = "<?= $size[1] ?>" id="canvas" data-image="<?= $path . $_FILES['photo']['name'] ?>" ></canvas>
            <canvas width="<?= $size[0] ?>" height = "<?= $size[1] ?>" id="canvas2" ></canvas>
            <div class='filter_block'>
            <select id = 'kernel'>
                <option selected value="original" data-filter="0 0 0 0 1 0 0 0 0">original</option>
                <option value="blur" data-filter="1 1 1 1 1 1 1 1 1">blur</option>
                <option value="sharpen" data-filter="0 -1 0 -1 5 -1 0 -1 0">sharpen</option>
                <option value="right sobel" data-filter="-1 0 1 -2 0 2 -1 0 1">right sobel</option>
                <option value="edge" data-filter="0 -2 0 -2 8 -2 0 -2 0">edge</option>
            </select>
            <div class='filter_size'>   Kernel size: <input  id = 'filter_size'  type='number' value = '3'>

            <div class='filter_f_vs'></div>
            <button id = 'apply'>Apply filter</button><br>

            <script src="js/mainscript.js"></script>
        <?else:?>
            <form class='upload_form' action="index.php" method="post" enctype="multipart/form-data">
                Your Image: <input type="file" name="photo" size="25" />
                <input type="submit" name="submit" value="Convolute" />
            </form>
        <?endif;?>
    </body>
</html>