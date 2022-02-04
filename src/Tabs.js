import React, { useState } from "react";
import Factory from './Components/Factory.js';
import Dashboard from './Components/Dashboard.js';

const Tabs = () => {

  const [activeTab, setActiveTab] = useState("Factory");

  const handleTab1 = () => {
    // update the state to Factory
    setActiveTab("Factory");
  };
  const handleTab2 = () => {
    // update the state to Dashboard
    setActiveTab("Dashboard");
  };



  return (
    <div className="Tabs">
      {/* Tab nav */}
        <ul className="nav">
            <li
              className={activeTab === "Factory" ? "active" : ""}
              onClick={handleTab1}>
              Factory
            </li>
            <li
              className={activeTab === "Dashboard" ? "active" : ""}
              onClick={handleTab2}>
              Dashboard
            </li>
        </ul>
      <div className="outlet">
        {activeTab === "Factory" ? <Factory/> : <Dashboard/>}
      </div>
    </div>
  );
};
export default Tabs;
