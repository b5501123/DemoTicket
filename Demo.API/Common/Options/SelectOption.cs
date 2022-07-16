namespace Common.Options
{
    public class SelectOption
    {
        public string Name { get; set; }
        public int Value { get; set; }
    }

    public class SelectOption<T>
    {
        public string Name { get; set; }
        public T Value { get; set; }
    }
}
