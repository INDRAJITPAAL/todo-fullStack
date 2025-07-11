import React, { useEffect, useState } from 'react';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Todo from './components/Todo';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);
  let token = localStorage.getItem("token");

  async function userInformation() {
    const userPayload = await axios.get("http://localhost:8080/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return userPayload.data.userInfo || null;
  }

  useEffect(() => {
    if (token) {


      const fetch = async () => {
        setUser(await userInformation());
      }

      fetch();
    }
  }, [])


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-500 p-6">
      {!user ? (
        <div className="flex flex-col gap-6">
          <SignUp onSignUp />
          <SignIn onSignIn={setUser} />
        </div>
      ) : (
        <Todo user={user} />
      )}
    </div>
  );
};

export default App;
