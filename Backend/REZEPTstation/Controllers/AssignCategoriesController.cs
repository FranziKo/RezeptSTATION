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

        // PUT: api/AssignCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AssignCategories>> PostAssignCategories(AssignCategories assignCategories)
        {
            _context.AssignCategories.Add(assignCategories);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAssignCategories", new { id = assignCategories.AssignCategoryId }, assignCategories);
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
