<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
		if(!isset($_SESSION['user']))      // if there is no valid session
			{
    			header("Location: login.php");
    			exit();
			};
 		
        // Connect to database //needs securing
        include('db_login.php');
        $user = $_SESSION['user'];
        $name = $_POST['name'];
        $contact = $_POST['contact'];
        $website = $_POST['website'];
        $phone = $_POST['phone'];
        $street = $_POST['street'];
        $postcode = $_POST['postcode'];
        $addinfo = 'INSERT INTO data VALUES("'.$user.'","'.$contact.'","'.$street.'","'.$postcode.'","'.$website.'","'.$name.'", "'.$phone.'",NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);';
        $result = mysqli_query( $conn, $addinfo );
?>	

<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" type="text/css" href="styles.css">
        <meta charset="utf-8">
   </head>
    <body class="main" ><div class="content">
    <h3>2/3. Initiative Description</h3>
    <form action="survey-extra.php" method="POST" id="form">
    <label >How would you describe your initiative in one sentence:<br/></label>
    <input type="text" name="sentence"/><br/><br/>
    <label >If you would like to give a longer description please do so here:<br/></label>
    <textarea rows="10" cols="50" name="description"></textarea><br/><br/>
    <label >Which of these does your initiative directly provide (choose up to 3):<br/></label>
    <input type="checkbox" name="provides[]" value="food+drink"><label>Food and Drink</label><br/>
    <input type="checkbox" name="provides[]" value="water"><label>Drinking Water</label><br/>
    <input type="checkbox" name="provides[]" value="land"><label>Land</label><br/>
    <input type="checkbox" name="provides[]" value="mobility"><label>Mobility</label><br/>
    <input type="checkbox" name="provides[]" value="health"><label>Health</label><br/>
    <input type="checkbox" name="provides[]" value="culture"><label>Culture</label><br/>
    <input type="checkbox" name="provides[]" value="safety"><label>Safety</label><br/>
    <input type="checkbox" name="provides[]" value="housing"><label>Housing</label><br/>
    <input type="checkbox" name="provides[]" value="spaces"><label>Spaces</label><br/>
    <input type="checkbox" name="provides[]" value="objects_of_utility"><label>Objects of Utility</label><br/>
    <input type="checkbox" name="provides[]" value="clothes"><label>Clothes</label><br/>
    <input type="checkbox" name="provides[]" value="learning_opportunities"><label>Learning Opportunities</label><br/>
    <input type="checkbox" name="provides[]" value="energy"><label>Energy/Electricity/Heating</label><br/>
    <input type="checkbox" name="provides[]" value="community"><label>Community</label><br/>
    <input type="checkbox" name="provides[]" value="participation"><label>Participation</label><br/>
    <input type="checkbox" name="provides[]" value="spirituality"><label>Spirituality</label><br/><br/>
    <label >Which of these does your initiative indirectly work on (choose up to 3):<br/></label>
    <input type="checkbox" name="topic[]" value="food+drink"><label>Food and Drink</label><br/>
    <input type="checkbox" name="topic[]" value="water"><label>Drinking Water</label><br/>
    <input type="checkbox" name="topic[]" value="land"><label>Land</label><br/>
    <input type="checkbox" name="topic[]" value="mobility"><label>Mobility</label><br/>
    <input type="checkbox" name="topic[]" value="health"><label>Health</label><br/>
    <input type="checkbox" name="topic[]" value="culture"><label>Culture</label><br/>
    <input type="checkbox" name="topic[]" value="safety"><label>Safety</label><br/>
    <input type="checkbox" name="topic[]" value="housing"><label>Housing</label><br/>
    <input type="checkbox" name="topic[]" value="spaces"><label>Spaces</label><br/>
    <input type="checkbox" name="topic[]" value="objects_of_utility"><label>Objects of Utility</label><br/>
    <input type="checkbox" name="topic[]" value="clothes"><label>Clothes</label><br/>
    <input type="checkbox" name="topic[]" value="learning_opportunities"><label>Learning Opportunities</label><br/>
    <input type="checkbox" name="topic[]" value="energy"><label>Energy/Electricity/Heating</label><br/>
    <input type="checkbox" name="topic[]" value="community"><label>Community</label><br/>
    <input type="checkbox" name="topic[]" value="participation"><label>Participation</label><br/>
    <input type="checkbox" name="topic[]" value="spirituality"><label>Spirituality</label><br/><br/>
    <label >Does your initiative identify with any of the following networks or principles? (choose up to 3):<br/></label>
    <input type="checkbox" name="identity[]" value="solidarity_economy"><label>Solidarity Economy</label><br/>
    <input type="checkbox" name="identity[]" value="transition_initiative"><label>Transition Initiative</label><br/>
    <input type="checkbox" name="identity[]" value="permaculture"><label>Permaculture</label><br/>
    <input type="checkbox" name="identity[]" value="demonetized_economy"><label>Demonetized Economy</label><br/>
    <input type="checkbox" name="identity[]" value="community_based_currencies"><label>Community Based Currencies</label><br/>
    <input type="checkbox" name="identity[]" value="commons"><label>Commons</label><br/>
    <input type="checkbox" name="identity[]" value="economy_for_the_common_good"><label>Economy for the Common Good</label><br/>
    <input type="checkbox" name="identity[]" value="collaborative_economy"><label>Collaborative Economy</label><br/>
    <input type="checkbox" name="identity[]" value="ecovillage"><label>Ecovillage</label><br/>
    <input type="checkbox" name="identity[]" value="degrowth"><label>Degrowth</label><br/>
    <input type="checkbox" name="identity[]" value="subsistence_economy"><label>Subsistence Economy</label><br/>
    <input type="checkbox" name="identity[]" value="p2p_economy"><label>P2P Economy</label><br/><br/>
    <label >Does your organisation fulfill needs in ways other than standard trade? (choose up to 3):<br/></label>
    <input type="checkbox" name="interaction[]" value="bartering"><label>Bartering</label><br/>
    <input type="checkbox" name="interaction[]" value="sharing"><label>Sharing</label><br/>
    <input type="checkbox" name="interaction[]" value="lending"><label>Lending</label><br/>
    <input type="checkbox" name="interaction[]" value="renting"><label>Renting</label><br/>
    <input type="checkbox" name="interaction[]" value="gifting"><label>Gifting</label><br/>
    <input type="checkbox" name="interaction[]" value="rebuying_reselling"><label>Second Hand/Selling Used Goods</label><br/>
    <input type="checkbox" name="interaction[]" value="cousing"><label>Co-using</label><br/>
    <input type="checkbox" name="interaction[]" value="diy_and_dit"><label>DIY - Do it Yourself and Together</label><br/>
    <input type="checkbox" name="interaction[]" value="buying_and_selling"><label>Buy & Sell</label><br/><br/>
    <input type="submit" value="Submit"/><br/><br/>
    </form>
    

    </div></body>
</html>