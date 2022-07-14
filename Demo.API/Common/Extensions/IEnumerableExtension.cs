using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Common.Extensions
{
    public static class IEnumerableExtension
    {

        /// <summary>
        /// Is list empty or null
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <returns></returns>
        public static bool IsEmptyOrNull<T>(this IEnumerable<T> source)
        {
            switch (source)
            {
                case null:
                    return true;
                case ICollection collection:
                    return collection.Count < 1;
                default:
                    return !source.Any();
            }
        }

        /// <summary>
        /// Is list not empty and not null
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <returns></returns>
        public static bool IsNotEmpty<T>(this IEnumerable<T> source)
        {
            if (source == null)
                return false;

            switch (source)
            {
                case ICollection collection:
                    return collection.Count > 0;
                default:
                    return source.Any();
            }
        }
    }
}
