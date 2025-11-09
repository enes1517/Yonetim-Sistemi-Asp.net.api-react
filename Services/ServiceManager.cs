using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ServiceManager:IServiceManager
    {
        private readonly IStudentService _studentService;
        private readonly IProjectService _projectService;
        private readonly IProjectApplicationService _projectApplicationService;

        public ServiceManager(IStudentService studentService, IProjectService projectService, IProjectApplicationService projectApplicationService)
        {
            _studentService = studentService;
            _projectService = projectService;
            _projectApplicationService = projectApplicationService;
        }

        public IProjectApplicationService ProjectApplicationService => _projectApplicationService;

        public IStudentService StudentService => _studentService;

        public IProjectService ProjectService => _projectService;
    }
}
