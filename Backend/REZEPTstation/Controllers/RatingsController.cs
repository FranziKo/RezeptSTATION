﻿using System;
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
    public class RatingsController : ControllerBase
    {
        private readonly REZEPTstationContext _context;

        public RatingsController(REZEPTstationContext context)
        {
            _context = context;
        }

        // GET: api/Ratings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rating>>> GetRating()
        {
            return await _context.Rating.ToListAsync();
        }

        // GET: api/Ratings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Rating>> GetRating(int id)
        {
            var rating = await _context.Rating.FindAsync(id);

            if (rating == null)
            {
                return NotFound();
            }

            return rating;
        }

        // PUT: api/Ratings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRating(int id, Rating rating)
        {
            if (id != rating.RatingID)
            {
                return BadRequest();
            }

            _context.Entry(rating).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RatingExists(id))
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

        // POST: api/Ratings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> PostRating(Rating rating)
        {

            bool existingRating = false;

            var allRatings = await _context.Rating.ToListAsync();

            allRatings.ForEach(r =>
            {
                if (r.UserID == rating.UserID && r.RecipeID == rating.RecipeID)
                {
                    existingRating = true;
                    rating.RatingID = r.RatingID;
                }
            });

            if (existingRating)
            {
                return BadRequest();
            }
            else
            {
                _context.Rating.Add(rating);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetRating", new { id = rating.RatingID }, rating);
            }
            
        }

        // DELETE: api/Ratings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var rating = await _context.Rating.FindAsync(id);
            if (rating == null)
            {
                return NotFound();
            }

            _context.Rating.Remove(rating);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RatingExists(int id)
        {
            return _context.Rating.Any(e => e.RatingID == id);
        }
    }
}
