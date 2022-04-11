using System.Web;
using System.Web.Mvc;

namespace Analysis_of_dynamic_systems
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}