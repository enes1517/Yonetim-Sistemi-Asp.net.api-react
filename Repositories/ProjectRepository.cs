using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class ProjectRepository : RepositoryBase<Project>, IProjectRepository
    {
        public ProjectRepository(RepositoryContext context) : base(context)
        {
        }

        public async Task<Project> GetOneProjectByIdAsync(int projectId,bool trackChanges)
        {
                return  await GetByCondationAsync(p => p.Id.Equals(projectId),trackChanges);
        }

        public async Task<List<Student>> GetProjectApplicantsAsync(int projectId)
        {
            return await _context.ProjectApplications.Where(pa=>pa.ProjectId.Equals(projectId))
                .Include(p=>p.Student)
                .Select(p=>p.Student)
                .ToListAsync();
        }

        public async Task<List<Project>> GetProjectAsync(string searchTerm, DateTime? date)
        {
            return await _context.Projects
                .FilteredBySearchProject(searchTerm)
                .FilteredByDate(date).ToListAsync();

        }
    }
}
