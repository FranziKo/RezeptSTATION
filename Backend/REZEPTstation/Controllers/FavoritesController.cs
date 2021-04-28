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

        // PUT: api/Favorites/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFavorites(int id, Favorites favorites)
        {
            if (id != favorites.FavoriteID)
            {
                return BadRequest();
            }

            _context.Entry(favorites).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FavoritesExists(id))
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

        private bool FavoritesExists(int id)
        {
            return _context.Favorites.Any(e => e.FavoriteID == id);
        }
    }
}
