using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public record class StudentRegisterDto
    {
        
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; init; }

        [Required(ErrorMessage = "Surname is required")]
        public string Surname { get; init; }

        [Required(ErrorMessage = "StudentNumber is required")]
        public string StudentNumber { get; init; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; init; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; init; }

        [Required(ErrorMessage = "Confirm Password is required")] 
        public string ConfirmPassword { get; init; }

        [Required(ErrorMessage = "Technologies is required")]
        public List<string> Technologies { get; set; } 
    }
}
