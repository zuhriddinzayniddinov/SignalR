const userList = document.getElementById("userList");
const users = [];
const Iuser = "";
const YouUser = "";

const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessage");
const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7276/messageHub") 
  .configureLogging(signalR.LogLevel.Information)
  .build();


connection.start()
  .then(function () {
    console.log("Ulanish amalga oshirildi.");
    const userName = Iuser;
    connection.invoke("AddOrUpdateUser", userName, connection.connectionId)
      .then(function (user) {
        console.log("Foydalanuvchi serverga qo'shildi:", user);
      })
      .catch(function (err) {
        return console.error(err.toString());
      });
  })
  .catch(function (err) {
    return console.error(err.toString());
  });

connection.on("AddUser", function (user) {
  users.push(user);
  const li = document.createElement("li");
  li.textContent = user;
  userList.appendChild(li);

  li.addEventListener("click", () => {
    openChat(user);
  });
});

connection.on("AddUsers", function (users) {
  this.users = users;
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user;
    userList.appendChild(li);

    li.addEventListener("click", () => {
      openChat(user);
    });
  });
});

function openChat(user) {
  YouUser = user;
  const userName = Iuser;
  const toUserName = user;
  connection.invoke("GetUserToUserMessages", userName, toUserName)
    .then(function () {
      console.log("Ok");
    })
    .catch(function (err) {
      return console.error(err.toString());
    });
  chatArea.innerHTML = "";
  const liList = userList.getElementsByTagName("li");
  Array.from(liList).forEach(li => li.classList.remove("active"));
  Array.from(liList).forEach(li => {
    if (li.textContent === user) {
      li.classList.add("active");
    }
  });
}

sendMessageBtn.addEventListener("click", () => {
  const message = messageInput.value;
  if (message) {
    addMessage("Siz", message);
    messageInput.value = "";
  }
});

function addMessage(user, message) {
  if(user != YouUser && user != "Siz")
  {
    return;
  }
  if(user != "Siz")
  {
    const userName = Iuser;
    const toUserName = user;
    const text = message;
    connection.invoke("UserToUserMessage", userName, toUserName, text)
    .then(function () {
      console.log("Ok");
    })
    .catch(function (err) {
      return console.error(err.toString());
    });
  }
  const messageElement = document.createElement("div");
  messageElement.textContent = `${user}: ${message}`;
  chatArea.appendChild(messageElement);
}

connection.on("ReceiveMessage", function (user, message) {
  console.log("Xabar qabul qilindi:", user, message);
});
