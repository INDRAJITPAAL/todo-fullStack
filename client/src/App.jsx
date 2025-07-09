import React, { useState } from 'react';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Todo from './components/Todo';

const App = () => {
  const [user, setUser] = useState(true); // fake auth state

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
