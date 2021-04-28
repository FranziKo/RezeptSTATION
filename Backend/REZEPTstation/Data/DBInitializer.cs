using REZEPTstation.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace REZEPTstation.Data
{
    public class DBInitializer
    {
        public static void Initialize(REZEPTstationContext context)
        {
            context.Database.EnsureCreated();

            if (context.User.Any())
            {
                return;
            }

            var users = new User[]
            {
                new User{Username="TestUser1"},
                new User{Username="TestUser2"},
            };
            foreach (User user in users)
            {
                context.User.Add(user);
            }
            context.SaveChanges();

        }
    }
}
