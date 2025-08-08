using Microsoft.IdentityModel.Tokens;
using ParentTeacherBridge.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ParentTeacherBridge.API.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(Admin admin)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim(ClaimTypes.NameIdentifier, admin.AdminId.ToString()),
                new Claim(ClaimTypes.Email, admin.Email)
            };

            return CreateToken(claims);
        }

        public string GenerateToken(Teacher teacher)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, "Teacher"),
                new Claim(ClaimTypes.NameIdentifier, teacher.TeacherId.ToString()),
                new Claim(ClaimTypes.Email, teacher.Email)
            };

            return CreateToken(claims);
        }

        public string GenerateToken(Parent parent)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, "Parent"),
                new Claim(ClaimTypes.NameIdentifier, parent.ParentId.ToString()),
                new Claim(ClaimTypes.Email, parent.Email),
                new Claim("EnrollmentNo", parent.StudEnrollmentNo)
            };

            return CreateToken(claims);
        }

        private string CreateToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}