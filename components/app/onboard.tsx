import { useState } from "react";

const Onboard = (props) => {
  const [secret, setSecret] = useState(null)
  return <div>
    <input type="text" value={secret} onChange={(e) => setSecret(e.target.value)} />
    {secret}
    <button>Set</button>
  </div>
};

export {
  Onboard
}