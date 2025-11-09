using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class ProjectApplicationRepository : RepositoryBase<ProjectApplication>, IProjectApplicationRepository
    {
        public ProjectApplicationRepository(RepositoryContext context) : base(context)
        {
        }

        public async Task<bool> ApplicationExistsAsync(int studentId, int projectId)
        {
            return await _context.ProjectApplications.AnyAsync(pa=>pa.StudentId.Equals(studentId)&&pa.ProjectId.Equals(projectId));
        }

        public async Task<int> GetApplicationCountAsync(int studentId)
        {
            return await _context.ProjectApplications.CountAsync(pa=>pa.StudentId.Equals(studentId));
        }

        public async Task<List<Project>> GetStudentProjectAsync(int studentId)
        {
            return await _context.ProjectApplications
                 .Where(pa => pa.StudentId.Equals(studentId))
                 .Include(pa => pa.Project)
                 .Select(pa => pa.Project)
                 .ToListAsync();
        }

       
    }
}
