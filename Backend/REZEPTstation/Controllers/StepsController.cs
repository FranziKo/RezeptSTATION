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
    public class StepsController : ControllerBase
    {
        private readonly REZEPTstationContext _context;

        public StepsController(REZEPTstationContext context)
        {
            _context = context;
        }

        // GET: api/Steps
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Steps>>> GetSteps()
        {
            return await _context.Steps.ToListAsync();
        }

        // GET: api/Steps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Steps>> GetSteps(int id)
        {
            var steps = await _context.Steps.FindAsync(id);

            if (steps == null)
            {
                return NotFound();
            }

            return steps;
        }

        // GET: api/Steps/Find/Recipe
        [HttpGet("Find/{recipeId}")]
        public async Task<ActionResult<IEnumerable<Steps>>> GetStepsRecipe(int recipeId)
        {
            var steps = await _context.Steps.Where(s => s.RecipeID.Equals(recipeId)).ToListAsync();

            if (steps == null)
            {
                return NotFound();
            }

            return steps;
        }


        // POST: api/Steps
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Steps>> PostSteps(Steps steps)
        {
            _context.Steps.Add(steps);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSteps", new { id = steps.StepID }, steps);
        }

        // DELETE: api/Steps/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSteps(int id)
        {
            var steps = await _context.Steps.FindAsync(id);
            if (steps == null)
            {
                return NotFound();
            }

            _context.Steps.Remove(steps);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
