namespace APIDataTypes.Values
{

    public class Weight
    {
        public Weight(string id, double value)
        {
            Id = id;
            Value = value;
        }

        public string Id { get; }
        public double Value { get; }
    }
}