using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using Moq;
using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services;
using Xunit;

namespace SM_OS.Tests.Services
{
    public class UsersServiceTests
    {
        private readonly Mock<IUsersRepository> _mockUserRepo;
        private readonly Mock<IConfiguration> _mockConfig;
        private readonly UsersService _usersService;

        public UsersServiceTests()
        {
            _mockUserRepo = new Mock<IUsersRepository>();
            _mockConfig = new Mock<IConfiguration>();

            // Giả lập cấu hình JWT trong appsettings.json
            var mockJwtSection = new Mock<IConfigurationSection>();
            mockJwtSection.Setup(x => x["Key"]).Returns("ThisIsAVerySecretKeyForTesting12345");
            mockJwtSection.Setup(x => x["Issuer"]).Returns("TestIssuer");
            mockJwtSection.Setup(x => x["Audience"]).Returns("TestAudience");

            _mockConfig.Setup(x => x.GetSection("Jwt")).Returns(mockJwtSection.Object);

            _usersService = new UsersService(_mockUserRepo.Object, _mockConfig.Object);
        }

        // TEST HÀM: RegisterAsync
        [Fact]
        public async Task RegisterAsync_ShouldReturnNull_WhenUsernameExists()
        {
            var dto = new UserRegisterDTO { Username = "existing_user" };
            _mockUserRepo.Setup(r => r.UserExistsAsync(dto.Username)).ReturnsAsync(true);

            var result = await _usersService.RegisterAsync(dto);

            Assert.Null(result); // Phải trả về null vì user đã tồn tại
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnUser_WhenRegistrationIsSuccessful()
        {
            var dto = new UserRegisterDTO
            {
                Username = "new_user",
                Password = "Password123",
                FullName = "New User",
                Email = "new@test.com"
            };

            _mockUserRepo.Setup(r => r.UserExistsAsync(dto.Username)).ReturnsAsync(false);

            _mockUserRepo.Setup(r => r.CreateAsync(It.IsAny<User>()))
                         .ReturnsAsync((User u) => u);

            var result = await _usersService.RegisterAsync(dto);

            Assert.NotNull(result);
            Assert.Equal(dto.Username, result.Username);
            Assert.Equal("HomeOwner", result.Role); // Phải gán đúng role mặc định
            Assert.NotEqual(dto.Password, result.Password);
            Assert.True(BCrypt.Net.BCrypt.Verify(dto.Password, result.Password));
        }


        // TEST HÀM: LoginAsync
        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenUserNotFound()
        {
            _mockUserRepo.Setup(r => r.GetByUsernameAsync("unknown_user")).ReturnsAsync((User?)null);

            var result = await _usersService.LoginAsync("unknown_user", "AnyPassword");

            Assert.Null(result);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenPasswordIsIncorrect()
        {
            var mockUser = new User
            {
                Username = "test_user",
                Password = BCrypt.Net.BCrypt.HashPassword("CorrectPassword") // Mã hóa pass thật trong DB
            };
            _mockUserRepo.Setup(r => r.GetByUsernameAsync(mockUser.Username)).ReturnsAsync(mockUser);

            var result = await _usersService.LoginAsync(mockUser.Username, "WrongPassword!");

            Assert.Null(result);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnUser_WhenCredentialsAreCorrect()
        {
            string plainPassword = "MySecretPassword";
            var mockUser = new User
            {
                Username = "test_user",
                Password = BCrypt.Net.BCrypt.HashPassword(plainPassword)
            };
            _mockUserRepo.Setup(r => r.GetByUsernameAsync(mockUser.Username)).ReturnsAsync(mockUser);

            var result = await _usersService.LoginAsync(mockUser.Username, plainPassword);

            Assert.NotNull(result);
            Assert.Equal(mockUser.Username, result.Username);
        }


        // TEST HÀM: GenerateJwtToken
        [Fact]
        public void GenerateJwtToken_ShouldReturnValidTokenString()
        {
            var user = new User { Username = "token_user", Role = "Admin" };

            var token = _usersService.GenerateJwtToken(user);

            Assert.False(string.IsNullOrEmpty(token)); // Token không được rỗng

            Assert.Equal(2, token.Count(c => c == '.'));
        }
    }
}