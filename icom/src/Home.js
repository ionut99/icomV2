import React from 'react';

function Home(props) {
    // handle click event of logout button
  const handleLogin = () => {
    props.history.push('/login');
  }

  return (
    <div>
        <div className="header">
            Welcome to the Home Page!<br /><br />
        </div>
        <div className="body">
            <input type="button" onClick={handleLogin} value="Login" />
        </div>
    </div>
  );
}

export default Home;



