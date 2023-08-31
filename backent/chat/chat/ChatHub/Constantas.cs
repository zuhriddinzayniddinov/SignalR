namespace chat.ChatHub;

public static class Constantas
{
    public static int Identity
    {
        get => Identity++;
        set
        {
            if (value <= 0) throw new ArgumentOutOfRangeException(nameof(value));
            Identity = value;
        }
    }
}