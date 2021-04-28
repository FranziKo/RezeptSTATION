using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace REZEPTstation.Models
{
    public class Ingredients
    {
        [Key]
        public int IngredientID { get; set; }
        public string Name { get; set; }
        public int RecipeID { get; set; }

    }
}
