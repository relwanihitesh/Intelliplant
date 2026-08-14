const { z } = require('zod');

const departmentSchema = z.object({
    name: z.string().min(2, "department name must be at least 2 characters"),
    description: z.string().min(5, "description must be at least 5 characters"),
});

module.exports = { departmentSchema };