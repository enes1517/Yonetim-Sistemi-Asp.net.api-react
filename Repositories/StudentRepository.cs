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
    public class StudentRepository : RepositoryBase<Student>,IStudentRepository
    {
        public StudentRepository(RepositoryContext context) : base(context)
        {
        }

        public async Task<Student> GetOneStudentsAsync(int studentId,bool trackChanges)
        {
            return await GetByCondationAsync(s => s.Id.Equals(studentId),trackChanges);
        }

        public async Task<List<Student>> GetStudentsAsync(string searchTerm, string tech, string status)
        {
            var query=_context.Students
                .FilteredbySearchTerm(searchTerm)
                .FilteredbyTech(tech)
                .FilteredbyStatus(status);

            return await query.ToListAsync();
        }
    }
}
