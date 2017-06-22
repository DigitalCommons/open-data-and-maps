<?php  

session_save_path('/home/pareccoc/cgi-bin/tmp');
session_start();
session_regenerate_id();

if(!isset($_SESSION['user']))      //Redirect to login if no session
	{
    	header("Location: login.php");
    	exit();
	};
 		
// Connect to database

include('db_login.php');
$user = $_SESSION['user'];
$post_arrays = array();
$post_strings = array();


foreach (array_keys($_POST) as $field)
{   
    if (!empty($_POST[$field]))
    {
        if (is_array($_POST[$field]))
        {
            $post_arrays[] = $field;
        }
        else
        {
            $post_strings[] = $field;
        };
    };
};

$query = 'UPDATE data SET ';

foreach ($post_strings as $string)
    {
        $query .= $string.'="'.$_POST[$string].'",';
    };

foreach ($post_arrays as $string)
    {   
        $data_array = $_POST[$string];
        $data_array = array_slice(array_pad($data_array,3,''),0,3);
        $query .= $string.'a="'.$data_array[0].'",'.$string.'b="'.$data_array[1].'",'.$string.'c="'.$data_array[2].'",';
    };

$query = substr($query, 0, -1);
$query .= ' WHERE email = "'.$user.'";';
        
if ($stmt = mysqli_prepare($conn, $query)) {
    mysqli_stmt_execute($stmt); 
    }; 

header("Location: index.php");
exit();

mysqli_close($conn);
        
?>	

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
   </head>
    <body>
    <p>didn't redirect</p>
    

    </body>
</html>