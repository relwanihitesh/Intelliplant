const { z } = require('zod');

const uploadDocumentSchema = z.object({
    title: z.string().min(2, "title must be at least 2 characters"),
    department: z.enum([
        "HR", "Production", "Maintenance", "Quality", "Safety", "IT",
        "Finance", "Logistics", "Research and Development", "Sales",
        "Marketing", "Customer Service", "Legal", "Procurement",
        "Administration", "Training", "Security", "Environmental",
        "Engineering", "Project Management", "Business Development",
        "Public Relations",
    ]).optional(),
});

module.exports = { uploadDocumentSchema };