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
    public class IngredientsController : ControllerBase
    {
        private readonly REZEPTstationContext _context;

        public IngredientsController(REZEPTstationContext context)
        {
            _context = context;
        }

        // GET: api/Ingredients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ingredients>>> GetIngredients()
        {
            return await _context.Ingredients.ToListAsync();
        }

        // GET: api/Ingredients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ingredients>> GetIngredients(int id)
        {
            var ingredients = await _context.Ingredients.FindAsync(id);

            if (ingredients == null)
            {
                return NotFound();
            }

            return ingredients;
        }

        // Find all ingredients of a recipe
        // GET: api/Ingredients/Find/Recipe
        [HttpGet("Find/{recipeId}")]
        public async Task<ActionResult<IEnumerable<Ingredients>>> GetIngredientsRecipe(int recipeId)
        {
            var ingredients = await _context.Ingredients.Where(i => i.RecipeID.Equals(recipeId)).ToListAsync();

            if (ingredients == null)
            {
                return NotFound();
            }

            return ingredients;
        }

        // PUT: api/Ingredients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIngredients(int id, Ingredients ingredients)
        {
            if (id != ingredients.IngredientID)
            {
                return BadRequest();
            }

            _context.Entry(ingredients).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IngredientsExists(id))
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

        // POST: api/Ingredients
        [HttpPost]
        public async Task<ActionResult<Ingredients>> PostIngredients(Ingredients ingredients)
        {
            _context.Ingredients.Add(ingredients);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIngredients", new { id = ingredients.IngredientID }, ingredients);
        }

        // DELETE: api/Ingredients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIngredients(int id)
        {
            var ingredients = await _context.Ingredients.FindAsync(id);
            if (ingredients == null)
            {
                return NotFound();
            }

            _context.Ingredients.Remove(ingredients);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IngredientsExists(int id)
        {
            return _context.Ingredients.Any(e => e.IngredientID == id);
        }
    }
}
