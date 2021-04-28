using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace REZEPTstation.Models
{
    public class Friends
    {
        [Key]
        public int FriendsID { get; set; }
        public int UserID1 { get; set; }
        public int UserID2 { get; set; }
        
    }
}
