using System.Collections.Generic;
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
        public async Task<ActionResult<IEnumerable<FriendsRequest>>> GetFriendsRequest(int id)
        {
            var friendsRequest = await _context.FriendsRequest
                .Where(r => r.UserID2 == id).ToListAsync();

            if (friendsRequest == null)
            {
                return NotFound();
            }

            return friendsRequest;
        }

        // POST: api/FriendsRequests
        [HttpPost]
        public async Task<ActionResult<FriendsRequest>> PostFriendsRequest(FriendsRequest friendsRequest)
        {
            var requests = await _context.FriendsRequest.ToListAsync();
            var friends = await _context.Friends.ToListAsync();

            bool alreadyExisting = false;

            requests.ForEach(r =>
            {
                if (r.UserID1 == friendsRequest.UserID1 && r.UserID2 == friendsRequest.UserID2)
                {
                    alreadyExisting = true;
                }
                if (r.UserID1 == friendsRequest.UserID2 && r.UserID2 == friendsRequest.UserID1)
                {
                    alreadyExisting = true;
                }
            });
            friends.ForEach(f =>
            {
                if (f.UserID1 == friendsRequest.UserID1 && f.UserID2 == friendsRequest.UserID2)
                {
                    alreadyExisting = true;
                }
                if (f.UserID1 == friendsRequest.UserID2 && f.UserID2 == friendsRequest.UserID1)
                {
                    alreadyExisting = true;
                }
            });

            if (alreadyExisting == true)
            {
                return BadRequest();
            }

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
      
    }
           
}
