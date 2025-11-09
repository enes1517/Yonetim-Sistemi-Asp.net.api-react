using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public record class ProjectDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required")]

        public string Name { get; init; }
        [Required(ErrorMessage = "Description is required")]

        public string Description { get; init; }
        [DataType(DataType.Date)]
        public DateTime Deadline { get; init; }
    }
}
