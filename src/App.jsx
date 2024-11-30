import { useState } from 'react'
import './App.css'
import "@radix-ui/themes/styles.css";
import { UserList} from './UserList';
import AddUsers from './component/AddUsers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UpdateUsers from './component/UpdateUsers';
import { SnackbarProvider } from 'notistack'



function App() {
  const [users, setUsers] = useState([]);

  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

// Handler to update user in the state
const handleUserUpdated = (updatedUser) => {
  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    )
  );
};

  return (
    <>
    <SnackbarProvider  
      anchorOrigin={{
        vertical: 'top', // Position it at the top
        horizontal: 'right', // Position it to the right
      }}
      autoHideDuration={3000} // Notification auto hides after 3 seconds
      maxSnack={3} //
    >
     <Router>
      <div className="container">
        <Routes>
          <Route path="*" element={<UserList users={users} setUsers={setUsers} />} />
          <Route path="/add-user" element={<AddUsers onUserAdded={handleUserAdded}/>} />
          <Route path='/update-user/:id' element={<UpdateUsers onUserUpdated={handleUserUpdated} />}/>
        </Routes>
      </div>
    </Router>
    </SnackbarProvider>
    </>
  )
}

export default App;
