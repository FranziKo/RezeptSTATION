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
    public class FavoritesController : ControllerBase
    {
        private readonly REZEPTstationContext _context;

        public FavoritesController(REZEPTstationContext context)
        {
            _context = context;
        }

        // GET: api/Favorites
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Favorites>>> GetFavorites()
        {
            return await _context.Favorites.ToListAsync();
        }

        // GET: api/Favorites/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Favorites>> GetFavorites(int id)
        {
            var favorites = await _context.Favorites.FindAsync(id);

            if (favorites == null)
            {
                return NotFound();
            }

            return favorites;
        }

        // GET: api/Favorites/Remove/UserID/RecipeID
        [HttpGet("Remove/{UserID}/{RecipeID}")]
        public async Task<ActionResult<IEnumerable<Favorites>>> GetUser(int UserID, int RecipeID)
        {
            var favorite = await _context.Favorites.Where(f => f.UserID == UserID && f.RecipeID == RecipeID).ToListAsync();

            if (favorite == null)
            {
                return NotFound();
            }

            for (int i=0; i<favorite.Count; i++)
            {
                _context.Favorites.Remove(favorite[i]);
                await _context.SaveChangesAsync();
            }
           
            return NoContent();
        }

        

        // POST: api/Favorites
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Favorites>> PostFavorites(Favorites favorites)
        {
            _context.Favorites.Add(favorites);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFavorites", new { id = favorites.FavoriteID }, favorites);
        }

        // DELETE: api/Favorites/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavorites(int id)
        {
            var favorites = await _context.Favorites.FindAsync(id);
            if (favorites == null)
            {
                return NotFound();
            }

            _context.Favorites.Remove(favorites);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
