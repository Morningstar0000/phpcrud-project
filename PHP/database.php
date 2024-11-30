<?php
header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PATCH, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "cruddatabase";
$conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);

if (!$conn) {
    echo "Failed to connect to database!";
    exit;
}

// Only proceed with fetching data on GET requests
if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $sql = "SELECT * FROM users ORDER BY id DESC";
    $result = mysqli_query($conn, $sql);

    $data = array();
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode($data); // Returns [] if no rows are found
    } 
}

 // Handle POST request to add a new user
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["success" => false, "message" => "Invalid JSON format"]);
        exit;
    }

    if (isset($data['firstName'], $data['lastName'], $data['email'])) {
        $firstName = $data['firstName'];
        $lastName = $data['lastName'];
        $email = $data['email'];

        $stmt = $conn->prepare("INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $firstName, $lastName, $email);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "User added successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to add user"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid data"]);
    }  
};


// Handle fetch by ID for a single user
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["id"])) {
     $id = (int)$_GET["id"]; // Ensure $id is an integer
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->bind_param("i", $id); // Bind $id as an integer
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    ob_clean();
    echo json_encode($data);
    $stmt->close();
}

// Handle PUT request to update an existing user
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (json_last_error()) {
        echo json_encode(["success" => false, "message" => "Invalid JSON format"]);
        exit;
    }

    if (isset($data['id'], $data['firstname'], $data['lastname'], $data['email'])) {
        $id = (int)$data['id']; // Ensure $id is an integer
        $firstName = $data['firstname'];
        $lastName = $data['lastname'];
        $email = $data['email'];

        $stmt = $conn->prepare("UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id = ?");
        $stmt->bind_param("sssi", $firstName, $lastName, $email, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "User updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update user"]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid data"]);
    }
}

// Handle DELETE request to remove a user by ID
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    
    $rawData = file_get_contents("php://input");
    error_log("Raw DELETE Request Body: " . $rawData); // Debug raw input

    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["success" => false, "message" => "Invalid JSON"]);
        exit;
    }

    if (isset($data['id'])) {

        $id = (int)$data['id']; // Ensure $id is an integer
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "User deleted successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to delete user"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid or missing ID"]);
    }
}

mysqli_close($conn);
?>

