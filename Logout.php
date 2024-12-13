<?php
require("start.php");
session_unset();
header("Location: login.php");
exit();