using System.ComponentModel.DataAnnotations;

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
