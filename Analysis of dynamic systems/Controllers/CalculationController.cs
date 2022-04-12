using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;


namespace Analysis_of_dynamic_systems.Controllers
{
    public class CalculationController : Controller
    {
        //
        // GET: /Calculation/

        public ActionResult attractor_phase_portrait()
        {
            return View();
        }

        public ActionResult lyapynov_exponent()
        {
            return View();
        }

        [HttpPost]
        public ActionResult saveFPA(string imgBase64)
        {
            var s = imgBase64.Split(',')[1];
            var image = Image.FromStream(new MemoryStream(Convert.FromBase64String(s)));

            image.Save("D:\\new.jpg", ImageFormat.Jpeg);
            
            var responce = new
            {
                Name = "Ошибок нет!!",
            };

            return Json(responce);
        }
    }
}
