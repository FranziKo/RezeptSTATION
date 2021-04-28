using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace REZEPTstation.Models
{
    public class AssignCategories
    {
        [Key]
        public int AssignCategoryId { get; set; }
        public int CategoryID { get; set; }
        public int RecipeID { get; set; }

    }
}
