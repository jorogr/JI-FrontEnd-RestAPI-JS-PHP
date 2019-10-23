<?php include 'get_page_variables.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <link rel="icon" href="img/favicon.ico" type="image/x-icon">
        <title><?php echo $CURR_PAGE_TITLE ?> - Mock TODO Project</title>
        <!--GENERAL CSS STYLES-->
        <?php include 'views/css_scripts.php' ?>
    </head>
    <body>
        <div id='page_wrapper'>
        <!--START HEADER-->
        <?php include 'views/header.php'; ?>
        
        <!--START LIST BODY-->
        <?php include 'views/list.php'; ?>
        
        <!--FOOTER-->
        <?php include 'views/footer.php'; ?>
        </div>
    </body>
    <!--GENERAL JS SCRIPTS-->
    <?php include 'views/js_scripts.php'; ?>
</html>