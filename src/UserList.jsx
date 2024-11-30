import React, { useState, useEffect } from "react";
import "./index.css";
import { Table, Button } from "@radix-ui/themes";
import { Link, Routes, Route } from "react-router-dom";
import { useSnackbar } from 'notistack';

export function UserList({users, setUsers}) {

  const api = "http://localhost/phpreactcrud/crud-project/PHP/database.php";
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api);
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Fetching data failed:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting user with ID:", id); // Debug
    try {
      const response = await fetch(
        `http://localhost/phpreactcrud/crud-project/PHP/database.php`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
  
      const result = await response.json();
      if (result.success) {
        console.log("User deleted successfully:", result.message);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)); // Update state
        enqueueSnackbar("User deleted successfully!", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to delete user.", { variant: "error" });
        console.error("Failed to delete user:", result.message);
      }
    } catch (error) {
      enqueueSnackbar("An Error occurred while deleting users.", { variant: "error" });
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <div className="addusers">
        <h2>PHP REACT CRUD WEB APPLICATION</h2>
        <hr style={{marginInline:'10px'}}/>
        <h5>Users Table</h5>
        <div>
            <Link to="/add-user/">
            <Button mb="2">Add User</Button>
            </Link>
           

          {/* Your table and user list code here */}
        </div>
      </div>
      <Table.Root variant="surface" layout={"auto"} size="3" >
        <Table.Header></Table.Header>

        <Table.Header style={{background:"lightblue"}}>
          <Table.Row>
            <Table.ColumnHeaderCell>First name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Last name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body style={{background:"whitesmoke"}}>
          {users &&
            users.map((user, index) => (
              <Table.Row key={index}>
                <Table.RowHeaderCell>{user.firstname} </Table.RowHeaderCell>
                <Table.Cell>{user.lastname}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                <Link to={`/update-user/${user.id}` }>
              <Button className="edit-button" mr="3" mb={{lg:"0", sm:"1"}}  color="green">Edit</Button>
            </Link>
                  <Button color="red" onClick={() => handleDelete(user.id)}>Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
