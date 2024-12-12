import React from "react";

function RegisterWorkPlace() {
  return (
    <div>
      情報を記入してください
      <form>
        <input type="text" placeholder="会社名" />
        <input type="text" placeholder="店舗名" required />
        <input type="text" />
      </form>
    </div>
  );
}

export default RegisterWorkPlace;
