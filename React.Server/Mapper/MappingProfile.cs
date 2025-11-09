using AutoMapper;
using Entities.Dtos;
using Entities.Models;

namespace React.Server.Mapper
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            // Project → ProjectDto
            CreateMap<Project, ProjectDto>();
            CreateMap<Student, StudentDto>();

            // Eğer tersine de ihtiyacın varsa:
            CreateMap<ProjectDto, Project>();
            CreateMap<StudentDto, Student>();
        }
    }
}
