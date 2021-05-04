using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

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
