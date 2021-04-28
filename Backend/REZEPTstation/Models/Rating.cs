using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace REZEPTstation.Models
{
    public class Rating
    {
        [Key]
        public int RatingID { get; set; }
        public int UserID { get; set; }
        public int RecipeID { get; set; }
        public int Score { get; set; }
    }
    
}
