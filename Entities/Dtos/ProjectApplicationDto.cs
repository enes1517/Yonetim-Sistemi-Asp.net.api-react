using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public class ProjectApplicationDto
    {
        [Required(ErrorMessage = "Proje ID zorunludur")]
        public int ProjectId { get; set; }
    }
}
