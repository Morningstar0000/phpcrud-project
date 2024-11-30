import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as Form from "@radix-ui/react-form";
import { Button } from "@radix-ui/themes";
import { useSnackbar } from 'notistack';

function UpdateUsers({ onUserUpdated }) {
    const [user, setUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({
        firstname: "",
        lastname: "",
        email: ""
    });
    const [error, setError] = useState(null);
    const { id } = useParams();
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost/phpreactcrud/crud-project/PHP/database.php?id=${id}`);
                const rawText = await response.text();
                console.log("Raw response:", rawText);

                const result = JSON.parse(rawText);
                setUser(result);
                setUpdatedUser(result); // Initialize the form with fetched data
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message);
            }
        };

        if (id) fetchUserData();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `http://localhost/phpreactcrud/crud-project/PHP/database.php?id=${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedUser)
                }
            );
            const rawResponse = await response.text();
            console.log("Raw response from PUT:", rawResponse);

            const result = JSON.parse(rawResponse);
            if (result.success) {
              onUserUpdated({ id, ...onUserUpdated });

              // show notification
                enqueueSnackbar("User Updated successfully!", { variant: "success" });
                navigate("/");
            } else {
                enqueueSnackbar("Failed to add user.", { variant: "error" });
                console.error("Failed to update user:", result.message);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            enqueueSnackbar("An error occurred while Updating the user.", { variant: "error" });
        }
    };

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <>
            <h3 style={{ textAlign:"center"}}>Edit User</h3>
            <hr style={{ background:"green", height:"3px"}} />
            <div className="FormBox">
            <Form.Root className="FormRoot" onSubmit={handleSubmit}>
                <Form.Field className="FormField" name="firstname">
                    <Form.Label className="FormLabel">First Name</Form.Label>
                    <Form.Control asChild>
                        <input
                            className="Input"
                            name="firstname"
                            value={updatedUser.firstname || ""}
                            onChange={handleChange}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Field className="FormField" name="lastname">
                    <Form.Label className="FormLabel">Last Name</Form.Label>
                    <Form.Control asChild>
                        <input
                            className="Input"
                            name="lastname"
                            value={updatedUser.lastname || ""}
                            onChange={handleChange}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Field className="FormField" name="email">
                    <Form.Label className="FormLabel">Email</Form.Label>
                    <Form.Control asChild>
                        <input
                            className="Input"
                            name="email"
                            value={updatedUser.email || ""}
                            onChange={handleChange}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Submit asChild>
                    <button className="Button" type="submit" style={{ marginTop: 10, marginBottom: 20}}>
                        Save
                    </button>
                </Form.Submit>
            </Form.Root>
            </div>
            <div>
                <Link to="/">
                    <Button>Go Back</Button>
                </Link>
            </div>
        </>
    );
}

export default UpdateUsers;
