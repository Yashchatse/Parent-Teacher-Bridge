using System;
using System.Collections.Generic;

namespace ParentTeacherBridge.API.Models;

public partial class Message
{
    public int MessageId { get; set; }

    public int? SenderId { get; set; }

    public string? SenderRole { get; set; }

    public int? ReceiverId { get; set; }

    public string? ReceiverRole { get; set; }

    public string? MessageContext { get; set; }

    public string? Message1 { get; set; }

    public DateTime? SentAt { get; set; }

    public DateTime? ReadAt { get; set; }
}
