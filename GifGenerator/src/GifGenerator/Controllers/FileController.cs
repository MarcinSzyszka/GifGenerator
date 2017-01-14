using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using GifGenerator.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GifGenerator.Controllers
{
	[Route("api/[controller]")]
	public class FileController : Controller
	{
		private string fileRepoPath;

		public FileController(AppSettings appSettings)
		{
			fileRepoPath = appSettings.FileRepo;
			if (!Directory.Exists(fileRepoPath))
			{
				Directory.CreateDirectory(fileRepoPath);
			}
		}

		[HttpGet("GetFile/{filename}")]
		public IActionResult Get(string filename)
		{
			var filePath = Path.Combine(fileRepoPath, filename);
			if (System.IO.File.Exists(filePath))
			{
				var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);

				return File(fs, "image/jpeg");
			}
			else
			{
				Response.StatusCode = (int)HttpStatusCode.InternalServerError;

				return Json("File doesn't exist");
			}

		}

		// GET: api/values
		[HttpPost]
		public async Task<IActionResult> Post()
		{
			var file = Request.Form.Files.FirstOrDefault();
			if (file != null)
			{
				var stream = file.OpenReadStream();
				//var fileName = $"{Guid.NewGuid().ToString()}.{Path.GetExtension(file.FileName)}";
				var fileName = $"{Guid.NewGuid().ToString()}.jpg";
				using (var fs = new FileStream(Path.Combine(fileRepoPath, fileName), FileMode.CreateNew))
				{
					await stream.CopyToAsync(fs);
				}

				return Json($"/api/file/GetFile/{fileName}");
			}
			else
			{
				Response.StatusCode = (int)HttpStatusCode.InternalServerError;

				return Json("There was an error while uploading the file");
			}

		}
	}
}
