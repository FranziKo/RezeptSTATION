﻿﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using REZEPTstation.Data;
using REZEPTstation.Models;

namespace REZEPTstation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly REZEPTstationContext _context;

        public UsersController(REZEPTstationContext context)
        {
            _context = context;
        }

        
        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUser()
        {
            return await _context.User.Select(u => UserDTO(u)).ToListAsync();
            
        }
        

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return UserDTO(user);
        }

        // GET: api/Users/Find/Username
        [HttpGet("Find/{name}")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUser(string name)
        {
            var user = await _context.User.Where(u => u.Username.Contains(name))
                .Select(u => UserDTO(u)).ToListAsync();

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST: api/Users/Login
        [HttpPost("Login")]
        public async Task<ActionResult<UserDTO>> LoginUser(User user)
        {
            List<User> userList = _context.User.ToList();
            await _context.SaveChangesAsync();
            var loginAcceptes = false;
            userList.ForEach(u =>
            {
                if (u.Username == user.Username && u.Password==user.Password)
                {
                    loginAcceptes = true;
                    user = u;
                }
            });
            if (loginAcceptes)
            {
                return CreatedAtAction("GetUser", UserDTO(user));
            }
            return NotFound();
            
        }


        // POST: api/Users/Register
        [HttpPost("Register")]
        public async Task<ActionResult<User>> RegistertUser(User user)
        {
            List<User> userList = _context.User.ToList();
            var existingUser = false;
            userList.ForEach(u =>
            {
                if (u.Username==user.Username || u.Email==user.Email)
                {
                    existingUser = true;
                }
            });
            if (existingUser)
            {
                return BadRequest();
            }
            else
            {
                _context.User.Add(user);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction("GetUser", UserDTO(user));
            }           
        }


        private static UserDTO UserDTO(User user) =>
            new()
            {
                UserID = user.UserID,
                Username = user.Username,
            };
    }
}
