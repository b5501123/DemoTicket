using Model.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Model.Models
{
    public class TicketModel
    {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int TicketID { get; set; }

        public TicketTypeEnum Type { get; set; }

        public SeverityEnum Severity { get; set; }

        public string Summary { get; set; }

        public string Description { get; set; }

        public bool IsResolved { get; set; }

        public bool IsDel { get; set; }

        public DateTime? ResolvedTime { get; set; }

        public string CreateBy { get; set; }

        public DateTime CreateTime { get; set; }
    }
}
