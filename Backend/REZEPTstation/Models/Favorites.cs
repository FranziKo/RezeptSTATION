using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace REZEPTstation.Models
{
    public class Favorites
    {
        [Key]
        public int FavoriteID { get; set; }
        public int UserID { get; set; }
        public int RecipeID { get; set; }
    }
}
