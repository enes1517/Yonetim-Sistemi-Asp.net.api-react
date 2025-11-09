using Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly RepositoryContext _context;
        private readonly IProjectRepository _projectRepository;
        private readonly IProjectApplicationRepository _projectApplicationRepository;
        private readonly IStudentRepository _studentRepository;

        public RepositoryManager(RepositoryContext context, IProjectRepository projectRepository, IProjectApplicationRepository projectApplicationRepository, IStudentRepository studentRepository)
        {
            _context = context;
            _projectRepository = projectRepository;
            _projectApplicationRepository = projectApplicationRepository;
            _studentRepository = studentRepository;
        }

        public IProjectRepository ProjectRepository => _projectRepository;

        public IProjectApplicationRepository ApplicationRepository => _projectApplicationRepository;

        public IStudentRepository StudentRepository => _studentRepository;

        public async Task SaveAsync() => await _context.SaveChangesAsync();
        
           
        
    }
}
