namespace API.DataTypes.Values
{

    public class WeightItemData
    {
        public WeightItemData(string id, double value)
        {
            Id = id;
            Value = value;
        }

        public string Id { get; }
        public double Value { get; }
    }
}