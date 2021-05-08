using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace REZEPTstation.Models
{
    public class Recipe
    {
        [Key]
        public int RecipeID { get; set; }
        public string Name { get; set; }
        public string Difficulty { get; set; }
        public string Duration { get; set; }

        public bool Visible { get; set; }
        public int UserID { get; set; }
        public string PictureEncoded { get; set; }

    }
}
