using System;
using System.ComponentModel.DataAnnotations.Schema;

[Table("message")]
public partial class Message
{
    [Column("message_id")]
    public int MessageId { get; set; }

    [Column("sender_id")]
    public int? SenderId { get; set; }

    [Column("sender_role")]
    public string? SenderRole { get; set; }

    [Column("receiver_id")]
    public int? ReceiverId { get; set; }

    [Column("receiver_role")]
    public string? ReceiverRole { get; set; }

    [Column("message_context")]
    public string? MessageContext { get; set; }

    [Column("message")]
    public string? Message1 { get; set; }

    [Column("sent_at")]
    public DateTime? SentAt { get; set; }

    [Column("read_at")]
    public DateTime? ReadAt { get; set; }
}
