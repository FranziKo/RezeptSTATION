using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using REZEPTstation.Data;
using REZEPTstation.Models;

namespace REZEPTstation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsRequestsController : ControllerBase
    {
        private readonly REZEPTstationContext _context;

        public FriendsRequestsController(REZEPTstationContext context)
        {
            _context = context;
        }

        // GET: api/FriendsRequests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FriendsRequest>>> GetFriendsRequest()
        {
            return await _context.FriendsRequest.ToListAsync();
        }

        // GET: api/FriendsRequests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FriendsRequest>> GetFriendsRequest(int id)
        {
            var friendsRequest = await _context.FriendsRequest.FindAsync(id);

            if (friendsRequest == null)
            {
                return NotFound();
            }

            return friendsRequest;
        }

        // PUT: api/FriendsRequests/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFriendsRequest(int id, FriendsRequest friendsRequest)
        {
            if (id != friendsRequest.RequestID)
            {
                return BadRequest();
            }

            _context.Entry(friendsRequest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FriendsRequestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/FriendsRequests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FriendsRequest>> PostFriendsRequest(FriendsRequest friendsRequest)
        {
            _context.FriendsRequest.Add(friendsRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFriendsRequest", new { id = friendsRequest.RequestID }, friendsRequest);
        }

        // DELETE: api/FriendsRequests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFriendsRequest(int id)
        {
            var friendsRequest = await _context.FriendsRequest.FindAsync(id);
            if (friendsRequest == null)
            {
                return NotFound();
            }

            _context.FriendsRequest.Remove(friendsRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FriendsRequestExists(int id)
        {
            return _context.FriendsRequest.Any(e => e.RequestID == id);
        }
    }
}
