﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace REZEPTstation.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }
        public string Username { get; set; }

      
    }
}
