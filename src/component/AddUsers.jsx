import * as Form from "@radix-ui/react-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';

const AddUsers = ({ onUserAdded }) => {
  let navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUsers({ ...users, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/phpreactcrud/crud-project/PHP/database.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(users),
        }
      );
      const result = await response.json();
      console.log("API Response:", result);
      if (result.success) {
        onUserAdded(users); // Update the user list in parent component
        setUsers({ firstName: "", lastName: "", email: "" });
        // show notification
        enqueueSnackbar("User added successfully!", { variant: "success" });

        navigate("/")
      } else {
        enqueueSnackbar("Failed to add user.", { variant: "error" });
        console.error("Failed to add user:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar("An error occurred while adding the user.", { variant: "error" });
    }
   
  };

  return (
    <>
  
      <h1 style={{textAlign:"center"}}>Add Users</h1>
      <hr style={{background:"blue", height:"3px"}}/>
      <div className="FormBox">
        <Form.Root className="FormRoot" method="POST" onSubmit={handleSubmit}>
          <Form.Field className="FormField" name="email">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Form.Label className="FormLabel">Email</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                Please enter your email
              </Form.Message>
              <Form.Message className="FormMessage" match="typeMismatch">
                Please provide a valid email
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input className="Input"
                type="email"
                name="email"
                value={users.email}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="firstName">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Form.Label className="FormLabel">First name</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                Please your first name
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                className="first-name"
                name="firstName"
                value={users.first_name}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="lastName">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Form.Label className="FormLabel">Last name</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                Please your Last name
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                className="last-name"
                name="lastName"
                value={users.last_name}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </Form.Field>
          <Form.Submit asChild>
            <button className="Button" type="submit" style={{ marginTop: 10 }}>
              Add Users
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </>

  );
};

export default AddUsers;
