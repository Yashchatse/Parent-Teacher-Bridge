namespace ParentTeacherBridge.API.DTOs
{
    public class ParentLoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string StudEnrollmentNo { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}