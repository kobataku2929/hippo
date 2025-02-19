"use client";

import React from "react";
import RegisterWorkPlace from "../../features/shift/components/RegisterWorkPlace";

function AfterSignup() {
  function isAdmin(worker: String) {
    if (worker === "管理者") {
      console.log(worker);
      return true;
    } else {
      return false;
    }
  }
  return (
    <div className="mt-6">
      <h2>タイプを選択してください</h2>
      <div className="flex gap-5">
        <button onClick={() => isAdmin("管理者")}>管理者</button>
        <button onClick={() => isAdmin("スタッフ")}>スタッフ</button>
      </div>
      <RegisterWorkPlace />
    </div>
  );
}

export default AfterSignup;
