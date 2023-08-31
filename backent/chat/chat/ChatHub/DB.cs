namespace chat.ChatHub;

public class Db
{
    public Dictionary<string, User> Users = new();
    public List<Message> Messages = new();
}