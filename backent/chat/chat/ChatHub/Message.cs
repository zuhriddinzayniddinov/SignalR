namespace chat.ChatHub;

public class Message
{
    public int Id { get; set; }
    public string SendUserName { get; set; }
    public string AccepedUserName { get; set; }
    public string MessageText { get; set; }
}