<?php
session_start();

$description = "Solomon Rubin: I am currently a student at Rochester Institute of Technology majoring in Computer Science. Throughout the last 6 years I have developed an  extensive skillset in Programming and System Administration with a particular focus on Linux tools and Web technologies. As my education continues my interests and skills develop exponentially.";

?>
<!DOCTYPE HTML>
<!--
	Twenty by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
    <head>
        <title>Solomon Rubin</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
		<meta name="description" content="<?php echo $description; ?>" />
		<meta name="keywords" content="Solomon Rubin, Computer Science, Employment, Programming, System Administration, Development" />
		
		<meta property="og:title" content="Solomon Rubin" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content="http://serubin.net/" />
		<meta property="og:description" content="<?php echo $description; ?>" />
		<meta property="og:image" content="http://serubin.net/images/preview.png" />
        
        <link rel="stylesheet" href="assets/css/style.css" />

		<script src="assets/js/lib.min.js"></script>
		<script src="assets/js/main.min.js"></script>

    </head>
	<body class="index" id="serubin_net">
	    <div id="page-wrapper">
            <!-- Header -->
            <header id="header" class="alt">
                    <h1 id="logo"><a href="./" class="logo"><span>S</span>olomon Rubin</a></h1>
                    <nav id="nav">
                        <ul>
                            <li id="welcome-nav"><a class="navscroll" href="#welcome">Welcome</a>
                                <ul>
                                    <li><a class="scrolly" href="#intro">Introduction</a></li>
                                </ul>
                            </li>
                            <li id="education-nav"><a class="navscroll" href="#education">Education</a></li>
                            <li id="experience-nav"><a class="navscroll" href="#experience">Experience</a>
                                <ul>
                                    <li id="skills-nav"><a class="navscroll" href="#skills">Skills</a></li>
                                    <li id="work-nav"><a class="navscroll" href="#work">Work</a></li>
                                    <li id="projects-nav"><a class="navscroll" href="#projects">Projects</a></li>
                                </ul>
                            </li>
                            <li id="activities-nav"><a class="navscroll" href="#activities">Activities</a></li>
                            <li><a href="https://github.com/Serubin" title="Github" target="_blank" class="button special">Github</a></li>
                        </ul>
                    </nav>
                </header>	

            <!-- Banner -->		
                <section id="welcome" class="banner">
                    <!--
                        ".inner" is set up as an inline-block so it automatically expands
                        in both directions to fit whatever's inside it. This means it won't
                        automatically wrap lines, so be sure to use line breaks where
                        appropriate (<br />).
                    -->
                    <div class="inner wrapper">
                        
                        <header>
                            <h2 class="logo"><span>S</span>olomon Rubin</h2>
                        </header>
                        <p>A portfolio for a highly skilled and experienced <br/>

                        <b>Developer</b> and <b>System Administrator</b>

                        </p>
                        <footer>
                            <ul class="buttons vertical">
                                <li><a href="#intro" class="button fit scrolly"><span class="icon fa-3 fa-angle-down"></span></a></li>
                            </ul>
                        </footer>
                    
                    </div>
                    
                </section>

            <!-- Intro -->
                <article id="intro" class="wrapper">

                    <header class="special container" id="intro-inner">
                        <h2>Solomon Rubin</h2>
                        <div class="rule"></div>

                        <div id="profile">
                            <div class="image">
                                <img src="assets/images/profile.jpg" alt="Solomon Rubin" width="150" height="150" />
                            </div>
                        </div>
                        
                        <p>
                            I am currently a student at <b>Rochester Institute of Technology</b> majoring in<br/>
                            <b>Computer Science</b>. Throughout the last 6 years I have developed an <br/> 
                            extensive skillset in <b>Programming</b> and <b>System Administration</b><br />
                            with a particular focus on <b>Linux</b> tools and <b>Web</b> technologies. <br/>
                            As my education continues my interests and skills develop exponentially.
                        </p>
                    </header>
                </article>

                <article id="education" class="banner">
                    <h2 class="hide">Validation Header</h2>
                    <!-- Education -->
                    <div id="education-inner">
                        <section class="wrapper style2 container special">
                                <header class="major">
                                    <h2><strong>Education</strong></h2>
                                </header>
                            <div class="row 50%">
                                <div class="4u 12u(narrower)">
                                
                                    <section>
                                        <span class="icon featured fa-paw"></span>
                                        <header>
                                            <h3>
                                                Rochester Institute of Technology
                                                <br />
                                                <small>Rochester, NY :: 2014-2019</small>
                                            </h3>
                                        </header>
                                        <ul>
                                            <li>Major: Computer Science BS</li>
                                            <li>Minor: Networking (Not yet delcared)</li>
                                            <li>Courses taken: Data Structures, Distributed & Parallel Systems, Python, Java, and C</li>
                                            <li>Cumulative GPA: 3.2, CS GPA: 3.65</li>
                                        </ul>
                                    </section>
                                
                                </div>
                                <div class="4u 12u(narrower)">
                                
                                    <section>
                                        <span class="icon featured fa-university"></span>
                                        <header>
                                            <h3>
                                                Northeastern University
                                                <br />
                                                <small>Boston, Ma :: 2012-2014</small>
                                            </h3>
                                        </header>
                                        <ul>
                                            <li>Non-Degree Computer Science Program (12 Credit)</li>
                                            <li>Courses taken: TCP/IP 1 & 2, Databases, Web Design</li>
                                            <li>Program Pioneers, Original Cohort</li>
                                            <li>Cumulative GPA: 3.7</li>
                                        </ul>
                                    </section>
                                
                                </div>
                                <div class="4u 12u(narrower)">
                                
                                    <section>
                                        <span class="icon featured fa-book"></span>
                                        <header>
                                            <h3>
                                                Minuteman High School
                                                <br />
                                                <small>Lexington, Ma :: 2010-2014</small>
                                            </h3>
                                        </header>
                                        <ul>
                                            <li>Highschool Diploma, with honors</li>
                                            <li>Computer Science Vocational Certificate</li>
                                            <li>Honors Society</li>
                                            <li>Student Government: School Board & Council Representative</li>
                                            <li>Cumulative GPA: 3.7, CS GPA: 4.0</li>
                                        </ul>
                                    </section>
                                
                                </div>
                            </div>
                        </section>
                    </div>
                </article>


                <!-- Experience -->
                <article id="experience">
                    <h2 class="hide">Validation Header</h2>
                    <section id="experience-inner" class="container special">
                        
                        <header class="major">
                            <h2><strong>Experience</strong></h2>
                        </header>

                        <!-- Skills -->
                        <section id="skills" class="wrapper style3">
                            <h2>Skills & Accomplishments</h2>
                            <div class="row 50%">
                                <div class="4u 12u(narrower)">
                                
                                    <section>
                                        <span class="icon featured fa-folder"></span>
                                        <header>
                                            <h3>Awards and Certifications</h3>
                                        </header>
                                        <ul>
                                            <li>SkillsUSA: National Bronze Web Design Champion</li>
                                            <li>OSHA - 10 Hours</li>
                                            <li>RIT: Computing Award (Scholarship)</li>
                                        </ul>
                                    </section>
                                
                                </div>
                                <div class="4u 12u(narrower)">
                                
                                    <section>
                                        <span class="icon featured fa-cloud"></span>
                                        <header>
                                            <h3>Programming</h3>
                                        </header>
                                        <ul>
                                            <li>C, Java, Python</li>
                                            <li>JavaScript, NodeJS</li>
                                            <li>HTML/CSS, PHP</li>
                                            <li>Bash, SQL, LAMP</li>
                                            <li>Grunt, Maven, Make</li>
                                            <li>Git, SVN</li>
                                        </ul>
                                    </section>
                                
                                </div>
                                <div class="4u 12u(narrower)">
                                
                                    <section>
                                        <span class="icon featured fa-check"></span>
                                        <header>
                                            <h3>Systems & Apps</h3>
                                        </header>
                                        <ul>
                                            <li>Debian, Arch</li>
                                            <li>RHEL, ESXI</li>
                                            <li>Mac OS X</li>
                                            <li>Android System</li>
                                            <li>Distributed Systems</li>
                                            <li>Remote Systems</li>
                                        </ul>
                                    </section>
                                
                                </div>
                            </div>
                        </section> <!-- End skills -->

                        <!-- Work -->
                        <section id="work" class="wrapper style3">
                            <h2>Work Experience</h2>
                            <div class="row">
                                <div class="6u 12u(narrower)">
                                    <!-- MITRE -->
                                    <section>
                                        <a href="#" class="image featured"><img src="assets/images/projects/mitre.jpg" height="300" alt="MITRE Reverse Engineering" /></a>
                                        <header>
                                            <h3>
                                                MITRE
                                                <br />
                                                <small>5/2016-Future :: McLean, Va</small>
                                            </h3>
                                        </header>
                                        <p> MITRE is a not-for-profit research lab that is contracted by several branches of the us government as well as many non-profit initiatives</p>
                                    </section>

                                </div>
                                <div class="6u 12u(narrower)">
                                    <!-- Lincoln Lab -->
                                    <section>
                                        <a href="#" class="image featured"><img src="assets/images/projects/mitll.jpg" height="300" alt="MIT Lincoln Lab" /></a>
                                        <header>
                                            <h3>
                                                MIT Lincoln Lab
                                                <br />
                                                <small>2/2014-8/2015 :: Boston, Ma</small>
                                            </h3>
                                        </header>
                                        <p> MIT Lincoln Lab is a research facility that is under contract of the US Department of Defense. I worked on several pieces of large scale projects during my time here. I was able to explore a large diversity of topics like machine learning and detection algorithms as well as high level parallel computing.</p>
                                    </section>
                                </div>

                            </div>
                            <div class="row">
                                <div class="4u 12u(narrower)">
                                    <!-- FOSS -->
                                    <section>
                                        <a href="#" class="image featured"><img src="assets/images/projects/magic.jpg" height="200" alt="" /></a>
                                        <header>
                                            <h3>
                                                FOOS @ MAGIC
                                                <br />
                                                <small>8/2016 :: Rochester, Ny</small>
                                            </h3>
                                        </header>
                                        <p>Projects and details coming this fall. </p>
                                    </section>

                                </div>
                               <div class="4u 12u(narrower)">
                                    <!-- RIT ITS -->
                                    <section>
                                        <a href="#" class="image featured"><img src="assets/images/projects/ritits.jpg" height="200" alt="RIT ITS" /></a>
                                        <header>
                                            <h3>
                                                RIT End-Point Engineering
                                                <br />
                                                <small>9/2014-Present :: Rochester, Ny</small>
                                            </h3>
                                        </header>
                                        <p>As a part of the Endpoint Engineering team of RIT's Information Infrastructure I've balanced out a lot of my skills. I've explored new ideas and techniques in web application design as well as expand my system administration skills to Windows. Being able to work on projects that are relevant to my personal learning have been a huge asset in my growth.</p>
                                    </section>

                                </div>
                                <div class="4u 12u(narrower)">
                                    <!-- Escapecraft -->
                                    <section>
                                        <a href="#" class="image featured"><img src="assets/images/projects/escapecraft.jpg" height="200" alt="" /></a>
                                        <header>
                                            <h3>
                                                Escapecraft
                                                <br />
                                                <small>2011-2015 :: Online</small>
                                            </h3>
                                        </header>
                                        <p>Escapecraft is a Minecraft gaming community where I was able to work for 4 wonderful years. I was introduced to System Administration and helped to maintain live gaming servers with a very large player-base, experiencing working within a team on large scale projects.</p>
                                        <p>Project links: <a href="https://github.com/Serubin/SeruBans" title="SeruBans" target="_blank">SeruBans (Java)</a>, <a href="https://github.com/Serubin/HatMe/" title="HatMe" target="_blank">Hatme (Java)</a>, <a href="https://github.com/Escapecraft/EscapePlug" title="EscapePlug" target="_blank">EscapePlugin (Java)</a></p>
                                    </section>

                                </div>
 
                            </div>
                        </section> <!-- End Work -->

                        <section id="projects" class="wrapper style3">
                            <h2>Projects</h2>
                            <div class="row">
                                <div class="6u 12u(narrower)">

                                    <!-- Mindcloud -->
                                    <section>
                                        <a href="#" class="image featured"><img src="assets/images/projects/mindcloud.jpg" height="300" alt="" /></a>
                                        <header>
                                            <h3>
                                                Mindcloud
                                                <br />
                                                <small>9/2014-9/2015 :: Rochester, Ny</small>
                                            </h3>
                                        </header>
                                        <p>The Mindcloud project was one of the largest scale projects I've ever worked on. The goal of creating a social conversation framework was only a small piece. It tested everyone web techniques I have ever learned as well as pushing my time management and planning skills to a new limit.</p>
                                        <p>Project links: <a href="https://github.com/Serubin/Mindcloud" title="Mindcloud Source" target="_blank">Source code</a>, <a href="https://mindcloud.io" title="Mindcloud Website" target="_blank">Website</a></p>
                                    </section>

                                </div>
                                <div class="6u 12u(narrower)">
                                    
                                    <!-- OpenShortURL -->
                                   <section>
                                        <a href="#" class="image featured"><img src="assets/images/projects/openshorturl.jpg" height="300" alt="" /></a>
                                        <header>
                                            <h3>
                                                OpenShort URL
                                                <br />
                                            </h3>
                                        </header>
                                        <p>More info coming soon.</p>
                                        <p></p>
                                    </section>
                                </div>
                            </div>
                            <div class="row">
                                <div class="6u 12u(narrower)">
                                    <!-- Dotfiles -->
                                    <section>
                                        <a href="#" class="image featured"><img src="assets/images/projects/dotfiles.jpg" height="300" alt="" /></a>
                                        <header>
                                            <h3>
                                                Serubin's Dotfiles
                                                <br />
                                            </h3>
                                        </header>
                                        <p>The Dotfiles project is exactly what it sounds like. This dotfiles framework provides lightweight highly configured and highly configurable default configurtion. It provides a starting point for ZSH, Bash, Vim (as an IDE), tmux, and much more. Also features a very usable installer and updater.</p>
                                        <p>Project links: <a href="https://github.com/Serubin/dotfiles" title="Dotfiles Source" target="_blank">Source code</a></p>
                                    </section>
                                </div>
                                <div class="6u 12u(narrower)">
                                    
                                    <section>
                                        <a href="#" class="image featured"><img src="assets/images/projects/serubin_net.jpg" height="300" alt="" /></a>
                                        <header>
                                            <h3>
                                                Serubin.net Project
                                                <br />
                                            </h3>
                                        </header>
                                        <p>Serubin.net is much more than just my website project. For the entirety of my career it has been the driving project of my own education. It’s a culmination of 6 years of web development as well as 4 years of system administration and full stack development. Many portions of this continues to be a backbone to my success and help me further my own learning initiatives.</p>
                                        <p>Project links: <a href="https://github.com/Serubin/Serubin-net" title="Serubin.net Source" target="_blank">Source code</a></p>
                                    </section>
                                </div>
                            </div>
                        </section> <!-- End Projects -->
                    </section>
                </article> <!-- End Resume -->
                
                <!-- Activities -->
                <article id="activities" class="banner">
                    <h2 class="hide">Validation Header</h2>
                    
                    <div id="activities-inner">
                        <section class="container wrapper style2">
                            <header class="major">
                                <h2><strong>Activities</strong></h2>
                            </header>
                            <div class="row 50%">
                                <div class="4u 12u(narrower)">
                                    <h3>Linux User Group @ RIT</h3>
                                    <blockquote>
                                        <ul>
                                            <li>LUG is an RIT Community</li>
                                            <li><strong>My Roll:</strong></li>
                                            <li>Vice President</li>
                                            <li>Server Lord</li>
                                            <li><a href="http://ritlug.com" title="Linux User Group Website">RITLUG Website</a></li>
                                        </ul>
                                    </blockquote>
                                </div>
                                <div class="4u 12u(narrower)">
                                    <h3>FOSS @ RIT</h3>
                                    <blockquote>
                                        <ul>   
                                            <li>Foss is a Magic Center Initiative</li>
                                            <li><strong>My Roll:</strong></li>
                                            <li>Core Member of FOSS</li>
                                            <li>Active Projects: Coming soon</li>
                                            <li><a href="http://foss.rit.edu" title="FOSS @ RIT Website">FOSS @ RIT Website</a></li>
                                        </ul>
                                    </blockquote>
                                </div>
                                <div class="4u 12u(narrower)">
                                    <h3>Serubin.net Server Family</h3>
                                    <blockquote>
                                        <ul>
                                            <li>Personal server fleet.</li>
                                            <li>Personally Managed, High Uptime</li>
                                            <li><a href="https://map.serubin.net" title="Server Network Map">Server Network Map (Coming soon)</a></li>
                                        </ul>
                                    </blockquote>
                                </div>
                            </div>
                        </section>
                    </div>
                </article> <!-- End Activties -->

            <!-- Contact-->
                <section id="contact" class="banner wrapper last">
                    <header>
                        <h2>Let's <strong>talk</strong></h2>
                        <p>Send me an email</p>
                    </header>
                    <footer>
                        <?php
                            $name = "";
                            $email = "";
                            $subject = "";
                            $message = "";


                            if(isset($_REQUEST['action'])){
                                require_once "./mail/mail.php";
                                $mailer = new Mail();

                                $action=$_REQUEST['action'];

                                $error = false;

                                                            if(isset($_REQUEST['name']))
                                    $name = $_REQUEST['name']; 
                                if(isset($_REQUEST['email']))	
                                    $email=$_REQUEST['email'];
                                if(isset($_REQUEST['subject']))
                                    $subject=$_REQUEST['subject']; 
                                if(isset($_REQUEST['message']))
                                    $message=$_REQUEST['message']; 

                                // Filled forms check
                                if ($action !="" && ($name=="")||($email=="")||($subject=="")||($message=="")) { 
                                    echo "<p>All fields are required, please be sure everything is filled out correctly.</p>";
                                    $error = true;
                                }

                                // Captcha check
                                if($action != "" && $_REQUEST['captcha'] != $_SESSION['captcha'] ) {
                                    echo "<p>Captcha mismatch: Are you sure you got that problem correct?</p>";
                                    $error = true;
                                }

                                // Mail if no error
                                if ($action != "" && !$error) {               /* send the submitted data */ 
                                    $mail = $mailer->send($name, $email, $subject, $message);
                                    echo "<h2>Email sent! Send another?</h2>";
                                    
                                    // Clear fields
                                    $name = "";
                                    $email = "";
                                    $subject = "";
                                    $message = "";

                                }
                            }
                        ?>
                        <form action="./#contact" method="POST" enctype="multipart/form-data">
                            <div class="row 50%">
                                <div class="6u 12u(3)">
                                <input type="text" name="name" placeholder="Name" value="<?php echo $name ?>"/>
                                </div>
                                <div class="6u 12u(3)">
                                    <input type="text" name="email" placeholder="Email" value="<?php echo $email; ?>"/>
                                </div>
                            </div>
                            <div class="row 50%">
                                <div class="12u">
                                    <input type="text" name="subject" placeholder="Subject" value="<?php echo $subject; ?>" />
                                </div>
                            </div>
                            <div class="row 50%">
                                <div class="12u">
                                    <textarea name="message" placeholder="Message" rows="7"><?php echo $message; ?></textarea>
                                </div>
                            </div>
                            <div class="row">
                                <div class="2u 6u(3)">
                                    <img src="/captcha/" class="noframe" alt="" id="captchaImage" />
                                </div>
                                <div class="7u 6u(3)">
                                    <input type="text" placeholder="Answer" name="captcha" size="2" id="captchaInput"/>
                                </div>
                                <div class="2u 12u(3)">
                                    <ul class="buttons">
                                        <li><input style="min-width: 9em;" id="captchaReload" type="button" class="special" value="Reload?" /></li>
                                    </ul>
                                </div>

                            </div>
                            <div class="row">
                                <div class="12u">
                                    <ul class="buttons">
                                        <li><input type="submit" class="special" value="Send Message" /></li>
                                    </ul>
                                </div>
                            </div>
                            <input type="hidden" name="action" value="submit"> 
                        </form>
                    </footer>
               </section> <!-- end Contact-->

            </div> <!-- end Page Wrapper -->


		<!-- Footer -->
			<footer id="footer">
                <div id="spacer"></div>
                <div id="footer-inner">
                    <ul class="buttons">
                        <li style="padding:5px;"><a href="http://github.com/Serubin" alt="Github" target="_blank" class="button special"> <strong>Github</a></li>
                        <li><a href="http://linkedin.com/in/serubin" alt="Linkedin" target="_blank" class="button special"> <strong>LinkedIn</a></li>
                    </ul>

                    <p class="copyright">
                    Copyright © <?php echo date("Y"); ?> Serubin.net
                        | Provided by <a href="http://Serubin.net" title="Serubin.net">Serubin.net</a>.
                        | <a href="https://secure.serubin.net/login/privacy" rel="nofollow" target="_blank" title="Privacy Policy">Privacy Policy</a>
                    </p>
                    <p class="copyright">Designed by: <a href="http://serubin.net"> Solomon Rubin</a> | Inspired by: <a href="http://html5up.net">HTML5 UP</a></p>
			    </div>
			</footer>
	</body>
</html>
