using System.ComponentModel;
using System.Reflection;

namespace Common.Extensions
{
    public static class EnumExtension
    {
        public static List<T> GetList<T>()
            where T : System.Enum
        {
            return System.Enum.GetValues(typeof(T)).Cast<T>().ToList();
        }


        public static string GetDescription<T>(this T source)
             where T : System.Enum
        {
            FieldInfo fi = source.GetType().GetField(source.ToString());
            DescriptionAttribute[] attributes = (DescriptionAttribute[])fi.GetCustomAttributes(
             typeof(DescriptionAttribute), false);

            if (attributes.Length > 0) return attributes[0].Description;
            else return source.ToString();
        }
    }
}
