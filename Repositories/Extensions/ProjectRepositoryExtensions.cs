using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Extensions
{
    public static class ProjectRepositoryExtensions
    {
        public static IQueryable<Project> FilteredBySearchProject(this IQueryable<Project> projects, string searchTerm)
        {
            if(string.IsNullOrWhiteSpace(searchTerm))
                return projects;

            return projects.Where(p => p.Name.ToLower().Contains(searchTerm.ToLower()) 
            || p.Description.ToLower().Contains(searchTerm.ToLower()));

        }
        public static IQueryable<Project> FilteredByDate(this IQueryable<Project> projects, DateTime? date)
        {
            if (!date.HasValue)
                return projects;

             return projects.Where(p => p.Deadline.Date == date.Value.Date);

        }

    }
}
