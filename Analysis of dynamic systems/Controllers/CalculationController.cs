using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.SqlClient;

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

        [HttpPost]
        public ActionResult saveFPA(string imgBase64)
        {
            
            var responce = new
            {
                Name = imgBase64,
            };

            return Json(responce);
        }
    }
}
