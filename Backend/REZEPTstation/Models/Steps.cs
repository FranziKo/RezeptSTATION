using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace REZEPTstation.Models
{
    public class Steps
    {
        [Key]
        public int StepID { get; set; }
        public int Number { get; set; }
        public string describtion { get; set; }
        public int RecipeID { get; set; }
    }
}
