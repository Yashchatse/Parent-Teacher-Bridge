using System.ComponentModel.DataAnnotations;

namespace ParentTeacherBridge.API.DTO
{
    public class BehaviourDto
    {

            public int BehaviourId { get; set; }
            public int StudentId { get; set; }
            public int TeacherId { get; set; }
            public DateTime IncidentDate { get; set; }
            public string BehaviourCategory { get; set; } = string.Empty;
            public string Severity { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public bool NotifyParent { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }
        }

        // ✅ For creating Behaviour
        public class CreateBehaviourDto
        {
            public int BehaviourId { get; set; }

            [Required(ErrorMessage = "Student ID is required")]
                public int StudentId { get; set; }

            [Required(ErrorMessage = "Teacher ID is required")]
            public int TeacherId { get; set; }

            [Required(ErrorMessage = "Incident date is required")]
            public DateTime IncidentDate { get; set; }

            [Required(ErrorMessage = "Behaviour category is required")]
            [StringLength(100, ErrorMessage = "Behaviour category cannot exceed 100 characters")]
            public string BehaviourCategory { get; set; } = string.Empty;

            [Required(ErrorMessage = "Severity is required")]
        [RegularExpression("^(Severe|Moderate|Minor)$", ErrorMessage = "Severity must be Severe, Moderate, or Minor")]
        //[RegularExpression(@"^(Low|Medium|High)$", ErrorMessage = "Severity must be Low, Medium, or High")]
        public string Severity { get; set; } = string.Empty;
        //private string _severity;

        //[Required(ErrorMessage = "Severity is required.")]
        //[RegularExpression("^(Severe|Moderate|Minor)$", ErrorMessage = "Severity must be Severe, Moderate, or Minor")]
        //public string Severity
        //{
        //    get => _severity;
        //    set => _severity = char.ToUpper(value[0]) + value.Substring(1).ToLower();
        //}

        [Required(ErrorMessage = "Description is required")]
            [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
            public string Description { get; set; } = string.Empty;

            public bool NotifyParent { get; set; } = false;
        }

        // ✅ For updating Behaviour
        public class UpdateBehaviourDto
        {
            [Required(ErrorMessage = "Incident date is required")]
            public DateTime IncidentDate { get; set; }

            [Required(ErrorMessage = "Behaviour category is required")]
            [StringLength(100, ErrorMessage = "Behaviour category cannot exceed 100 characters")]
            public string BehaviourCategory { get; set; } = string.Empty;

            //[Required(ErrorMessage = "Severity is required")]
            //[RegularExpression(@"^(Severe|Moderate|Minor)$", ErrorMessage = "Severity must be Low, Medium, or High")]
            //public string Severity { get; set; } = string.Empty;

        private string _severity;

        [Required(ErrorMessage = "Severity is required.")]
        [RegularExpression(@"^(Severe|Moderate|Minor)$", ErrorMessage = "Severity must be Severe, Moderate, or Minor")]
        public string Severity
        {
            get => _severity;
            set => _severity = char.ToUpper(value[0]) + value.Substring(1).ToLower();
        }


        [Required(ErrorMessage = "Description is required")]
            [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
            public string Description { get; set; } = string.Empty;

            public bool NotifyParent { get; set; } = false;
        }
    


}
