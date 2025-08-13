import React, { useState } from "react";
import Navigation from "./Navbar";

function Contact() {
  const [account, setAccount] = useState("0x0");

  const cambiarCuenta = () => {
    if(account === "0x0"){
      setAccount("0x123456789");
    } else {
      setAccount("0x0");
    }
  };

  return (
    <div>
      <Navigation account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <p>Estamos en la vista de contacto con la empresa</p>
              <p>Cuenta actual: {account}</p>
              <button onClick={cambiarCuenta}>Cambiar cuenta</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Contact;
