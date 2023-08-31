using Microsoft.AspNetCore.SignalR;
using SignalRSwaggerGen.Attributes;

namespace chat.ChatHub;
[SignalRHub]
public class MessageHub : Hub
{
    private readonly Db _db;

    public MessageHub(Db db)
    {
        this._db = db;
    }
    // userning qo'shilishi yoki yana tarmoqda online bo'lishi
    public async Task AddOrUpdateUser(string userName, string connectionId)
    {
        if (_db.Users.TryGetValue(userName, out var user))
        {
            user.ConnectionId = connectionId;
        }
        else
        {
            _db.Users.Add(userName, new User()
            {
                Name =userName,
                UserName = userName,
                ConnectionId = connectionId
            });
            await Clients.Others.SendAsync("AddUser", _db.Users[userName]);
        }
        await Clients.Caller.SendAsync("AddUsers", _db.Users.Select(du => du.Value).ToList());
    }
    // user userga xat yozishi
    public async Task UserToUserMessage(string userName, string toUserName, string text)
    {
        if (_db.Users.ContainsKey(userName) && _db.Users.TryGetValue(toUserName, out var user))
        {
            _db.Messages.Add(new Message()
            {
                Id = Constantas.Identity,
                AccepedUserName = toUserName,
                SendUserName = userName,
                MessageText = text
            });
            await Clients.User(user.ConnectionId).SendAsync("ReceiveMessage", _db.Users[userName],text);
        }
        await Clients.Caller.SendAsync("ReceiveMessage", "Not found user");
    }
    // user bilan yozishgan ikkinchi userning xatlarini olish
    public async Task GetUserToUserMessages(string userName, string toUserName)
    {
        if (_db.Users.ContainsKey(userName) && _db.Users.ContainsKey(toUserName))
        {
            await Clients.Caller.SendAsync("ReceiveMessage", _db.Messages.Where(m =>
                (m.SendUserName == userName || m.AccepedUserName == toUserName)
                && (m.AccepedUserName == userName || m.SendUserName == toUserName)).ToList());
        }
        await Clients.Caller.SendAsync("ReceiveMessage", "Not found user");
    }
}