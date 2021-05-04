using System.ComponentModel.DataAnnotations;

namespace REZEPTstation.Models
{
    public class FriendsRequest
    {
        [Key]
        public int RequestID { get; set; }
        public int UserID1 { get; set; } // ID des Users, der die Anfrage gesendet hat
        public int UserID2 { get; set; } // ID des Users der die Anfrage erhalten hat
     
    }
}
