<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
		if(!isset($_SESSION['user']))      // if there is no valid session
			{
    			header("Location: login.php");
    			exit();
			};

        //If there is no data for this user then redirect to initial survey
        include('db_login.php');
        $user = $_SESSION['user'];
        $query = "SELECT * FROM data WHERE email='".$user."';";
        $result = mysqli_query( $conn, $query ); //needs securing
        if (mysqli_num_rows($result) == 0){
            header("Location: survey-basic.php");
                exit();
        };
        $row = mysqli_fetch_row($result);

 		
?>	


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <style>
        th, td {
    border-bottom: 1px solid #ddd; text-align: left; padding: 5px;
}
        input {margin: 5px;}
        table {width:100%;}
        </style>
   </head>
    <body>
    <h2>Welcome to the Member's Area</h2>
    <a href="change-password.php">Click to Change Password</a>
    <p>View and change your data below</p>
    <form action="change-data.php" method="POST" id="form"></form>
    <table>
        <tr>
            <th>Field</th>
            <th>Current Info</th>
            <th>Add or Change Info</th>
        </tr>    
        <tr><th colspan="3">Basic Info</th>
        </tr>
        <tr>
            <td>Username/email</td>
            <td><?php echo $row[0]; ?></td>
            <td></td>
        </tr>
        
        <tr>
            <td>Name</td>
            <td><?php echo $row[5]; ?></td>
            <td><input type="text" name="name" form="form"/><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Public Email</td>
            <td><?php echo $row[1]; ?></td>
            <td><input type="text" name="contact" form="form"/><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Website</td>
            <td><?php echo $row[4]; ?></td>
            <td><input type="text" name="website" form="form"/><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Phone Number</td>
            <td><?php echo $row[6]; ?></td>
            <td><input type="text" name="phone" form="form"/><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Address</td>
            <td><?php echo $row[2]; ?></td>
            <td><input type="text" name="street" form="form"/><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Postcode</td>
            <td><?php echo $row[3]; ?></td>
            <td><input type="text" name="postcode" form="form"/><input type="submit" value="Submit" form="form"/></td>
        </tr>

        </tr>    
        <tr><th colspan="3">Initiative Description</th>
        </tr>

        <tr>
            <td>Sentence Description</td>
            <td><?php echo $row[7]; ?></td>
            <td><input type="text" name="sentence" form="form"/><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Full Description</td>
            <td><?php echo $row[8]; ?></td>
            <td><textarea rows="10" cols="50" name="description" form="form"></textarea><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Provides (direct needs)</td>
            <td><?php echo $row[18].'<br/>'.$row[19].'<br/>'.$row[20]; ?></td>
            <td><label >Which of these does your initiative directly provide (choose up to 3):<br/></label>
    <input type="checkbox" name="provides[]" form="form" value="food+drink"><label>Food and Drink</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="water"><label>Drinking Water</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="land"><label>Land</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="mobility"><label>Mobility</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="health"><label>Health</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="culture"><label>Culture</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="safety"><label>Safety</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="housing"><label>Housing</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="spaces"><label>Spaces</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="objects_of_utility"><label>Objects of Utility</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="clothes"><label>Clothes</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="learning_opportunities"><label>Learning Opportunities</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="energy"><label>Energy/Electricity/Heating</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="community"><label>Community</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="participation"><label>Participation</label><br/>
    <input type="checkbox" name="provides[]" form="form" value="spirituality"><label>Spirituality</label><br/><br/><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Topics (indirect work)</td>
            <td><?php echo $row[21].'<br/>'.$row[22].'<br/>'.$row[23]; ?></td>
            <td><label >Which of these does your initiative indirectly work on (choose up to 3):<br/></label>
    <input type="checkbox" name="topic[]" form="form" value="food+drink"><label>Food and Drink</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="water"><label>Drinking Water</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="land"><label>Land</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="mobility"><label>Mobility</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="health"><label>Health</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="culture"><label>Culture</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="safety"><label>Safety</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="housing"><label>Housing</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="spaces"><label>Spaces</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="objects_of_utility"><label>Objects of Utility</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="clothes"><label>Clothes</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="learning_opportunities"><label>Learning Opportunities</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="energy"><label>Energy/Electricity/Heating</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="community"><label>Community</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="participation"><label>Participation</label><br/>
    <input type="checkbox" name="topic[]" form="form" value="spirituality"><label>Spirituality</label><br/><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Identity</td>
            <td><?php echo $row[24].'<br/>'.$row[25].'<br/>'.$row[26]; ?></td>
            <td><label >Does your initiative identify with any of the following networks or principles? (choose up to 3):<br/></label>
    <input type="checkbox" name="identity[]" form="form" value="solidarity_economy"><label>Solidarity Economy</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="transition_initiative"><label>Transition Initiative</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="permaculture"><label>Permaculture</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="demonetized_economy"><label>Demonetized Economy</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="community_based_currencies"><label>Community Based Currencies</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="commons"><label>Commons</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="economy_for_the_common_good"><label>Economy for the Common Good</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="collaborative_economy"><label>Collaborative Economy</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="ecovillage"><label>Ecovillage</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="degrowth"><label>Degrowth</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="subsistence_economy"><label>Subsistence Economy</label><br/>
    <input type="checkbox" name="identity[]" form="form" value="p2p_economy"><label>P2P Economy</label><br/><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Interaction</td>
            <td><?php echo $row[27].'<br/>'.$row[28].'<br/>'.$row[29]; ?></td>
            <td><label >Does your organisation fulfill needs in ways other than standard trade? (choose up to 3):<br/></label>
    <input type="checkbox" name="interaction[]" form="form" value="bartering"><label>Bartering</label><br/>
    <input type="checkbox" name="interaction[]" form="form" value="sharing"><label>Sharing</label><br/>
    <input type="checkbox" name="interaction[]" form="form" value="lending"><label>Lending</label><br/>
    <input type="checkbox" name="interaction[]" form="form" value="renting"><label>Renting</label><br/>
    <input type="checkbox" name="interaction[]" form="form" value="gifting"><label>Gifting</label><br/>
    <input type="checkbox" name="interaction[]" form="form" value="rebuying_reselling"><label>Second Hand/Selling Used Goods</label><br/>
    <input type="checkbox" name="interaction[]" form="form" value="cousing"><label>Co-using</label><br/>
    <input type="checkbox" name="interaction[]" form="form" value="diy_and_dit"><label>DIY - Do it Yourself and Together</label><br/>
    <input type="checkbox" name="interaction[]" form="form" value="buying_and_selling"><label>Buy & Sell</label><br/><input type="submit" value="Submit" form="form"/></td>
        </tr>


        <tr><th colspan="3">Extra Info</th>
        </tr>

        <tr>
            <td>How many members does your initiative have?</td>
            <td><?php echo $row[17]; ?></td>
            <td><input type="text" form="form" name="members"/><input type="submit" value="Submit" form="form"/></td>
        </tr>

        <tr>
            <td>Do you have any volunteer vacancies?</td>
            <td><?php echo $row[15]; ?></td>
            <td><select form="form" name="volunteervac">
                    <option selected disabled>Choose</option>
                    <option value="yes">Yes</option>
                    <option value="no">No<option>
                 </select><br/><input type="submit" value="Submit" form="form"/></td>
        </tr>

        <tr>
            <td>Do you have any job vacancies?</td>
            <td><?php echo $row[16]; ?></td>
            <td><select form="form" name="jobvac">
                    <option selected disabled>Choose</option>
                    <option value="yes">Yes</option>
                    <option value="no">No<option>
                </select><br/><input type="submit" value="Submit" form="form"/></td>
        </tr>

        <tr>
            <td>In which year were you founded?</td>
            <td><?php echo $row[10]; ?></td>
            <td><input type="text" form="form" name="foundingyear"><input type="submit" value="Submit" form="form"/></td>
        </tr>

        <tr>
            <td>Which legal form does you initiative have?</td>
            <td><?php echo $row[9]; ?></td>
            <td><input type="text" form="form" name="legal"><input type="submit" value="Submit" form="form"/></td>
        </tr>

        <tr>
            <td>Does your initiative have a registering body (eg Companies House, Charity Commission)?</td>
            <td><?php echo $row[11]; ?></td>
            <td><input type="text" form="form" name="registrar"><input type="submit" value="Submit" form="form"/></td>
        </tr>

        <tr>
            <td>What is your registered number with that registrar?</td>
            <td><?php echo $row[12]; ?></td>
            <td><input type="text" form="form" name="registerednum"><input type="submit" value="Submit" form="form"/></td>
        </tr>

    </table>





    </body>
</html>


