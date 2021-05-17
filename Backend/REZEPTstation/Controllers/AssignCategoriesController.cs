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
    public class AssignCategoriesController : ControllerBase
    {
        private readonly REZEPTstationContext _context;

        public AssignCategoriesController(REZEPTstationContext context)
        {
            _context = context;
        }

        // GET: api/AssignCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssignCategories>>> GetAssignCategories()
        {
            return await _context.AssignCategories.ToListAsync();
        }

        // GET: api/AssignCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AssignCategories>> GetAssignCategories(int id)
        {
            var assignCategories = await _context.AssignCategories.FindAsync(id);

            if (assignCategories == null)
            {
                return NotFound();
            }

            return assignCategories;
        }

        // Find all categories of a Recipe
        // GET: api/AssignCategories/Find/Recipe
        [HttpGet("Find/{recipeId}")]
        public async Task<ActionResult<IEnumerable<AssignCategories>>> GetIngredientsRecipe(int recipeId)
        {
            var categories = await _context.AssignCategories.Where(a => a.RecipeID.Equals(recipeId)).ToListAsync();

            if (categories == null)
            {
                return NotFound();
            }

            return categories;
        }

        // PUT: api/AssignCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAssignCategories(int id, AssignCategories assignCategories)
        {
            if (id != assignCategories.AssignCategoryId)
            {
                return BadRequest();
            }

            _context.Entry(assignCategories).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssignCategoriesExists(id))
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

        // POST: api/AssignCategories
        [HttpPost]
        public async Task<ActionResult<AssignCategories>> PostAssignCategories(AssignCategories assignCategories)
        {
            _context.AssignCategories.Add(assignCategories);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAssignCategories", new { id = assignCategories.AssignCategoryId }, assignCategories);
        }

        // get all recipes that fit to all categories in the transferred array of categories
        // POST: api/getRecipesByCategories
        [HttpPost("getRecipesByCategories")]
        public async Task<ActionResult<List<int>>> GetRecipesByCategories(int[] categoryIds)
        {
            List<int> result = new List<int>();
            var assignRecipeCategoryList = await _context.AssignCategories.Where(a => categoryIds.Contains(a.CategoryID)).ToListAsync();
            for (int i=0; i<assignRecipeCategoryList.Count; i++)
            {
                var recipeID = assignRecipeCategoryList[i].RecipeID;
                int sum = 0;
                for (int j=0; j<assignRecipeCategoryList.Count; j++)
                {
                    if (assignRecipeCategoryList[j].RecipeID == recipeID)
                    {
                        sum++;
                    }
                }
                if (sum == categoryIds.Length)
                {
                    result.Add(assignRecipeCategoryList[i].RecipeID);
                }
            }

            return result;
        }

        // DELETE: api/AssignCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignCategories(int id)
        {
            var assignCategories = await _context.AssignCategories.FindAsync(id);
            if (assignCategories == null)
            {
                return NotFound();
            }

            _context.AssignCategories.Remove(assignCategories);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AssignCategoriesExists(int id)
        {
            return _context.AssignCategories.Any(e => e.AssignCategoryId == id);
        }
    }
}
